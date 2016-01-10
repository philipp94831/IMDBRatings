module.exports.calculateTrendline = function(values) {
  var a = 0.0;
  var b1 = 0.0;
  var b2 = 0.0;
  var c = 0.0;
  var e = 0.0;
  var total = 0;
  values.forEach(function(value) {
    if(!isNaN(value.y)) {
      a += value.x * value.y;
      b1 += value.x;
      b2 += value.y;
      c += value.x * value.x;
      e +=  value.y;
      total++;
    }
  });
  a *= total;
  var b = b1 * b2;
  c *= total;
  var d = b1 * b1;
  var m = (a - b) / (c - d);
  var f = m * b1;
  var n = (e - f) / total;
  trendline = [];
  if(values.length > 0) {
    x1 = values[0].x;
    x2 = values[values.length - 1].x;
    trendline.push({x: x1, y: m * x1 + n});
    trendline.push({x: x2, y: m * x2 + n});
  }
  return trendline;
}