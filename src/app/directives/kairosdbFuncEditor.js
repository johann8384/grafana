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

    });

});