angular.module('lcs.controllers', [])
  .controller('AppCtrl', function ($scope, $state, $localStorage) {
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
  
  .controller('ScheduleCtrl', function ($scope, $localStorage, $timeout, $state, $stateParams, $ionicScrollDelegate, ScheduleService) {
    $scope.weeks = [];
    $scope.currentWeek = parseInt($stateParams.week, 10);
    $scope.currentRegion = $localStorage.region.toUpperCase();
    
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
    
    $scope.changeRegion = function () {
      if ($localStorage.region === 'na') {
        $localStorage.region = 'eu';
      } else {
        $localStorage.region = 'na';
      }
      
      $scope.currentRegion = $localStorage.region.toUpperCase();
      $scope.refresh();
    };
  })
  
  .controller('StandingsCtrl', function ($scope, $localStorage, StandingsService) {
    $scope.currentRegion = $localStorage.region.toUpperCase();
    
    $scope.refresh = function () {
      $scope.teams = [];
      StandingsService.getStandings($localStorage.region).then(function (teams) {
        $scope.teams = teams;
      });
    };
    
    $scope.refresh();
    
    $scope.changeRegion = function () {
      if ($localStorage.region === 'na') {
        $localStorage.region = 'eu';
      } else {
        $localStorage.region = 'na';
      }
      
      $scope.currentRegion = $localStorage.region.toUpperCase();
      $scope.refresh();
    };
    
  })
  
  .controller('ViewMatchCtrl', function ($scope, $stateParams, MatchService) {
    $scope.loading = true;
    MatchService.getMatch($stateParams.matchId).then(function (match) {
      console.log(match);
      
      $scope.match = match;
      $scope.loading = false;
    });
  });