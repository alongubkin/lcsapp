var _historySaved = false;

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
    
    // Create a fake history of views so that animation
    // will be in the right direction
    // TODO: This should be in a different service.
    if (!_historySaved) {
      var stack = $rootScope.$viewHistory.histories.root.stack;

      if (stack.length === 1) { 
        $state.go('app.schedule', { week: 1});
      } else {
        var firstWeek = parseInt(stack[0].stateParams.week, 10);
        if ($scope.currentWeek < firstWeek) {
          $state.go('app.schedule', { week: $scope.currentWeek + 1});
        } else {
          _historySaved = true;
        }
      }
    } 
    
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
    });
    
    if (!$scope.hasToday) {
      $timeout(function () {
        $ionicScrollDelegate.scrollTop(true);
      }, 200);
    }
  });