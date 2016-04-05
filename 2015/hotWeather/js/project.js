
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.DATE); })
    .y(function(d) { return y(d.fahrenheit); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("pdxtemps.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.DATE = parseDate(d.DATE);
    d.fahrenheit = +d.fahrenheit;
  });

y.domain(d3.extent(data, function(d) { return d.fahrenheit; }));
x.domain(d3.extent(data, function(d) { return d.DATE; }));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temp (F°)");

  // var dots = svg.selectAll(".dot")
  //             .data(data)
  //           .enter().append("circle")
  //                 .filter(function(d) { return d.MONTH == 06 && d.DAY == 20})
  //             .attr("class", "dot")
  //             .attr("r", 3.5)
  //             .attr("cx", function(d) { return x(d.DATE); })
  //             .attr("cy", function(d) { return y(d.fahrenheit); });

});