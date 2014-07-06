angular.module('lcs', ['ionic', 'ngStorage', 'lcs.controllers', 'lcs.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('setup', {
        url: "/setup",
        templateUrl: "templates/setup.html",
        controller: 'SetupCtrl'
      })
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.schedule', {
        url: "/schedule/:week",
        views: {
          'menuContent' :{
            templateUrl: "templates/schedule.html",
            controller: "ScheduleCtrl"
          }
        }
      });
    
    $urlRouterProvider.otherwise('/setup');
  });