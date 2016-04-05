var docWidth = $(document).width();
var docHeight = $(document).height();

var margin = {top: 20, right: 30, bottom: 20, left: 30},
    width = docWidth - margin.left - margin.right,
    height = 360;

    if (docWidth < 400 ){
      height = 200;
    }

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);


var xAxis = d3.svg.axis()
    // .ticks(d3.time.year,[1])
    .scale(x)
    .orient("bottom")
    // .tickValues([1983, 2014])
    ;

var yAxis = d3.svg.axis()
    .tickSize(width)
    .scale(y)
    .orient("right");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.kits); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.year = parseDate(d.year);
    d.kits = +d.kits;
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.kits; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  var gy = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

 gy.selectAll("text")
    .attr("x", 4)
    .attr("dy", -4);

  gy.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-1em")
      .style("text-anchor", "end")
      .text("Untested Kits")

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

      console.log(data);
});
