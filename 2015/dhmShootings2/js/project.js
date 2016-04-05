var docWidth = $("#figure").width() - 10;
    textSpace = docWidth/1.5;
    margin = {top: 30, right: 15, bottom: 20, left: textSpace},
    width = docWidth - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    tickNumber = 6;
    lineColor = "#e1e2e3";

if (docWidth < 500) {
  height = 900 - margin.top - margin.bottom;
  tickNumber = 3;
  lineColor = "none";
}

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .3);

var x = d3.scale.linear()
    .rangeRound([0, width]);

var color = d3.scale.ordinal()
    .range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(tickNumber)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0, 0)
    .orient("left");

var svg = d3.select("#figure").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(["Strongly disagree", "Smwt disagree", "Don’t know", "Smwt agree", "Strongly agree"]);

  d3.csv("data.csv", function(error, data) {

  data.forEach(function(d) {
    d["Strongly disagree"] = +d["Strongly disagree"];
    d["Smwt disagree"] = +d["Smwt disagree"];
    d["Don’t know"] = +d["Don’t know"];
    d["Smwt agree"] = +d["Smwt agree"];
    d["Strongly agree"] = +d["Strongly agree"];
    var x0 = -1*(d["Don’t know"]/2+d["Smwt disagree"]+d["Strongly disagree"]);
    var idx = 0;
    d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
  });
  // console.log(data);

  var min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
          });

  var max_val = d3.max(data, function(d) {
          return d.boxes["4"].x1;
          });

  x.domain([min_val, max_val]).nice();
  y.domain(data.map(function(d) { return d.Question; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll(".tick text")
      .attr("transform", "translate(-" + textSpace + ", -26)")
      .call(wrap, (textSpace - 10 ) )
      .style("text-anchor", "start");

  svg.selectAll(".y .tick").append("line")
    .attr("x1", -(textSpace) )
    .attr("x2", width + margin.right)
    .attr("transform", "translate(0,24)")
    .style("stroke-width", 1)
    .style("stroke", lineColor);

  var vakken = svg.selectAll(".question")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.Question) + ")"; });

  var bars = vakken.selectAll("rect")
      .data(function(d) { return d.boxes; })
    .enter().append("g").attr("class", "subbar");

  bars.append("rect")
      .attr("height", (y.rangeBand() / 1.75) )
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); });

  // bars.append("text")
  //     .attr("x", function(d) { return x(d.x0); })
  //     .attr("y", y.rangeBand()/2)
  //     .attr("dy", "0.5em")
  //     .attr("dx", "0.5em")
  //     .style("font" ,"10px sans-serif")
  //     .style("text-anchor", "begin")
  //     .text(function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" });

  svg.append("g")
      .attr("class", "y axis")
  .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .style("stroke", "#818283")
      .style("stroke-dasharray", "4,4")
      .attr("y2", height - 19);

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }



});
