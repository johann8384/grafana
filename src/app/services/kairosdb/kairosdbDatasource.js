define([
  'angular',
  'underscore',
  'kbn'
],
function (angular, _, kbn) {
  'use strict';

  var module = angular.module('kibana.services');

  module.factory('KairosDatasource', function($q, $http) {

    function KairosDatasource(datasource) {
      this.type = 'kairosdb';
      this.editorSrc = 'app/partials/kairosdb/editor.html';
      this.url = datasource.url;
      this.name = datasource.name;
    }

    return KairosDatasource;
  });

});
