'use strict';

angular.module('credise')
	.factory('Languages',function($localStorage, $http){
		var defaultNative = 'eng';
		var langStack = {
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

		var translators = {
			"deu": "http://translate.google.com/translate?hl=en&sl=de&tl=en&u=[translate]",
			"fre": "http://translate.google.com/translate?hl=en&sl=fr&tl=en&u=[translate]"
			// "fre": "http://translate.google.com/translate?sl=fr&tl=en&hl=en&ie=UTF-8&u=[translate]"
		};

		return {
			native: function(){
				var native = $localStorage.nativeLang || defaultNative;
				return native;
			},
			options: function(){
				var native = $localStorage.nativeLang || defaultNative;
				return langStack[native];
			},
			searchLang: function(){
				return $localStorage.searchLang || "eng";
			},
			getTabs: function(id){
				return $localStorage[id]
			},
			getTranslator: function(lang){
				return translators[lang];
			},
			loadDefaults: function(id){

				$http.get('../assets/js/defaults.json')
				.success(function(res){
					// alert(JSON.stringify(res))
					for (var key in res) {
					  if (res.hasOwnProperty(key)) {
					  	$localStorage[key] = res[key];
					    // alert(key + " -> " + res[key]);
					  }
					}					
				})
				.error(function(err){
					console.log(err)
				})
			}
		}
	})