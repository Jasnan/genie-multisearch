'use strict';

angular.module('credise')
  	.config(function ($stateProvider) {
    $stateProvider
      .state('details', {      	
        url: '/{id}',
        templateUrl: '../views/eng.html',
        controller: 'optionsCtrl'
      })
  });