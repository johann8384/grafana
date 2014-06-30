define([
  'angular',
  'underscore',
  'jquery',
  'config',
  'kbn',
  'moment'
],
function (angular, _, $, config, kbn, moment) {
  'use strict';

  var module = angular.module('kibana.services');

  module.factory('KairosDatasource', function(dashboard, $q, $http) {

    function KairosDatasource(datasource) {
      this.type = 'kairosdb';
      this.basicAuth = datasource.basicAuth;
      this.url = datasource.url;
      this.username = datasource.username;
      this.password = datasource.password;
      this.editorSrc = 'app/partials/kairosdb/editor.html';
      this.name = datasource.name;

      this.templateSettings = {
	interpolate : /\[\[([\s\S]+?)\]\]/g,
      };
    }

    KairosDatasource.prototype.query = function(filterSrv, options) {
      //console.log("ds query");
      //console.log(filterSrv);
      //console.log(options);

      var payload = {};

      this.translateTime(options.range.from, payload, "start");
      this.translateTime(options.range.to, payload, "end");

      var delta = this.deltaTime(options.range.from, options.range.to);
      var value = delta / options.maxDataPoints;

      payload.cache_time = 0;
      payload.metrics = _.chain(options.targets).reject(function(target) {
	return (!target.series /*|| !target.column*/ || target.hide);
      }).map(function(target) {

	//console.log("QUERY!!!! ",target);

	var obj   = {};
	obj.name  = target.series;
	obj.tags  = target.tags;
	if (target.aggregators.length>0) {
	  obj.aggregators = target.aggregators;
	}
	if (target.groups.length>0) {
	  obj.group_by = target.groups;
	}
	console.log(obj);

	return obj;
      })
      .value();

      //console.log("Payload2", payload);

      var query = {
	method: 'POST',
	url: '/api/v1/datapoints/query',
	data: payload,
	/*
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	}
	*/
      };
      return this.doKairosDBRequest(query).then(handleKairosDBQueryResponse);
    }

    KairosDatasource.prototype.listSeries = function() {
      return this.doKairosDBRequest({url:'/api/v1/metricnames'}).then(function(results) {
	if (!results.data) {
	  return [];
	}

	return results.data.results
      });
    };

    KairosDatasource.parseTags = function(query_tags) {
      return query_tags.queries[0].results[0].tags;
    }

    KairosDatasource.prototype.listTags = function(series) {

      var payload = {
	metrics:[{'tags':{},'name':series}],
	cache_time:0,
	start_absolute:0
      };

      var query = {
	method: 'POST',
	url:'/api/v1/datapoints/query/tags',
	data: payload,
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	}
      };

      return this.doKairosDBRequest(query).then(function(results) {
	return angular.isDefined(results.data) ? KairosDatasource.parseTags(results.data) : {}
      });
    };

    KairosDatasource.prototype.doKairosDBRequest = function(options) {
      if (!options.method) {
	options.method = 'GET';
      }

      options.url = this.url + options.url;
      return $http(options);
    };

    function handleKairosDBQueryResponse(results) {
      var output = [];

      _.each(results.data.queries, function(series) {
	var sample_size = series.sample_size;

	_.each(series.results, function(result, index) {

	  var target = result.name;
	  var datapoints = [];

	  for(var i = 0; i < result.values.length; i++) {
	    var t = Math.floor(result.values[i][0] / 1000);
	    var v = result.values[i][1];
	    datapoints[i] = [v,t];
	  }

	  output.push({ target:target, datapoints:datapoints });
	});
      });

      var output2 = { data: _.flatten(output) };

      return output2;
    }

    KairosDatasource.prototype.translateTime = function(date, response_obj, start_stop_name) {
      if (_.isString(date)) {
	if (date === 'now') {
	  return;
	}
	else if (date.indexOf('now-') >= 0) {
	  name = start_stop_name + "_relative";

	  date = date.substring(4);
	  var re_date = /(\d+)\s*(\D+)/;
	  var result = re_date.exec(date);
	  if (result) {
	    var value = result[1];
	    var unit = result[2];
	    switch(unit) {
	      case 'ms':
		unit = 'milliseconds';
		break;
	      case 's':
		unit = 'seconds';
		break;
	      case 'm':
		unit = 'minutes';
		break;
	      case 'h':
		unit = 'hours';
		break;
	      case 'd':
		unit = 'days';
		break;
	      case 'w':
		unit = 'weeks';
		break;
	      case 'M':
		unit = 'months';
		break;
	      case 'y':
		unit = 'years';
		break;
	      default:
		break;
	    }
	    response_obj[name] = {
	      "value": value,
	      "unit": unit
	    };
	    return;
	  }
	  return;
	}

	date = kbn.parseDate(date);
      }
      name = start_stop_name + "_absolute";

      date = moment.utc(date);

      if (dashboard.current.timezone === 'browser') {
	date = date.local();
      }

      if (config.timezoneOffset) {
	date = date.zone(config.timezoneOffset);
      }

      response_obj[name] = date.valueOf();
    };

    KairosDatasource.prototype.datetime = function(kibana_datetime) {

      var date = kbn.parseDate(kibana_datetime);
      date = moment.utc(date);
      return date;
    };

    KairosDatasource.prototype.deltaTime = function(start, end) {
      var startdate = this.datetime(start);
      var enddate = this.datetime(end);

      var delta = enddate.diff(startdate, 'milliseconds');
      return delta;
    };

    return KairosDatasource;

  });

});