'use strict';

angular.module('credise')
	.factory('Languages',function($localStorage){
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
			}
		}
	})