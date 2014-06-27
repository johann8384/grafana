define([
  'angular',
  'underscore',
  'jquery',
],
function (angular, _, $) {
  'use strict';

  angular
    .module('kibana.directives')
    .directive('kairosdbFuncEditor', function($compile) {

      return {
	restrict: 'A',
	link: function postLink($scope, elem) {


	}
      };

    })

       .directive('kairosAggregators', function($compile) {

      return {
	restrict: 'E',
	scope: true,
	templateUrl: 'app/partials/kairosdb/aggregator-by.html'

      };

    })

    .directive('kairosGroupby', function($compile) {

      return {

	restrict: 'E',
	scope: true,
	templateUrl: 'app/partials/kairosdb/groups.html',
	
  link: function(scope, elem) {

	  scope.listGroups = [];

	  scope.newTag = function() {
	    return {name:'tag',tags:[]}
	  }

	  scope.newTime = function() {
	    return {name:'time',group_count:'',range_size:{value:'',unit:''}}
	  }

	  scope.newValue = function() {
	    return {name:'value',range_size:''}
	  }
<<<<<<< HEAD
	  scope.$watch('newType',function(){
	    if (angular.isDefined(scope.newType)) {
	       scope.target.groups.push(scope.newType.value);
	    }
	  });

    scope.manageTagInGroup = function(group,tagName) {
      var indexTag = group.tags.indexOf(tagName);

      if ( indexTag == -1) {
        group.tags.push(tagName);
      } else {
        group.tags.splice(indexTag, 1);
      }
    }

    scope.remove = function(index){
      scope.target.groups.splice(index,1);
    }
	}
 };
});