(function(angular){
    'use strict';
    
    var app = angular.module('app-test', ['ui.router', 'ngResource']);
    
    //module config
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        
        $stateProvider.state({
            name: 'dashboard',
            url: '/dashboard',
            controller: 'DashboardStateController', //Matches controller name as defined in angular
            controllerAs: 'DashboardStateController', //Gives the controller a specific name in the html template/view
            templateUrl: 'map.html', //with a node server, you should be able to make use of templateUrl here
            //templateUrl: '/map.html', //with a node server, you should be able to make use of templateUrl here
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
        
        $urlRouterProvider.otherwise('dashboard');
    }]);
    
    app.factory('OpenDataConstants', function(){
        return {
            featureServices: {
                //example instance of base url: https://services.arcgis.com/xQcS4egPbZO43gZi/arcgis/rest/services/Lafayette_Public_Art/FeatureServer/0/query
                arcGISsvcs: 'https://services.arcgis.com/:apiToken/arcgis/rest/services/:feature/FeatureServer/:layer/:action'
            }
        }
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