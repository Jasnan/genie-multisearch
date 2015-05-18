'use strict';
angular.module('credise', ['ngStorage','ui.router','ngSanitize'])
	.controller('popupCtrl', ['$scope','$localStorage','Languages', function($scope,$localStorage,Languages){

		$scope.searchTerm = "";
		$scope.nativeLang = Languages.native();
		$scope.langOptions = Languages.options();
		$scope.searchLang = Languages.searchLang();

		console.log($scope.langOptions)
		$scope.search = function(form){
			$scope.submitted = true;
			if(form.$valid){
				if ($scope.searchTerm){
					var alltabs = Languages.getTabs($scope.nativeLang + $scope.searchLang)
					console.log(alltabs)
					var alltabs =
						alltabs
						.filter(function(tab){
							return (tab.url.indexOf("[search]") > -1);
						})
						.map(function(tab){
							var newtaburl = tab.url.replace("[search]",$scope.searchTerm);
							if(tab.translate){
								var trurl = Languages.getTranslator($scope.searchLang);
								var newtaburlencoded = encodeURIComponent(newtaburl).replace(/'/g,"%27").replace(/"/g,"%22");
								newtaburl = trurl.replace("[translate]",newtaburlencoded);
							}

							return newtaburl
						})

					createTabs(alltabs)
				} 
			}
		}

		$scope.openSettings = function(){
			chrome.tabs.create({'url': "/views/options.html" } )
		}
	}])

	.controller('backgroundCtrl', ['$scope','$localStorage','Languages', function($scope,$localStorage,Languages){

		$scope.searchTerm = "";
		$scope.nativeLang = Languages.native();
		$scope.langOptions = Languages.options();
		$scope.searchLang = Languages.searchLang();

		console.log($scope.langOptions)
		$scope.search = function(form){
			// $scope.submitted = true;
			// if(form.$valid){
				if ($scope.searchTerm){
					var alltabs = Languages.getTabs($scope.nativeLang + $scope.searchLang)
					console.log(alltabs)
					var alltabs =
						alltabs
						.filter(function(tab){
							return (tab.url.indexOf("[search]") > -1);
						})
						.map(function(tab){
							var newtaburl = tab.url.replace("[search]",$scope.searchTerm);
							if(tab.translate){
								var trurl = Languages.getTranslator($scope.searchLang);
								var newtaburlencoded = encodeURIComponent(newtaburl).replace(/'/g,"%27").replace(/"/g,"%22");
								newtaburl = trurl.replace("[translate]",newtaburlencoded);
							}

							return newtaburl
						})

					createTabs(alltabs)
				} 
			// }
		}

		// A selection context onclick callback function.
		$scope.selectionOnClick = function(info){
			
			$scope.searchLang = info.menuItemId;
			$scope.searchTerm = info.selectionText;
			$scope.search();
		}

		$scope.createContextMenu = function(){
			var context = "selection";
			var title = "Search '" + context + "' with Credise";
			var id = chrome.contextMenus.create({"title": title, "contexts":[context]});

			for (var item in $scope.langOptions) {
					chrome.contextMenus.create({"id":item, "title": $scope.langOptions[item], "parentId": id, "contexts":[context], "onclick": function(info){
						$scope.selectionOnClick(info)}});
			}

			chrome.contextMenus.create({"type":"separator", "parentId": id, "contexts":[context]});

			chrome.contextMenus.create({"parentId": id, "title":"Options", "contexts":[context],"onclick": function(){
				$scope.openSettings();
			}});
	
		}

		$scope.openSettings = function(){
			chrome.tabs.create({'url': "/views/options.html" } )
		}

		$scope.createContextMenu();
	}])

	.controller('optionsCtrl', ['$scope','$localStorage', '$stateParams', 'Languages', function($scope, $localStorage, $stateParams, Languages) {

		$scope.loadDefaults = function(){			
			Languages.loadDefaults()
		}

	  	$scope.newtab = {};
	  	$scope.editmode = false;
	  	$scope.nativeLang = Languages.native();
	  	$scope.nativeLangs = Languages.getNativeLangs();
	  	$scope.availableLangs = Languages.options();

	  	$scope.setNativeLang = function (argument) {
		  	$localStorage.nativeLang = argument || 'eng';
		  	$scope.nativeLang = argument;
		  	$scope.availableLangs = Languages.options();
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

		$scope.travailability = true
	}])

	.filter('checkmark', function() {
	  return function(input) {
	    return input ? '\u2713' : '\u2718';
	  };
	})

	.config(function ($stateProvider) {
		$stateProvider
		.state('details', {      	
		url: '/{id}',
		templateUrl: '../views/eng.html',
		controller: 'optionsCtrl'
		})
	})

	.run(function() {
		chrome.runtime.onInstalled.addListener(function (details) {
			console.log('previousVersion', details.previousVersion);
		});

		chrome.browserAction.setBadgeText({text: 'GNIE'});
		
	});


	// Vanila JS Functions Goes Here

	function createTabs (alltabs){
		var i = 0;
		alltabs.forEach(function(taburl){

			chrome.tabs.create({
				index: i,
				url: taburl
			}, function(tab){
				console.log(taburl);
				i++;
			})
		})

	}