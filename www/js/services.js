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
  
  .factory('StandingsService', function ($http, $localStorage) {
    return {
      getStandings: function (region) {
        return $http.get(['http://na.lolesports.com/', region, '-lcs/2014/split2/standings'].join(''))
          .then(function (result) {
            var teams = [];
            
            var el = document.createElement( 'div' );
            el.innerHTML = result.data;

            var rows = el.querySelectorAll('.stats-container tbody tr');
        
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              
              teams.push({
                rank: row.children[0].firstChild.innerText,
                name: row.children[2].firstChild.innerText,
                wins: row.children[3].firstChild.innerText,
                losses: row.children[4].firstChild.innerText
              });
            }
            
            return teams;
          })
      }
    };
  });