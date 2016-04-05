var docWidth = $(document).width();

var margin = {top: 20, right: 15, bottom: 30, left: 45},
    width = docWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    ticksNumber = 12;

if (docWidth < 450) {
    height = 300 - margin.top - margin.bottom;
    ticksNumber = 5;
}

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

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
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.spending); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
  });

  var countiesData = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.Year, spending: +d[name]};
      })
    };
  });


  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([-0.2,0.5]);
  // y.domain([
  //   d3.min(countiesData, function(c) { return d3.min(c.values, function(v) { return v.spending; }); }),
  //   d3.max(countiesData, function(c) { return d3.max(c.values, function(v) { return v.spending; }); })
  // ]);

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
      .text("Growth %");

  var counties = svg.selectAll(".counties")
      .data(countiesData)
    .enter().append("g")
      .attr("class", "counties");

  counties.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

      console.log(countiesData);

  // svg.selectAll('circle')
  //       .data(countiesData)
  //     .enter().append('circle')
  //       .attr('cx', function (d) { return x(d.spending); })
  //       .attr('cy', function (d) { return y(d.date); })
  //       .attr('r', 4)
  //       .style("fill", function(d) { return color(d.name); });                                              

});