app.controller('ChartController',
function($scope, $http){
  var colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
   '#E91E63', '#FFEB3B', '#009688', '#F44336', '#3F51B5'];
  Highcharts.setOptions({
    lang: {
      loading: $('<iron-icon>').attr('icon', 'autorenew').addClass('fa-spin loading-spinner gray').prop('outerHTML')
    }
  });
  var chart;

  $scope.toggleSeriesTrendline = function(value) {
    $scope.highchartsNG.series.forEach(function(series) {
      if (series.name.match(/Series Trendline/)) {
        series.visible = !value;
      }
    })
  }

  $scope.toggleSeasonTrendline = function(value) {
    $scope.highchartsNG.series.forEach(function(series) {
      if (series.name.match(/Season \d+ Trendline/)) {
        series.visible = !value;
      }
    })
  }

  $scope.$watch('scale', function(newVal, oldVal) {
    if(newVal === 'auto') {
      chart.yAxis[0].setExtremes(null, 10);
    } else if(newVal === 'full') {
      chart.yAxis[0].setExtremes(0, 10);
    }
  });

  $scope.highchartsNG = {
    options: {
      chart: {
        backgroundColor: "white",
        spacingTop: 24,
        style: {
          fontSize: 12,
          fontFamily: 'Roboto',
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
                fill: '#424242',
                stroke: '#333',
              },
              select: {
                fill: '#424242',
                stroke: '#333',
              }
            }
          }
        }
      },
      yAxis: {
        max: 10,
        title: {
          text: "IMDb Rating",
          style: {
            color: "#black",
            fontWeight: 300,
          }
        },
        labels: {
          style: {
            color: "black",
          }
        },
        gridLineColor: '#E0E0E0'
      },
      xAxis: {
        tickColor: "transparent", // hide ticks
        lineColor: "transparent", // hide line
        allowDecimals: false,
        title: {
          text: "Episode Number",
          style: {
            color: "black",
            fontWeight: 300,
          }
        },
        labels: {
          style: {
            color: "black",
          }
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        useHTML: true,
        formatter: function() {
          if (this.series.options.type === "scatter") {
            return [
                    "<b>", this.point.title, "</b>", "<br>",
                    "Season ", this.point.season, ", Episode ", this.point.number, "<br>", 
                    "Rating: ", this.point.rating
                    ].join("");
          } else if (this.series.options.type === "line") {
            return false;
          }
        },
        shape: 'square',
        backgroundColor: 'white',
        borderWidth: 2
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
        useHTML: true,
        text: '<span class="clickable" title="Click for more info" onclick="openDialog()">' + title + '</span>',
        style: {
          color: "black",
          font: '26px Roboto',
          fontWeight: 300,
        }
    },
    loading: true,
    size: {
      height: Math.max($('main > div > div').height() - 60, 250)
    },
    series: [],
    func: function(retChart) {
      chart = retChart;
    }
  };

  $scope.scale = 'auto';

  $scope.seriesTrendline = false;
  $scope.seasonTrendline = true;

  $http.get("data/" + id).then(function successCallback(response) {
    $scope.highchartsNG.loading = false;
    $scope.highchartsNG.series = transform(response.data);
  }, function errorCallback(response) {
    $('.loading-spinner').attr('icon', 'error').removeClass('fa-spin').addClass('error');
  });

  function transform(data) {
    values = [];
    values.push(buildShowTrendline(data));
    data.seasons.forEach(function(season) {
      values.push(buildTrendline(season));
      values.push(buildScatter(season));
    })
    return values;
  }

  function buildTrendline(season) {
    trendline = {};
    trendline.type = 'line';
    trendline.color = colors[(season.number - 1) % colors.length];
    trendline.name = 'Season ' + season.number + ' Trendline';
    trendline.data = season.trendline;
    trendline.marker = {
      enabled: false,
      states: {
        hover: {
          enabled: false
        }
      }
    };
    trendline.states = {
      hover: {
        enabled: false
      }
    };
    trendline.zIndex = 2;
    trendline.visible = $scope.seasonTrendline;
    return trendline;
  }

  function buildShowTrendline(show) {
    trendline = {};
    trendline.type = 'line';
    trendline.color = '#9E9E9E';
    trendline.name = 'Series Trendline';
    trendline.data = show.trendline;
    trendline.marker = {
      enabled: false,
      states: {
        hover: {
          enabled: false
        }
      }
    };
    trendline.states = {
      hover: {
        enabled: false
      }
    };
    trendline.zIndex = 1;
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
      point.season = season.number;
      point.number = episode.numberInSeason;
      point.title = $('<div/>').html(episode.title).text();
      point.rating = episode.rating;
      data.push(point);
    })
    scatter.zIndex = 3;
    scatter.data = data;
    return scatter;
  }

  function padZeros(number, max) {
    var str = String(number);
    
    while (str.length < max) {
        str = '0' + str;
    }
    
    return str;
  }
});

function openDialog() {
  $('#dialog').trigger('open');
}