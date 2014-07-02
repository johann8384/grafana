define([
  'angular',
  'underscore',
  'kbn'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('kibana.controllers');

  module.controller('KairosTargetCtrl', function($scope, $timeout, KairosDatasource) {

    $scope.init = function() {

      $scope.queryJson = "";

      $scope.tabs = ['Group by', 'Aggregators','Tags'];

      $scope.indexTab = -1;

      $scope.tagsList = {};

      $scope.aggregators  = [
        "avg",
        "dev",
        "max",
        "min",
        "rate",
        "sort",
        "sum",
        "least_squares",
        "percentile",
        "scale"
      ];


      $scope.units  = [
        "milliseconds",
        "seconds",
        "minutes",
        "hours",
        "days",
        "weeks",
        "months",
        "years"
      ];

      $scope.target.aggregators = [];
      $scope.target.groups = [];
      $scope.target.tags = {};

      $scope.oldSeries = $scope.target.series;
      $scope.$on('typeahead-updated', function(){
        $timeout(function(){
          $scope.get_data;
          $scope.queryJson = JSON.stringify(KairosDatasource.getPayload($scope.target));
        });
      });
    };

    // Cannot use typeahead and ng-change on blur at the same time
    $scope.seriesBlur = function() {
      if ($scope.oldSeries !== $scope.target.series) {
        $scope.oldSeries = $scope.target.series;
        $scope.get_data();
	$scope.queryJson = JSON.stringify(KairosDatasource.getPayload($scope.target));
      }
    };

    $scope.duplicate = function() {
      var clone = angular.copy($scope.target);
      $scope.panel.targets.push(clone);
    };

    $scope.listSeries = function(query, callback) {
      if (!$scope.seriesList) {
        $scope.seriesList = [];
        $scope.datasource.listSeries().then(function(series) {
          $scope.seriesList = series;
          callback($scope.seriesList);
        });
      }
      else {
        return $scope.seriesList;
      }
    };

    $scope.listTags = function() {
      $scope.datasource.listTags($scope.target.series).then(function(tags) {
        $scope.tagsList = tags;
          angular.forEach($scope.tagsList, function(value, key) {
            if (!angular.isDefined(this[key])) {
              this[key] = [];
            }
          }, $scope.target.tags);
      });
    };

    $scope.activeTab = function(index) {

      if ($scope.indexTab == index) {
        $scope.indexTab = -1;
      } else {
        $scope.indexTab = index;
      }

    }

    $scope.$watch('target.series',function(){
      if (angular.isDefined($scope.target.series)) {
        $scope.listTags();
      }
    });

    $scope.$watch('target.tags',function(){
        $scope.get_data();
        $scope.queryJson = JSON.stringify(KairosDatasource.getPayload($scope.target));
    },true);

    $scope.$watch('target.groups',function(){
      $scope.get_data();
      $scope.queryJson = JSON.stringify(KairosDatasource.getPayload($scope.target));
    },true);

    $scope.$watch('target.aggregators',function(){
      $scope.get_data();
      $scope.queryJson = JSON.stringify(KairosDatasource.getPayload($scope.target));
    },true);

    $scope.getTemplateTab = function(tab) {

      if (tab == 'Group by') {
        return "app/partials/kairosdb/group-by.html";
      }

      if (tab == 'Aggregators') {
        return "app/partials/kairosdb/aggregators.html";
      }

      if (tab == 'Tags') {
        return "app/partials/kairosdb/tags.html";
      }

    }

    $scope.manageTag = function(tag,value) {

      var index = $scope.target.tags[tag].indexOf(value);

      if ( index == -1) {
        $scope.target.tags[tag].push(value);
      } else {
        $scope.target.tags[tag].splice(index, 1);
      }

    }
  });
});
