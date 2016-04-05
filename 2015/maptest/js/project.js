var docWidth = window.innerWidth;

var width = docWidth,
    height = (docWidth * 0.75);

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, .211])
    .range(d3.range(5).map(function(i) { return "q" + i + "-9"; }));

//Projection Modified For Oregon
var projection = d3.geo.albers()
    .rotate([120, 0])
    .center([-0.7, 44.2])
    .scale(width * 9.5)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "js/orCounty.json")
    .defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
    .await(ready);

function ready(error, oregon) {
  svg.append("g")
      .attr("class", "oregon")
    .selectAll("path")
      .data(topojson.feature(oregon, oregon.objects.orCounty).features)
    .enter().append("path")
      .attr("class", function(d) { return "county " + quantize(rateById.get(d.properties.CNTY_CODE))  ; })
      .attr("d", path);
  }