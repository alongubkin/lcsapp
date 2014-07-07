angular.module('lcs', ['ionic', 
                       'ngStorage',
                       'angularMoment',
                       'lcs.controllers', 
                       'lcs.services',
                       'lcs.directives'])

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
          'menuContent': {
            templateUrl: "templates/schedule.html",
            controller: "ScheduleCtrl"
          }
        }
      })
      
      .state('app.standings', {
        url: '/standings',
        views: {
          'menuContent': {
            templateUrl: 'templates/standings.html',
            controller: 'StandingsCtrl'
          }
        }
      })
      
      .state('app.match', {
        url: '/match/:matchId',
        views: {
          'menuContent': {
            templateUrl: 'templates/match.html',
            controller: 'ViewMatchCtrl'
          }
        }
      });
    
    $urlRouterProvider.otherwise('/setup');
  });