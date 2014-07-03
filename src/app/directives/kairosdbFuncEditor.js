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
    //Kairos aggregators panel
       .directive('kairosAggregators', function($compile) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/partials/kairosdb/aggregator-by.html'
        templateUrl: 'app/partials/kairosdb/aggregator-by.html',

        link: function(scope, elem) {
          scope.newElem = function(type) {

            var group_1 = ['avg','dev','min','max','sum','count','least_squares'];

            if (group_1.indexOf(type) != -1) {
              return {
                name:type,
                align_sampling:'true',
                sampling:
                {
                  value:'1',
                  unit:'milliseconds'
                }
              }        
            };

            if (type == 'div') {
              return {
                name:'div',
                divisor:'1'
              }
            }

            if (type == 'rate') {
              return {
                name:'rate',
                unit:'milliseconds'
              }
            }

            if (type == 'scale') {
              return {
                name:'scale',
                factor:'1.0'
              }
            }

            if (type == 'percentile') {
              return {name:'percentile', percentile:"0.75" ,sampling:{value:'1',unit:'milliseconds'}}
            }
        }

	      return {
          name:'percentile',
          percentile:"0.75",
          sampling:
          {
            value:'1',
            unit:'milliseconds'
          }
	      }
      }            

      scope.$watch('newAgreg',function(){
        if (angular.isDefined(scope.newAgreg)) {
           scope.target.aggregators.push(scope.newAgreg.value);
        }
      });

      scope.remove = function(index){
        scope.target.aggregators.splice(index,1);
      }
    })
      //Kairos group-by panel
    .directive('kairosGroupby', function($compile) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/partials/kairosdb/groups.html',

        link: function(scope, elem) {
          scope.listGroups = [];

          scope.newTag = function() {
            var tags = [];
            var first = false;
            angular.forEach(scope.tagsList, function(value, key) {
              if (!first) {
                this.push(key);
                first = true;
              }
            }, tags);
            return {
              name:'tag',
              tags:tags
            }
          }

          scope.newTime = function() {
            return {
              name:'time'
              ,group_count:'1'
              ,range_size:
                {value:'1'
                ,unit:'milliseconds'}
              }
            }
          scope.newValue = function() {
            return {
              name:'value',
              range_size:'1'
            }
          }

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
      }
    })
  })