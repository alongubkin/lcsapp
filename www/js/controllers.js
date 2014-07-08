angular.module('lcs.controllers', [])
  .controller('AppCtrl', function ($scope, $state, $localStorage) {
    $scope.changeRegion = function () {
      delete $localStorage.region
      $state.go('setup');
    };
    
    $scope.schedule = function () {
      $state.go('app.schedule', { week: $localStorage.currentWeek });
    };
  })

  .controller('SetupCtrl', function ($scope, $rootScope, $state, $localStorage, $ionicViewService, ScheduleService) {
    $scope.loading = false;
    
    if ($localStorage.region) {
      findWeek();
    } else {
      $scope.showRegions = true;
    }
    
    $scope.selectRegion = function (region) {
      $localStorage.region = region;
      findWeek();
    };
    
    function findWeek() {
      $scope.loading = true;
      ScheduleService.getCurrentWeekForRegion($localStorage.region)
        .then(function (week) {
          $localStorage.currentWeek = week;
          
          $rootScope.$viewHistory.histories = {};
          $state.go('app.schedule', { week: week });
        });
    }
  })
  
  .controller('ScheduleCtrl', function ($scope, $rootScope, $timeout, $state, $stateParams, $ionicScrollDelegate, ScheduleService) {
    $scope.weeks = [];
    $scope.currentWeek = parseInt($stateParams.week, 10);

    $scope.refresh = function () {
      $scope.matches = [];
      
      ScheduleService.getScheduleForWeek($scope.currentWeek).then(function (days) {
        $scope.matches = [];
        $scope.hasToday = false;
        
        days.forEach(function (day) {
          var today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          
          var date = new Date(day.dateTime);
          date.setUTCHours(0, 0, 0, 0);

          var isToday = today.toISOString() == date.toISOString();
          if (isToday) $scope.hasToday = true;
          
          $scope.matches.push({ type: 'day', label: day.label, dateTime: day.dateTime, today: isToday });
          $scope.matches = $scope.matches.concat(day.matches);
        });
        
        if ($scope.hasToday) { 
          $timeout(function () {
              $ionicScrollDelegate.scrollTo(0, document.querySelector('.today').getBoundingClientRect().top, false);
          }, 1000);
        }
        
        $scope.$broadcast('scroll.refreshComplete');
      });
    } 
    
    $scope.refresh();
    
    if (!$scope.hasToday) {
      $timeout(function () {
        $ionicScrollDelegate.scrollTop(true);
      }, 200);
    }
    
    $scope.goToMatch = function (match) {
      $state.go('app.match', { matchId: match.matchId });
    };
    
    document.addEventListener("deviceready", function () {
      var admob_ios_key = '';
      var admob_android_key = 'ca-app-pub-2708584265734479/7188115543';
      var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;

      if (window.plugins && window.plugins.AdMob) {
        var am = window.plugins.AdMob;

        am.createBannerView({
          'publisherId': adId,
          'adSize': am.AD_SIZE.BANNER,
          'bannerAtTop': false,
          'overlap': false
        }, function() {
          am.requestAd(
            { 'isTesting': false }, 
            function () { am.showAd(true); }, 
            function(){ console.log('failed to request ad'); });
        }, function(){ console.log('failed to create banner view'); });
      }
    }, false);
  })
  
  .controller('StandingsCtrl', function ($scope, $localStorage, StandingsService) {
    StandingsService.getStandings($localStorage.region).then(function (teams) {
      $scope.teams = teams;
    });
  })
  
  .controller('ViewMatchCtrl', function ($scope, $stateParams, MatchService) {
    $scope.loading = true;
    MatchService.getMatch($stateParams.matchId).then(function (match) {
      console.log(match);
      
      $scope.match = match;
      $scope.loading = false;
    });
  });