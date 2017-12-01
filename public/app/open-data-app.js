(function(angular){
    'use strict';
    
    var app = angular.module('app', ['ui.router', 'ngResource', 'uiGmapgoogle-maps', 'ngAnimate']);
    

    
    //module config
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        
        $stateProvider.state({
            name: 'dashboard',
            url: '/dashboard',
            controller: 'DashboardStateController', //Matches controller name as defined in angular
            controllerAs: 'DashboardStateController', //Gives the controller a specific name in the html template/view
            template: '<p ng-bind="DashboardStateController.bindingContainer | json"></p>', //with a node server, you should be able to make use 
            resolve: {
                lafayetteArt: ['OpenDataQueryService', function(OpenDataQueryService){
                    var queryParams = {
                       feature: 'Lafayette_Public_Art',
                       layer: '0',
                       where: '1=1',
                       outFields: '*'
                    };
                    
                    return OpenDataQueryService.query(queryParams);
                }]
            }
            
            
        });
        
        $stateProvider.state({
            name:'map',
            url:'/map',
            controller: 'MapController',
            controllerAs: 'MapController',
            templateUrl: 'partial-map.html',
            resolve: {
                
                Lafayette_Public_Art:['OpenDataQueryService', function(OpenDataQueryService){
                    var queryParams = {
                       feature: 'Lafayette_Public_Art',
                       layer: '0',
                       where: '1=1',
                       outFields: '*'
                    };
                    
                    return OpenDataQueryService.query(queryParams);
                }],
				Parks_and_Recreation:['OpenDataQueryService', function(OpenDataQueryService){
                    var queryParams = {
                       feature: 'Parks_and_Recreation',
                       layer: '0',
                       where: '1=1',
                       outFields: '*'
                    };
                    
                    return OpenDataQueryService.query(queryParams);
                }]
				
            }
            
        });
        
      
        
         $stateProvider.state({
            name:'home',
            url:'/home',
            
            templateUrl: 'partial-home.html'
            
        });
        
         $stateProvider.state({
            name:'feedback',
            url:'/feedback',
            
            templateUrl: 'partial-feedback.html'
            
        });
        
        $stateProvider.state({
            name: 'spatialQueryExample',
            url: '/spatialQueryExample',
            controller: 'DashboardStateController', //Matches controller name as defined in angular
            controllerAs: 'DashboardStateController', //Gives the controller a specific name in the html template/view
            template: '<p ng-bind="DashboardStateController.bindingContainer | json"></p>', //with a node server, you should be able to make use of templateUrl here
            resolve: {
                lafayetteArt: ['OpenDataQueryService', function(OpenDataQueryService){
                    var queryParams = {
                       feature: 'Lafayette_Public_Art',
                       layer: '0',
                       outFields: '*',
                       //geo fields below
                       distance: '20',
                       units: 'esriSRUnit_Meter',
                       geometryType: 'esriGeometryPoint',
                       geometry:'-92.017437,30.224518', //<longitude, latitude>
                       inSR: '4326',
                       spatialRel: 'esriSpatialRelContains',
                       returnGeometry: true
                    };
                    
                    return OpenDataQueryService.query(queryParams);
                }]
            }
        });
        
        $urlRouterProvider.otherwise('home');
    }]);
    
    app.factory('OpenDataConstants', function(){
        return {
            featureServices: {
                //example instance of base url: https://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/query
                arcGISsvcs: 'https://services.arcgis.com/:apiToken/arcgis/rest/services/:feature/FeatureServer/:layer/:action'
            }
        }
    });
    
    app.controller('MapController', function($http, OpenDataQueryService) {
        var viewModel = this;
        
        this.map = {center: {latitude: 30.2247601, longitude: -92.0176968 }, zoom: 16 }
        this.options = {scrollwheel: false};
        this.bindingContainer = OpenDataQueryService.getBindingContainer();
        
		this.currentFeatureSet = 'Lafayette_Public_Art';
		
        var optionsIconMap = {
            'Sculpture': {icon: 'blue_MarkerS.png'},
            'Bench': {icon: 'darkgreen_MarkerB.png'},
            'Bike rack': {icon: 'orange_MarkerB.png'},
            'Ceramic': {icon: 'pink_MarkerC.png'},
            'Interactive Art': {icon: 'purple_MarkerI.png'},
            'Mural': {icon:'paleblue_MarkerM.png'},
            'Plant Art': {icon: 'green_MarkerP.png'},
            'Stained Glass': {icon: 'red_MarkerS.png'},
            'Street art': {icon: 'yellow_MarkerS.png'},
            'Statue': {icon: 'brown_MarkerS.png'},
			'Park': {icon:'tree.png'},
			'Recreation': {icon:'tree.png'},
			'Activity': {icon:'tree.png'}
        };
        
        this.prepareMapOptionsBasedOnType = function(item, $index){
            var options = optionsIconMap[item.attributes.Type];
            options.index = $index;
            
            return options;
        };
        
        this.updateData = function(type, feature){
			feature = feature ? feature : 'Lafayette_Public_Art';
			this.map.zoom = 12;
            this.currentFeatureSet = feature; 
			if (this.currentFeatureSet === 'Lafayette_Public_Art') { this.map.zoom = 16}
            var queryParams = {
               feature: feature,
               layer: '0',
               where: ( (type === 'All')? '1=1' : 'Type=\'' + type +'\''),
               outFields: '*'
            };
                    
            return OpenDataQueryService.query(queryParams);
        };
        
        this.events = {
            click: function(marker, eventName, model) {
                //console.log('Click marker', marker, eventName, model);
                viewModel.currentSelectedMarkerIndex = model.options.index;
                
                console.log('New Point Selected!', viewModel.bindingContainer.Lafayette_Public_Art[0].features[model.options.index]);
            }
        };
        
        this.isAcceptableImageUrl = function(url){
            if(url) {
                var isAcceptable = true;
                var justUnacceptable = ['instagram'];
                justUnacceptable.forEach(function(keyword){
                    isAcceptable = isAcceptable && url.indexOf(keyword) === -1;
                });
            } else {
                isAcceptable = false;
            }
            
            
            return isAcceptable;
        };
        
    });
    

    /**
     * Angular controllers are NOT singleton instances since you may have some repeated/reused view controllers
     */
    app.controller('DashboardStateController', ['OpenDataQueryService', function(OpenDataQueryService){
        this.bindingContainer = OpenDataQueryService.getBindingContainer();
        
    }]);
    
    /**
     * This component is a singleton. There is only one created instance of this service any and everywhere its referenced.
     */
    app.factory('OpenDataQueryService', ['$resource', 'OpenDataConstants', function($resource, OpenDataConstants){
        /**
         * Private vars declared here are not exposed to other angular components using this service.
         */
        var queryBaseUrl = OpenDataConstants.featureServices.arcGISsvcs;
        
        /**
         * @<param> is a required param for the query
         */
        var paramDefaults = {
            apiToken: 'xQcS4egPbZO43gZi',
            feature: '@feature',
            layer:   '@layer',
            action:  'query',
            f:       'pjson'
        };
        
        var openDataResource = $resource(queryBaseUrl, paramDefaults);
        
        var bindingContainer = {};
        
        function _getBindingContainer(){
            return bindingContainer;
        };
        
        function _query(params){
            return openDataResource.get(params).$promise.then(function(results){
                console.log(results);
                
                //create an object container for the feature if it doesn't already exists
                bindingContainer[params.feature] = bindingContainer[params.feature] || {};
                
                //place in bindingContainer for use based on layer queried
                bindingContainer[params.feature][params.layer] = results;
                
                /**
                  Example bindingContainer structure if Lafayette_Public_Art layer 0 was queried:
                  
                    bindingContainer
                        Lafayette_Public_Art
                            0
                                <query data>
                    
                    accessing data in another component: var queryData = OpenDataQueryService.getBindingContainer.Lafayette_Public_Art[0];
                 */
                 
                 return results;
            });
        };
        
        /**
         * This return object is what is exposed to other angular components.
         */
        return {
            /**
             * Return reference to bindingContainer object. The returned value is not a copy, its a pointer reference.
             * Only this service should directly change values in the bindingContainer variable. If using outside of this service, only use data for views.
             */
            getBindingContainer: _getBindingContainer,
            /**
             * Provides a generic way to interact/query the open data portal
             */
            query: _query
        };
    }]);
    
})(window.angular);