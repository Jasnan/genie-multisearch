"use strict";
angular.module("credise", ["ngStorage", "ui.bootstrap", "ui.router", "ngSanitize"])
  .controller("popupCtrl", ["$scope", "$localStorage", "Languages", function($scope, $localStorage, Languages) {

    $scope.searchTerm = "";
    $scope.nativeLang = Languages.myNative();
    $scope.langMenu = Languages.langMenu();
    $scope.searchLang = Languages.searchLang();

    $scope.search = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        if ($scope.searchTerm) {
          var alltabs = Languages.getTabs($scope.nativeLang + $scope.searchLang);
          alltabs =
            alltabs
            .filter(function(tab) {
              return (tab.url.indexOf("[search]") > -1);
            })
            .map(function(tab) {
              var newtaburl = tab.url.replace("[search]", $scope.searchTerm);
              if (tab.translate) {
                var trurl = Languages.getTranslator($scope.nativeLang + $scope.searchLang);
                var newtaburlencoded = encodeURIComponent(newtaburl).replace(/'/g, "%27").replace(/"/g, "%22");
                newtaburl = trurl.replace("[translate]", newtaburlencoded);
              }

              return newtaburl;
            });

          createTabs(alltabs);
        }
      }
    };

    $scope.openSettings = function() {
      chrome.tabs.create({
        'url': "/views/options.html"
      });
    };
  }])

.controller('backgroundCtrl', ['$scope', '$localStorage', 'Languages', function($scope, $localStorage, Languages) {

  $scope.searchTerm = "";
  $scope.nativeLang = Languages.myNative();
  $scope.langMenu = Languages.langMenu();
  $scope.searchLang = Languages.searchLang();

  $scope.search = function(form) {
    // $scope.submitted = true;
    // if(form.$valid){
    if ($scope.searchTerm) {
      var alltabs = Languages.getTabs($scope.nativeLang + $scope.searchLang)
      alltabs =
        alltabs
        .filter(function(tab) {
          return (tab.url.indexOf("[search]") > -1);
        })
        .map(function(tab) {
          var newtaburl = tab.url.replace("[search]", $scope.searchTerm);
          if (tab.translate) {
            var trurl = Languages.getTranslator($scope.nativeLang + $scope.searchLang);
            var newtaburlencoded = encodeURIComponent(newtaburl).replace(/'/g, "%27").replace(/"/g, "%22");
            newtaburl = trurl.replace("[translate]", newtaburlencoded);
          }

          return newtaburl;
        });

      createTabs(alltabs);
    }
  };

  // A selection context onclick callback function.
  $scope.selectionOnClick = function(info) {

    $scope.searchLang = info.menuItemId;
    $scope.searchTerm = info.selectionText;
    $scope.search();
  };

  $scope.createContextMenu = function() {
    var context = "selection";
    var title = "Search '" + context + "' with Genie Multisearch";
    var id = chrome.contextMenus.create({
      "title": title,
      "contexts": [context]
    });

    

  $scope.langMenu.forEach(function(item){
    chrome.contextMenus.create({
      "id": item.code,
      "title": item.name,
      "parentId": id,
      "contexts": [context],
      "onclick": function(info) {
        $scope.selectionOnClick(info);
      }
    });
  });

    // for (var item in $scope.langMenu) {
    //   chrome.contextMenus.create({
    //     "id": item,
    //     "title": $scope.langMenu[item],
    //     "parentId": id,
    //     "contexts": [context],
    //     "onclick": function(info) {
    //       $scope.selectionOnClick(info);
    //     }
    //   });
    // }

    chrome.contextMenus.create({
      "type": "separator",
      "parentId": id,
      "contexts": [context]
    });

    chrome.contextMenus.create({
      "parentId": id,
      "title": "Options",
      "contexts": [context],
      "onclick": function() {
        $scope.openSettings();
      }
    });
  };

  $scope.openSettings = function() {
    chrome.tabs.create({
      'url': "/views/options.html"
    });
  };

  $scope.createContextMenu();
}])

.controller('modalCtrl', ['$scope', '$uibModalInstance', 'Languages', function($scope, $uibModalInstance, Languages) {
    $scope.ok = function() {
      Languages.loadDefaults();
      $uibModalInstance.close();
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }])
  .controller('optionsCtrl', ['$log', '$scope', '$state', '$localStorage', '$stateParams', '$uibModal', 'Languages', function($log, $scope, $state, $localStorage, $stateParams, $uibModal, Languages) {
    $scope.loadDefaults = function() {
      var id = $stateParams.id;

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: './modal.html',
        controller: 'modalCtrl',
        size: 'md',
      });

      modalInstance.result.then(function() {
        $state.go($state.current, {
          id: 'engdeu'
        });
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });


      // Languages.loadDefaults();

    };
    $scope.newtab = {};
    $scope.editmode = false;
    $scope.nativeLang = Languages.myNative();
    $scope.nativeMenu = Languages.nativeMenu();
    $scope.langMenu = Languages.langMenu('options');

    $scope.setNativeLang = function(argument) {
      $localStorage.nativeLang = argument || 'eng';
      $scope.nativeLang = argument;
      $scope.langMenu = Languages.langMenu();
    };

    $scope.currentState = $stateParams.id;
    var id = $stateParams.id;

    $scope.isTrAvailable = function() {
      if ($stateParams.id !== 'engeng') {
        return true;
      }
    };

  }])

.controller('tabsCtrl', ['$scope', '$timeout', '$localStorage', '$stateParams', 'Languages', 'tabs', 'mStatus',function($scope, $timeout, $localStorage, $stateParams, Languages, tabs, mStatus) {
  var id = $stateParams.id;
  $scope.tabs = tabs;
  $scope.mStatus = mStatus[0];
  $scope.editmode = false;
  $scope.saveBtnTxt = 'Save';
  $scope.newtab = {};
  $scope.translator = $localStorage[id].translator;
  $scope.edit = function(tab) {
    $scope.newtab = tab;
    $scope.editmode = true;
  };

  $scope.save = function(form) {
    $scope.submitted = true;
    var id = $stateParams.id;
    if (form.$valid) {
      if (!$scope.editmode) {
        var newtab = $localStorage[id].links || [];
        $scope.newtab.id = newtab.length;
        newtab.push($scope.newtab);
        $localStorage[id].links = newtab;
      } else {
        var newtab = $localStorage[id].links || [];
        newtab.forEach(function(tab) {
          if (tab.id == $scope.newtab.id) {
            tab = $scope.newtab;
          }
        });
        // $localStorage[id].links = newtab;
      }
      $scope.editmode = false;
      $scope.newtab = {};
      $scope.form.$setPristine();
    }
    $scope.load();
  };

  $scope.adSave = function(form) {
    var id = $stateParams.id;
    var nativeLang = $stateParams.nativeLang || 'eng';
    var currentLang = id.substr(3);
    $scope.saveBtnTxt = 'Saving changes..';
    var newArr = $localStorage.LangStack[nativeLang].map(function(item){
      if(item.code === currentLang){
        item.showInMenu = $scope.mStatus.showInMenu;
      }
      return item;
    });
    $localStorage.LangStack[nativeLang] = newArr;
    $scope.saveBtnTxt = 'Saved';
    
  };

  $scope.load = function() {
    var id = $stateParams.id;
    $scope.tabs = $localStorage[id].links;
    console.log("THE TAABS", $scope.tabs)
  };

  $scope.delete = function(tab) {
    var id = $stateParams.id;
    var items = $localStorage[id].links;
    var items = _.without(items, tab);

    $localStorage[id].links = items;
    $scope.tabs = $localStorage[id].links;
  };
}])

.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
})

.config(function($stateProvider) {
  $stateProvider
    .state('details', {
      url: '/{id}',
      templateUrl: '../views/eng.html',
      controller: 'tabsCtrl',
      resolve: {
        tabs: function($localStorage, $stateParams) {
          var id = $stateParams.id;
          if (typeof $localStorage[id] !== 'undefined') {
            return $localStorage[id].links;
          } else {
            return {};
          }
        },
        mStatus: function($localStorage, $stateParams) {
          var id = $stateParams.id;
          var nativeLang = id.substr(0,3);
          var currentLang = id.substr(3);
          return $localStorage.LangStack[nativeLang].filter(function(obj) {
            return obj.code == currentLang;
          });
        }
      }
    });
})

.run(function($state) {
  chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
  });

  chrome.browserAction.setBadgeText({
    text: 'GNIE'
  });

  $state.go("details");

});


// Vanila JS Functions Goes Here

function createTabs(alltabs) {
  console.log("Creating tabs.....");
  var i = 0;
  alltabs.forEach(function(taburl) {

    chrome.tabs.create({
      index: i,
      url: taburl
    }, function(tab) {
      console.log(taburl);
      i++;
    });
  });

}
