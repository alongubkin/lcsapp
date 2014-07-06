angular.module('lcs.services', [])

  .factory('ScheduleService', function ($http, $localStorage) {
    return {
      getScheduleForWeek: function (week) {
        var region = $localStorage.region === 'eu' ? 102 : 104;
        return $http.get(['http://na.lolesports.com/api/programming.json?parameters[method]=all&parameters[week]=', week, '&parameters[tournament]=', region, '&parameters[expand_matches]=1'].join(''))
          .then(function (result) {
            return result.data;
          });
      },
      getCurrentWeekForRegion: function (region) {
        return $http.get(['http://na.lolesports.com/', region, '-lcs/2014/split2/'].join(''))
          .then(function (result) {
            var el = document.createElement( 'div' );
            el.innerHTML = result.data;

            var url = el.getElementsByClassName('menu-2459')[0].firstChild.attributes['href'].value;
            return parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
          })
      }
    };
  })