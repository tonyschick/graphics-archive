var docWidth = $(document).width() - 10;
// var docHeight = $(document).height() - 20;

var margin = {top: 20, right: 20, bottom: 0, left: 80},
    width = docWidth - margin.left - margin.right,
    height = 140 - margin.top - margin.bottom;

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
  y.domain(data.map(function(d) { return d.test; }));
  x.domain([0, 1]);

  console.log(data);

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var bar = svg.selectAll(".bar")
    .data(data)
    .enter();

    bar.append("rect")
      .attr("class", "bar")
      .attr("y", function(d) { return y(d.test); })
      .attr("height", y.rangeBand())
      .attr("x", 0)
      .attr("width", function(d) { return x(d.rate); });

    bar.append("text")
        .attr("class","dataNumber")
        .attr("x", function(d) { return x(d.rate) - 60; })
        .attr("y", function(d) { return y(d.test) + 16; })
        .attr("dy", ".9em")
        .text(function(d) { return (d.rate * 100).toFixed(1) + "%"  });


});

function type(d) {
  d.rate = +d.rate;
  return d;
}
