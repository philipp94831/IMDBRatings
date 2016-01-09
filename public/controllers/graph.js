app.controller('GraphController', [
'$scope',
'$http',
function($scope, $http){
  var colors = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
  Highcharts.setOptions({
    lang: {
      loading: $('<i>').addClass('loading-spinner fa fa-spinner fa-spin fa-5x').prop('outerHTML')
    }
  });

  $scope.seriesTrendline = false;
  $scope.seasonTrendline = true;

  $scope.toggleSeriesTrendline = function() {
    $scope.highchartsNG.series.forEach(function(series) {
      if (series.name.match(/Series Trendline/)) {
        series.visible = $scope.seriesTrendline;
      }
    })
  }

  $scope.toggleSeasonTrendline = function() {
    $scope.highchartsNG.series.forEach(function(series) {
      if (series.name.match(/Season \d+ Trendline/)) {
        series.visible = $scope.seasonTrendline;
      }
    })
  }

  $scope.highchartsNG = {
    options: {
      chart: {
        backgroundColor: "#333",
        spacingTop: 24,
        style: {
          fontSize: 12,
          fontFamily: 'Oxygen, sans-serif',
          fontWeight: 300,
        }
      },
      navigation: {
        buttonOptions: {
          theme: {
            fill: '#333333',
            stroke: '#000',
            states: {
              hover: {
                fill: '#474747',
                stroke: '#333',
              },
              select: {
                fill: '#474747',
                stroke: '#333',
              }
            }
          }
        }
      },
      yAxis: {
        max: 10,
        // min: round down the min
        title: {
          text: "IMDb Rating",
          style: {
            color: "#AAA",
            fontWeight: 300,
          }
        },
        labels: {
          style: {
            color: "#999",
          }
        },
        gridLineColor: 'rgba(255, 255, 255, .1)'
      },
      xAxis: {
        tickColor: "#333", // hide ticks
        lineColor: "#333", // hide line
        allowDecimals: false,
        title: {
          text: "Episode Number",
          style: {
            color: "#AAA",
            fontWeight: 300,
          }
        },
        labels: {
          style: {
            color: "#999",
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        href: "http://github.com/philipp94831",
        text: "philipp94831"
      },
      tooltip: {
        useHTML: true,
        formatter: function() {
          if (this.series.options.type === "scatter") {
            return [
                    "<b>", this.point.id, "</b>", "<br>",
                    this.point.title, "<br>", 
                    "Rating: ", this.point.rating
                    ].join("");
          } else if (this.series.options.type === "line") {
            return false;
          }
        }
      },
      plotOptions: {
        scatter: {
          cursor: 'pointer',
          point: {
            events: {
              click: function() {
                window.open(
                  ["http://www.imdb.com/title/", this.options.imdb_id, "/"].join(""),
                '_blank');
              }
            }
          }
        }
      }
    },
    title: {
        text: title,
        style: {
          color: "#FFF",
          font: '26px Oxygen, sans-serif',
          fontWeight: 300,
        }
    },
    loading: 'foo',
    size: {
      height: 700
    }
  };

  $http.get("data/" + id).then(function successCallback(response) {
    $scope.highchartsNG.loading = false;
    $scope.highchartsNG.series = transform(response.data);
  }, function errorCallback(response) {
    console.log('There was an error');
  });

  function transform(data) {
    values = [];
    data.seasons.forEach(function(season) {
      values.push(buildTrendline(season));
      values.push(buildScatter(season));
    })
    values.push(buildShowTrendline(data));
    return values;
  }

  function buildTrendline(season) {
    trendline = {};
    trendline.type = 'line';
    trendline.color = colors[(season.number - 1) % colors.length];
    trendline.name = 'Season ' + season.number + ' Trendline';
    trendline.data = [{
      x: season.trendline[1].x,
      y: season.trendline[1].y,
      r2: 0.11
    }, {
      x: season.trendline[2].x,
      y: season.trendline[2].y,
      r2: 0.11
    }];
    trendline.marker = {
      enabled: false,
    };
    trendline.visible = $scope.seasonTrendline;
    return trendline;
  }

  function buildShowTrendline(show) {
    trendline = {};
    trendline.type = 'line';
    trendline.color = '#FFF';
    trendline.name = 'Series Trendline';
    trendline.data = [{
      x: show.trendline[1].x,
      y: show.trendline[1].y,
      r2: 0.11
    }, {
      x: show.trendline[2].x,
      y: show.trendline[2].y,
      r2: 0.11
    }];
    trendline.marker = {
      enabled: false,
    };
    trendline.visible = $scope.seriesTrendline;
    return trendline;
  }

  function buildScatter(season) {
    scatter = {};
    scatter.type = 'scatter';
    scatter.color = colors[(season.number - 1) % colors.length];
    scatter.name = 'Season ' + season.number;
    scatter.marker = {
              radius: 4,
              symbol: "circle"
          };
    data = [];
    season.episodes.forEach(function(episode) {
      point = {};
      point.x = episode.number;
      point.y = episode.rating;
      point.imdb_id = episode.id;
      point.id = 's' + season.number + 'e' + episode.numberInSeason;
      point.title = $('<div/>').html(episode.title).text();
      point.rating = episode.rating;
      data.push(point);
    })
    scatter.data = data;
    return scatter;
  }
}]);