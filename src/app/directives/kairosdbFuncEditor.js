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

	  scope.$watch('newType',function(){
	    if (angular.isDefined(scope.newType)) {
	       scope.listGroups.push(scope.newType.value);
	    }
	  });

	}
      };

    });

});