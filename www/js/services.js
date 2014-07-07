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
  })
  
  .factory('MatchService', function ($http, $q) {
    return {
      getMatch: function (matchId) {
        return $q.all([
          $http.get('http://na.lolesports.com/tourney/match/' + matchId),
          $http.get('http://ddragon.leagueoflegends.com/cdn/4.11.3/data/en_US/champion.json'),
          $http.get('http://ddragon.leagueoflegends.com/cdn/4.11.3/data/en_US/item.json'),
          $http.get('http://eune.lolesports.com/api/match/' + matchId + '.json')
        ]).then(function (values) {
          var match = {
            name: values[3].data.name,
            dateTime: values[3].data.dateTime,
            isLive: values[3].data.isLive,
            isFinished: values[3].data.isFinished === '1'
          };
          
          var scriptBegin = '<script>jQuery.extend(Drupal.settings, ';
          var jsonBegin = values[0].data.indexOf(scriptBegin) + scriptBegin.length;
          
          var json = values[0].data.substring(jsonBegin, values[0].data.indexOf(');</script>', jsonBegin));
          var data = JSON.parse(json).esportsDataDump;
          
          if (!data.matchDataDump) {
            return match;
          } else {
            data = data.matchDataDump;
          }
          
          var teams = data[Object.keys(data)[0]];
          var teamIds = Object.keys(teams);
          
          function getChampion(championId) {
            var champion = values[1].data.data[_.findKey(values[1].data.data, function (champion) {
              return champion.key === championId;
            })];
                      
            return {
              name: champion.name,
              image: champion.image.sprite
            };
          }
          
          function getImageUrl(html) {
            var startTag = '<img src="';
            var start = html.indexOf(startTag) + startTag.length;
            
            return html.substring(start, html.indexOf('"', start));
          }
          
          function getItems(itemsIds) {
            var arr = itemsIds.split(',');
            var items = [];
            
            for (var i = 0; i < arr.length; i++) {
              var json = values[2].data.data[arr[i]];
              if (json) {
                items.push({
                  name: json.name,
                  image: json.image.sprite,
                  x: json.image.x,
                  y: json.image.y
                });
              }
            }
            
            return items;
          }
          
          function parseTeam(teamId) {   
            var json = teams[teamId];
            var matchTeam = values[3].data.contestants[_.findKey(values[3].data.contestants, function (team) {
              return team.id === teamId;
            })];
            
            var team = { 
              name: matchTeam.acronym,
              logoURL: matchTeam.logoURL,
              wins: matchTeam.wins,
              losses: matchTeam.losses,
              players: [] 
            };
            
            for (var player in json) {
              team.players.push({ 
                champion: _.extend(getChampion(json[player].champion[Object.keys(json[player].champion)[0]]), {
                  level: json[player].champion_level
                }),
                kills: json[player].kills,
                deaths: json[player].deaths,
                assists: json[player].assists,
                minions: json[player].minion_kills,
                name: json[player]['player field'],
                image: getImageUrl(json[player]['player image']),
                gold: json[player].total_gold,
                items: getItems(json[player].items)
              });
            }
            
            return team;
          }
     
          match.teams = [parseTeam(teamIds[0]), parseTeam(teamIds[1])];
          return match;
        });
       
      }
    };
  });