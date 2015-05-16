'use strict';

angular.module('credise')
	.controller('optionsCtrl', function($scope, $localStorage, $stateParams, Languages) {
		$scope.message = "working!!"
		$scope.loadDefaults = function(){			
			Languages.loadDefaults()
			// $state.go($state.current, {}, {reload: true});
		}
	  	$scope.newtab = {};
	  	$scope.editmode = false;
	  	$scope.nativeLang = $localStorage.nativeLang || 'eng';
	  	$scope.nativeLangs = {'eng':'English','deu':'Deutsch','rum':'Română'};
	  	$scope.langStack = {
							"eng":  {	
										"eng":"English",
										"chi":"中文 (Mandarin Chinese)",
										"deu":"Deutsch",
										"epo":"Esperanto",
						  				"fre":"Français",
						  				"jpn":"日本語 (Japanese)",
						  				"pol":"Polski",
						  				"rum":"Română",	
						  				"spa":"Español"
							  		},
							"deu": 	{	"eng":"English" },
							"rum": 	{	"eng":"English" }
							};

	  	$scope.availableLangs = $scope.langStack[$scope.nativeLang];

	  $scope.setNativeLang = function (argument) {
	  	$localStorage.nativeLang = argument || 'eng';
	  	$scope.nativeLang = argument;
	  	$scope.availableLangs = $scope.langStack[argument];
	  	console.log($scope.availableLangs);
	  }

	  var id = $stateParams.id;
	  // $scope.setLangs("English");
	  $scope.save = function(form) {
	  	$scope.submitted = true;
	  	
	  	if(form.$valid){
	  		if(!$scope.editmode){
	  			var newtab = $localStorage[id] || [];
	  			$scope.newtab.id = newtab.length;
	  			newtab.push($scope.newtab);

	  			$localStorage[id] = newtab;
	  		} else {
	  			var newtab = $localStorage[id] || [];
	  			newtab.forEach(function(tab){
	  				if (tab.id == $scope.newtab.id) {
	  					tab = $scope.newtab;
	  				}
	  			});

	  			$localStorage[id] = newtab;
	  		}
	  		$scope.editmode = false;
	  		$scope.newtab = {};
	  		$scope.form.$setPristine(); 
	  	}
	  	$scope.load();		
	  }
	   
	  $scope.load = function() {
	  	var id = id || $stateParams.id; 
	  	alert(id)
	    $scope.tabs = $localStorage[id];
	    console.log($scope.tabs)
	  }

	  
	  $scope.delete = function(tab){
	  	var items = $localStorage[id];
	  	var items = _.without(items, tab);

	  	$localStorage[id] = items;
	  	$scope.tabs = $localStorage[id];
	  }

	  $scope.edit = function(tab){
	  	$scope.newtab = tab
	  	$scope.editmode = true
	  	console.log($scope.newtab)
	  }

	  $scope.tabs = $localStorage[id];

	})

	.filter('checkmark', function() {
	  return function(input) {
	    return input ? '\u2713' : '\u2718';
	  };
	});