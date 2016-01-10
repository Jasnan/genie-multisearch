(function() {
  'use strict';
  angular
    .module('credise')
    .factory('Languages', factory);
  factory.$inject = ['$localStorage','$http'];
  /* @ngInject */
  function factory($localStorage, $http) {
    var Natives = {
      'eng': 'English',
      'deu': 'Deutsch',
      'rus': 'Russian',
      'rum': 'Romanian (Română)'
    };
    var LangStack = {
      "eng": [
        {
          "code":"ara",
          "name":"Arabic (الْعَرَبيّة)",
          "showInMenu": true
        },
        {
          "code":"nld",
          "name":"Dutch (Nederlands)",
          "showInMenu": true
        },
        {
          "code":"eng",
          "name":"English",
          "showInMenu": true
        },
        {
          "code":"fre",
          "name":"French (Français)",
          "showInMenu": true
        },
        {
          "code":"deu",
          "name":"German (Deutsch)",
          "showInMenu": true
        },
        {
          "code":"heb",
          "name":"Hebrew",
          "showInMenu": true
        },
        {
          "code":"hin",
          "name":"Hindi (हिन्दी)",
          "showInMenu": false
        },
        {
          "code":"ita",
          "name":"Italian (italiano)",
          "showInMenu": true
        },
        {
          "code":"jpn",
          "name":"Japanese (日本語)",
          "showInMenu": true
        },
        {
          "code":"kor",
          "name":"Korean",
          "showInMenu": true
        },
        {
          "code":"zho",
          "name":"Mandarin (中文)",
          "showInMenu": true
        },
        {
          "code":"pol",
          "name":"Polish (Polski)",
          "showInMenu": true
        },
        {
          "code":"por",
          "name":"Portuguese (português)",
          "showInMenu": true
        },
        {
          "code":"rum",
          "name":"Romanian (Română)",
          "showInMenu": true
        },
        {
          "code":"spa",
          "name":"Spanish (Español)",
          "showInMenu": true
        },
        {
          "code":"rus",
          "name":"Russian",
          "showInMenu": true
        }
      ],
      "deu": [
        {
          "code":"eng",
          "name":"English",
          "showInMenu": true
        }
      ],
      "rum": [
        {
          "code":"eng",
          "name":"English",
          "showInMenu": true
        }
      ],
      "rus": [
        {
          "code":"eng",
          "name":"English",
          "showInMenu": true
        }
      ]
    };

    var service = {
      langMenu: langMenu,
      loadDefaults: loadDefaults,
      nativeMenu: nativeMenu,
      myNative: myNative,
      searchLang: searchLang,
      getTabs: getTabs,
      getTranslator: getTranslator
    };
    return service;
    ////////////////
    function langMenu(arg) {
      arg = typeof arg !== 'undefined' ?  arg : 'menu';
      var nativeCode = $localStorage.nativeLang || 'eng';
      if($localStorage.hasOwnProperty('LangStack')){
        var asd = $localStorage['LangStack'][nativeCode];
        if(arg !== 'menu'){
          return asd;
        }
        return asd
          .filter(function(item) {
            console.log(item.showInMenu);
            return (item.showInMenu == true || item.showInMenu == 'true');
          });
      }
    }

    function loadDefaults(id) {
      $http.get('http://jasnan.com/lang-resources.json')
        .then(function(items) {
          $localStorage['LangStack'] = LangStack;
          items.data.forEach(function(lang) {
            var shortcode = 'eng' + lang.shortcode;
            $localStorage[shortcode] = {};
            $localStorage[shortcode].translator = lang.translator;
            $localStorage[shortcode].links = lang.resources[0][shortcode];
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function nativeMenu() {
      return Natives;
    }

    function myNative() {
      return $localStorage.nativeLang || 'eng';;
    }

    function searchLang() {
      return $localStorage.searchLang || "eng";
    }

    function getTabs(id) {
    	console.log("The tabs")
      return $localStorage[id].links;
    }

    function getTranslator(lang) {
        return $localStorage[lang].translator;
    }
  }
})();
