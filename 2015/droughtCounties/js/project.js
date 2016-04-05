var mediumColumn = $(".small-12").width();

var width = mediumColumn,
    height = (mediumColumn * 0.75);

var rateById = d3.map();
var dateForCounty = d3.map();

//Projection Modified For Oregon
var projection = d3.geo.albers()
    .rotate([120, 0])
    .center([-0.7, 44.2])
    .scale(width * 9.5)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

queue()
    .defer(d3.json, "js/orCounty.json")
    .defer(d3.csv, "output_file.csv", function(d) { 
        rateById.set(d.County, d["Drought Status"]); 
        dateForCounty.set(d.County, d["Governor Declaration Date"]);
    })
    .await(ready);


function ready(error, oregon) {
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(oregon, oregon.objects.orCounty).features)
    .enter().append("path")
      .attr("class", function(d) { return "county " + rateById.get(d.properties.altName)  ; })
      .attr("d", path)
      .on("mousemove", function(d) {    
        div.transition()        
            .duration(0)      
            .style("opacity", .9);      
        div .html( function() { 
                if( rateById.get(d.properties.altName) == undefined){
                    return "<strong>" + d.properties.instName 
                    + "</strong></br>Status: " 
                    + "</br>Date: "
                ;} else {
                    return "<strong>" + d.properties.instName 
                    + "</strong></br>Status: " + rateById.get(d.properties.altName)  
                    + "</br>Date Declared: " + dateForCounty.get(d.properties.altName)
                } 
            })  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY) + "px");    
        })                  
      .on("mouseout", function(d) {       
        div.transition()        
            .duration(500)      
            .style("opacity", 0);
    });

svg.append("path")
    .datum(topojson.mesh(oregon, oregon.objects.orCounty, function(a, b) { return a === b; }))
    .attr("d", path)
    .attr("class", "oregon-border");

};




// Make Table

d3.csv("output_file.csv ", function(d) {

  if ((d["Drought Status"] === "Governor Declared") || (d["Drought Status"] === "County Requested")){
    return {
      county: d.County,
      status: d["Drought Status"],
      date: d["Governor Declaration Date"]
    };
  }

}, function(error, rows) {

    function tabulate(data, columns) {
        var table = d3.select("#table").append("table"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
                .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
                .text(function(d) { return d.value; });
        
        return table;
    }

// render the table
var countyTable = tabulate(rows, ["county", "status", "date"]);

// uppercase the column headers
countyTable.selectAll("thead th")
    .text(function(column) {
        return column.charAt(0).toUpperCase() + column.substr(1);
    });
    
// sort by name
countyTable.selectAll("tbody tr")
    .sort(function(a, b) {
        return d3.descending(b.county, a.county);
    });

var docHeight = $(document).height();
$("body").css("height", docHeight );

var pymChild = new pym.Child();
pymChild.sendHeight();



});
