'use strict';

console.log('\'Allo \'Allo! Popup');

var backgroundPage = chrome.extension.getBackgroundPa

document.querySelector('button#search').addEventListener('click', function(){
	var searchTerm = document.getElementById('search-box').value;
	if(searchTerm){
		backgroundPage.handleButtonClick(searchTerm);
	}
	
})

document.querySelector('button#settings').addEventListener('click', function(){
	backgroundPage.handleOptionClick();
})

