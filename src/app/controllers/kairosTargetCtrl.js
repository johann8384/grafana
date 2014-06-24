define([
  'angular',
  'underscore',
  'kbn'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('kibana.controllers');

  module.controller('KairosTargetCtrl', function($scope, $timeout) {

    $scope.init = function() {

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
      });
    };

    $scope.$watch('target.series',function(){
      if (angular.isDefined($scope.target.series)) {
	console.log("update tags for ",$scope.target.series);
	$scope.listTags();
      }

    });

  });

});
