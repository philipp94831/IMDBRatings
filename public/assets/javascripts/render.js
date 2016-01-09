var colors = ['#7cb5ec', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];

$(function() {
  $.get( "data/" + id, function( data ) {
    values = [];
    data.seasons.forEach(function(season) {
      values.push(buildTrendline(season));
      values.push(buildScatter(season));      
    })
    values.push(buildShowTrendline(data));
    $('#graph').highcharts({
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
      title: {
        text: $('<div/>').html(data.title).text(),
        style: {
          color: "#FFF",
          font: '26px Oxygen, sans-serif',
          fontWeight: 300,
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
      },
      series: values
  }, function (retChart) {
    chart = retChart;
    autoTickInterval = chart.yAxis[0].tickInterval;
    })
  });
})

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