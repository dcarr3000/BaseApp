//app.js
var routerApp = angular.module('routerApp', ['ui.router']);	//sets parameters for function call
routerApp.config(function($stateProvider,$urlRouterProvider) {	//function call
	$urlRouterProvider.otherwise('/home');			//initalize route and set default page
	$stateProvider.state({					//initialize states and where they are called from
		name:'map',
		url:'/map',
		controller:'MapController',
		controllerAs:'MapController',
		templateUrl:'partial-map.html'
		},
		{
		name:'home',				//sets path for page and states where content is
		url:'/home',				
		templateUrl:'partial-home.html'
		},
		{
		name:'about',
		url:'/about',
		templateUrl:'partial-about.html'
		},
		{
		name:'feedback', 
		url:'/feedback',
		templateUrl:'partial-feedback.html'
	});
});
