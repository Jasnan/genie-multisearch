'use strict';
angular.module('credise', ['ngStorage','ui.router','ngSanitize'])
	.controller('backgroundCtrl', ['$scope','$localStorage','Languages', function($scope,$localStorage,Languages){

		$scope.searchTerm = "";
		$scope.nativeLang = Languages.native();
		$scope.langOptions = Languages.options();
		$scope.searchLang = Languages.searchLang();

		$scope.search = function(form){
			$scope.submitted = true;
			if(form.$valid){
				if ($scope.searchTerm){
					var alltabs = Languages.getTabs($scope.nativeLang + $scope.searchLang)

					var alltabs =
						alltabs
						.filter(function(tab){
							return (tab.url.indexOf("[search]") > -1);
						})
						.map(function(tab){
							return tab.url.replace("[search]",$scope.searchTerm);
						})

					createTabs(alltabs)
				} 
			}
		}

		$scope.openSettings = function(){
			chrome.tabs.create({'url': "/views/options.html" } )
		}

	}])

	.run(function() {
		chrome.runtime.onInstalled.addListener(function (details) {
			console.log('previousVersion', details.previousVersion);
		});

		chrome.browserAction.setBadgeText({text: 'CREDISE'});
	});


function createTabs (alltabs){
	var i = 0;
	alltabs.forEach(function(taburl){
		chrome.tabs.create({
			index: i,
			url: taburl
		}, function(tab){
			console.log(tab.url);
			i++;
		})
	})

}