var docWidth = $(document).width() - 10;
var docHeight = $(document).height() - 20;

var margin = {top: 50, right: 55, bottom: 0, left: 190},
    width = docWidth - margin.left - margin.right,
    height = docHeight - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .1);

var x = d3.scale.linear()
    .range([0,width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(5, "%");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function(error, data) {
  y.domain(data.map(function(d) { return d["Grade level"]; }));
  x.domain([0, d3.max(data, function(d) { return d["OR 2014 field test"]; })]);

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
          .selectAll("text")
      .style("text-anchor", "start")
          .attr("transform", "translate(-180,0)");

  var testGroup = svg.append("g");

  var bar = testGroup.selectAll(".bar").data(data).enter();

    bar.append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { return y(d["Grade level"]); })
      .attr("height", y.rangeBand())
      .attr("x", 0)
      .attr("width", function(d) { return x( d["OR 2014 field test"]); })
      .attr("class", function(d) { return d["test"] })
      ;

  console.log(data);

});

function type(d) {
  d["OR 2014 field test"] = +d["OR 2014 field test"];

  return d;
}
