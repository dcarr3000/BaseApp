//app.js
var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.config(funtion($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider
	
	.state('home', {
		url:'/home',
		templateUrl:'partial-home.html'
	})
	
	.state('about', {
		url:'/about',
		templateUrl:'partial-about.html'
	})
	
	.state('feedback', {
		url:'/feedback',
		templateUrl:'partial-feedback.html'
	});
});