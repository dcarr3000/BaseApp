//app.js
var routerApp = angular.module('routerApp', ['ui.router']);	//sets parameters for function call
routerApp.config(funtion($stateProvider, $urlRouterProvider) {	//function call
	$urlRouterProvider.otherwise('/home');			//initalize route and set default page
	$stateProvider						//initialize states and where they are called from
	
	.state('home', {					//sets path for page and states where content is
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
