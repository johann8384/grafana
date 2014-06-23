define([
  'angular',
  'underscore',
  'kbn'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('kibana.controllers');

  var seriesList = null;

  module.controller('KairosTargetCtrl', function($scope, $timeout) {

    $scope.init = function() {

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

      $scope.units        = [
	"milliseconds",
	"seconds",
	"minutes",
	"hours",
	"days",
	"weeks",
	"months",
	"years"
      ];

      if (!$scope.target.aggregators) {
	$scope.target.aggregators = [];
      }

      if (!$scope.target.groups) {
	$scope.target.groups = [];
      }

      if (!$scope.target.tags) {
	$scope.target.tags = [];
      }

      $scope.oldSeries = $scope.target.series;
      $scope.$on('typeahead-updated', function(){
	$timeout($scope.get_data);
      });
    };

    // Cannot use typeahead and ng-change on blur at the same time
    $scope.seriesBlur = function() {
      if ($scope.oldSeries !== $scope.target.series) {
	$scope.oldSeries = $scope.target.series;
	$scope.get_data();
      }
    };

    // called outside of digest
    $scope.listColumns = function(query, callback) {
      if (!$scope.columnList) {
	$scope.$apply(function() {
	  $scope.datasource.listColumns($scope.target.series).then(function(columns) {
	    $scope.columnList = columns;
	    callback(columns);
	  });
	});
      }
      else {
	return $scope.columnList;
      }
    };

    $scope.listSeries = function(query, callback) {
      if (!seriesList) {
	seriesList = [];
	$scope.datasource.listSeries().then(function(series) {
	  seriesList = series;
	  callback(seriesList);
	});
      }
      else {
	return seriesList;
      }
    };

  });

});
