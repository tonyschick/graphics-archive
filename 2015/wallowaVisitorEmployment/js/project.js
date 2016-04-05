var docWidth = $(document).width();

var margin = {top: 20, right: 15, bottom: 30, left: 35},
    width = docWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    ticksNumber =12;

if (docWidth < 450) {
    height = 300 - margin.top - margin.bottom;
    ticksNumber = 5;
}

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(ticksNumber)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(ticksNumber)
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Jobs); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
    d.Jobs = +d.Jobs;
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0,150]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Jobs");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  svg.selectAll('circle')
        .data(data)
      .enter().append('circle')
        .attr('cx', function (d) { return x(d.Year); })
        .attr('cy', function (d) { return y(d.Jobs); })
        .attr('r', 4)
        .style("fill", "steelblue");                                              

});