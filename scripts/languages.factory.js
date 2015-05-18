'use strict';

angular.module('credise')
	.factory('Languages',function($localStorage, $http){
		var defaultNative = 'eng';
		var nativeLangStack = {'eng':'English','deu':'Deutsch','rum':'Română'};
		var langStack = {
			"eng":  {	
						"ara":"Arabic (الْعَرَبيّة)",
						"eng":"English",
						"fre":"French (Français)",
						"deu":"German (Deutsch)",						
						"heb":"Hebrew",
						"hin":"Hindi (हिन्दी)",
						"ita":"Italian (italiano)",	
						"jpn":"Japanese (日本語)",
						"kor":"Korean",	
						"chi":"Mandarin (中文)",	
						"pol":"Polish (Polski)",
						"por":"Portuguese (português)",					
		  				"rum":"Romanian (Română)",	
		  				"spa":"Spanish (Español)"
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
			getNativeLangs: function(){
				return nativeLangStack;
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