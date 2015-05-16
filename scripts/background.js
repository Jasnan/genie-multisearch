'use strict';
angular.module('credise', ['ngStorage','ui.router','ngSanitize'])
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
			console.log(taburl);
			i++;
		})
	})

}


