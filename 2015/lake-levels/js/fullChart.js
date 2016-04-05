var chartDivWidth = $("#multiLineChart").width();
    margin = {top: 90, right: 10, bottom: 20, left: 40},
    width = chartDivWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(1)
    .tickFormat(function(d) { return d + "%"; })
    .orient("left");

var chartline = d3.svg.line()
    .interpolate("cardinal")
    .defined(function(d) { return !isNaN(d.level); })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.level); });

var svg = d3.select("#multiLineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://opb-news-interactives.s3.amazonaws.com/news/2015/08August/lake-levels-data/lakelevels.csv", function(error, data) {
  if (error) throw error;

  var data = data.slice([data.length-52], [data.length]);

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = formatDate(d.date);
  });

  var lakes =  color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, level: parseFloat(d[name])};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(lakes, function(c) { return d3.min(c.values, function(v) { return v.level; }); }),
    d3.max(lakes, function(c) { return d3.max(c.values, function(v) { return v.level; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -8)
      .attr("x", -(height/2))
      .attr("class", "yText")
      .text("Above Average");

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height/2) - 70 )
      .attr("y", -8)
      .attr("class", "yText")
      .style("text-anchor", "end")
      .text("Below Average");

  svg.append("linearGradient")
      .attr("id", "level-gradientBig")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", y(80) )
      .attr("x2", 0).attr("y2", y(120) )
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#ca0020"},
        {offset: "50%", color: "gray"},
        {offset: "100%", color: "#0571b0"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

  var reservoir = svg.selectAll(".reservoir")
      .data(lakes)
    .enter().append("g")
      .attr("class", "reservoir");

  // var desired = stringToReplace.replace(/[^\w\s]/gi, '')


  reservoir.append("path")
      .attr("class", "lineBig")
      .attr("id", function(d) { return (d.name).replace(/\s/g, ''); })
      .style("stroke", "url(#level-gradientBig)")
      .attr("opacity", 0.3)
      .attr("stroke-width", "1.5px")
      .attr("d", function(d) { return chartline(d.values); });
      // .on("mouseover", function(d) {
      //
      //   //Get mouse x/y values and adjust for tooltip
      //   var coordinates = [0, 0];
      //   coordinates = d3.mouse(this);
      //   var xPosition = coordinates[0];
      //   var yPosition = coordinates[1];
      //
      //   //Update the tooltip position and value
      //   d3.select("#tooltip")
      //     .style("left", xPosition + "px")
      //     .style("top", yPosition + "px")
      //     .select("#value")
      //     .text(d.name);
      //     //Show the tooltip
      //     d3.select("#tooltip").classed("hidden", false);
      // })
      //
      // .on("mouseout", function() {
      //   //Hide the tooltip
      //   d3.select("#tooltip").classed("hidden", true);
      // })

  // Add Line Circle
function addDot(dotYear){
  reservoir.append('circle')
     .attr('class', 'sparkcircleBig')
     .attr('cx', function(d) { return x(d.values[data.length - dotYear].date); } )
     .attr('cy', function(d) { return y(d.values[data.length - dotYear].level); } )
     .attr('r', 3)
     .attr('opacity', 0)
     .style("fill",  function(d) {
       if (isNaN( d.values[data.length - dotYear].level )) {
          return "none";
        } if ( d.values[data.length - dotYear].level > 110 ) {
          return "#0571b0";
        } if ( d.values[data.length - dotYear].level < 90 ) {
          return "#ca0020";
        } if ( 80 < d.values[data.length - dotYear].level < 120) {
          return "gray";
        }
     });
}

addDot(1);
addDot(15);
addDot(24);
addDot(28);
addDot(39);
addDot(43);
addDot(48);
addDot(50);


  // Average Line
  svg.append("line")
      .attr("class", "averagelineBig")
      .attr("y1", y(100) )
      .attr("x1", -5)
      .attr("y2", y(100) )
      .attr("x2", width);

// STEPPER

    var step = 0;

    d3.select("#next").on("click", function() {
      if (step <= 4){
        step = ++step;
      }
      stepper(step);
    });

    d3.select("#last").on("click", function() {
      if (step >= 1){
        step = --step;
      }
      stepper(step);
    });

  function stepper(){

    var bgOpacity = 0.10;

    switch(step) {
          case 0:

           d3.select("#stepDescription").html('Each line represents 1 of 63 monitored reservoirs in Oregon and Washington. You can see how reservoir levels rise <span style="color:#0571b0; font-weight:bold;">above average</span> in wetter summers and drop <span style="color:#ca0020; font-weight:bold;">below average</span> in drier summers.');
           d3.select("#last").attr("class", "inactive");

           d3.selectAll('.lineBig')
              .attr('opacity', 0.3)
              .attr("stroke-width", "1.5px");

           break;

          case 1:

            d3.selectAll('.lineBig')
                .attr('opacity', bgOpacity);

            var lowestEver = '#ColdSprings, #CottageGrove, #Detroit, #GreenPeter, #LakeShannon, #LookoutPoint, #Ross, #WarmSprings, #WillowCreek';

            d3.selectAll(lowestEver)
                .attr('opacity', 0.75)
                .attr("stroke-width", "2px");

            d3.select("#stepDescription").html("It was extremely dry this year. Most reservoirs were below their summer average, but nine reached their lowest storage on record this summer.");

            d3.select("#last").attr("class", "active");

            break;

          case 2:
            d3.selectAll('.lineBig').attr('opacity', bgOpacity);

            var bigSwing = '#Beulah, #BullyCreek, #ClearLake, #ColdSprings, #Cottonwood, #CranePrairie, #Drews, #FourmileLake, #ThiefValley, #WarmSprings';

            d3.selectAll(bigSwing)
                .attr('opacity', 0.75)
                .attr("stroke-width", "2px");

            d3.select("#stepDescription").html("Some lakes have a lot of natural variation.");

            break;

          case 3:

            d3.selectAll('.lineBig').attr('opacity', bgOpacity);
            d3.selectAll('.sparkcircleBig').attr('opacity', 0);

            // Less than 50% variation except Merwin Mossyrock Dam (Riffe Lk)
            var littleVariation = '#Dexter,	#DiabloReservoir, #Dorena, #HillsCreek, #LakeChelan, #Mayfield, #Merwin, #Ross, #Swift, #UpperBaker, #WillowCreek';

            d3.selectAll(littleVariation)
                .attr('opacity', 0.75)
                .attr("stroke-width", "2px");

            d3.select("#stepDescription").html("Some don't.");

            d3.select("#next").attr("class", "active");

            break;

          case 4:
            d3.selectAll('.lineBig').attr('opacity', 0.15);

            d3.selectAll('.sparkcircleBig').attr('opacity', 0.85);

            // reservoir.append('rect')
            //   .attr("x", function(d) { return x(d.values[data.length - 17].date) } )
            //   .attr("y", y(110))
            //   .attr("width", 220)
            //   .attr("height", 218)
            //   .attr("class", "highlightBox");

            d3.select("#stepDescription").html("Dips like this year's aren't unheard of. The mid-2000s, mid-1990s, and each decade before it showed similar rise and fall across the Northwest.");

            d3.select("#next").attr("class", "active");

            break;

          case 5:
            d3.selectAll('.lineBig').attr('opacity', 0.3);
            d3.selectAll('.sparkcircleBig').attr('opacity', 0);

            d3.select("#stepDescription").html("Drier than before? The past 100 years of data show reservoirs in the Northwest have spiked below average further and with more frequency since 1990.");

            d3.select("#next").attr("class", "inactive");

            break;
          }

      }

  });
