define([
  'angular',
  'lodash',
  'kbn',
  'moment'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('OpenTSDBMDatasource', function($q, $http) {

    function OpenTSDBMDatasource(datasource) {
      this.type = 'opentsdbM';
      this.editorSrc = 'app/partials/opentsdbM/editor.html';
      this.url = datasource.url;
      this.name = datasource.name;
      this.supportMetrics = true;
    }

    OpenTSDBMDatasource.prototype.query = function(options) {
      var start = convertToTSDBTime(options.range.from);
      var end = convertToTSDBTime(options.range.to);

      return this.performDirectQuery(options.targets, start, end)
        .then(_.bind(function(response) {
          var result = _.map(response.data, _.bind(function(metricData) {
            return transformMetricDataDirectQuery(metricData);
          }, this));
          return { data: result };
        }, options));
    };

    OpenTSDBMDatasource.prototype.performDirectQuery = function(targets, startTime, endTime) {
      var options = {
        method: 'GET',
        url: this.url + directQueryURL(targets, startTime, endTime)
      };
      return $http(options);
    };

    function directQueryURL(targets, startTime, endTime) {
      var url = '/api/query/query?';

      if (startTime) {
        url += 'start=' + startTime;
      }

      if (endTime) {
        url += '&end=' + endTime;
      }

      for (var i = 0, length = targets.length; i < length; i++) {
        if (targets[i].directQueryText) {
          url += '&x=' + convertToQuery(targets[i]);
        }
      }

      return url;
    }

    function convertToQuery(target) {
      return target.directQueryText;
    }

    function transformMetricDataDirectQuery(md) {
      var dps = [],
          metricLabel = null;

      metricLabel = md.expression;

      _.each(md.dps, function (v, k) {
        dps.push([v, k]);
      });

      return { target: metricLabel, datapoints: dps };
    }

    function convertToTSDBTime(date) {
      if (date === 'now') {
        return null;
      }

      date = kbn.parseDate(date);

      return date.getTime();
    }

    return OpenTSDBMDatasource;
  });

});
