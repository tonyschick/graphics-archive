var chartDivWidth = $("#multiLineChart").width();
    margin = {top: 0, right: 15, bottom: 20, left: 40},
    width = chartDivWidth - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

// var formatDate = d3.time.format("%Y-%m-%d").parse;
var formatDate = d3.time.format("%m/%e/%y").parse;

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
    .ticks(8)
    .tickFormat(function(d) { return d + "%"; })
    .orient("left");

var chartline = d3.svg.line()
    .interpolate("step-after")
    .defined(function(d) { return !isNaN(d.level); })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.level); });

var svg = d3.select("#multiLineChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("bin/data/snowpack.csv", function(error, data) {
  if (error) throw error;

  // var data = data.slice([data.length-52], [data.length]);

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

  console.log(lakes);

  x.domain(d3.extent(data, function(d) { return d.date; }));

  // y.domain([
  //   d3.min(lakes, function(c) { return d3.min(c.values, function(v) { return v.level; }); }),
  //   d3.max(lakes, function(c) { return d3.max(c.values, function(v) { return v.level; }); })
  // ]);

  y.domain([0,850]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // svg.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", -8)
  //     .attr("x", -(height/2))
  //     .attr("class", "yText")
  //     .text("Above Average");
  //
  // svg.append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("x", -(height/2) - 70 )
  //     .attr("y", -8)
  //     .attr("class", "yText")
  //     .style("text-anchor", "end")
  //     .text("Below Average");

  svg.append("linearGradient")
      .attr("id", "level-gradientBig")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", y(50) )
      .attr("x2", 0).attr("y2", y(150) )
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#ef3b2c"},
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

  reservoir.append("path")
      .attr("class", "lineBig")
      .attr("id", function(d) { return (d.name).replace(/\W/g, ''); })
      .style("stroke", "url(#level-gradientBig)")
      .attr("opacity", 0.3)
      .attr("stroke-width", "1.5px")
      .attr("d", function(d) { return chartline(d.values); })
      .on("mouseover", function(d) {

        //Get mouse x/y values and adjust for tooltip
        var coordinates = [0, 0];
        coordinates = d3.mouse(this);
        var xPosition = coordinates[0];
        var yPosition = coordinates[1] + 85;
        var toolDate = d.values[30].date.getFullYear();

        //Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition + "px")
          .style("top", (yPosition - 25) + "px")
          // .select("#value")
          .html("<p><strong>Test Site:</strong> " + d.name + "</p>"
                + "<p><strong>Snowpack:</strong> " + d.values[30].level + "% of average</p>"
                + "<p><strong>Year:</strong> " + toolDate  + "</p>"
                );
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);
      })

      .on("mouseout", function() {
        //Hide the tooltip
        d3.select("#tooltip").classed("hidden", true);
      })

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
        focus.select("text").text(formatCurrency(d.close));
      }

  // Average Line
  // svg.append("line")
  //     .attr("class", "averagelineBig")
  //     .attr("y1", y(100) )
  //     .attr("x1", -5)
  //     .attr("y2", y(100) )
  //     .attr("x2", width);

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

    var bgOpacity = 0;

    switch(step) {
          case 0:

           d3.select("#stepDescription").html("Each line represents monitored snow pack site in Oregon and Washington. You can see how snowpack levels increase <span style='color:#0571b0; font-weight:bold;'>above average</span> in wetter and colder winters and drops <span style='color:#ca0020; font-weight:bold;'>below average</span> in drier and warmer winters.");
           d3.select("#last").attr("class", "inactive");

           d3.selectAll('.lineBig').attr('opacity', 0.3).attr("stroke-width", "1.5px");

           break;

          case 1:

            d3.selectAll('.lineBig').attr('opacity', bgOpacity);

            var under4000 = '#TinkhamCreek,#ElbowLake,#NorthFork,#CougarMountain,#MeadowsPass,#Greenpoint,#SkookumCreek,#ClackamasLake,#SpencerMeadow,#PeavineRidge,#FishLake,#JuneLake,#AlpineMeadows,#JumpOffJoe,#SpiritLake,#PopeRidge,#BeaverPass,#BlazedAlder,#DalyLake,#SantiamJct,#ClearLake,#RexRiver,#StampedePass,#LonePine,#SwampCreek,#StevensPass,#MountCrag,#SheepCanyon'

            d3.selectAll(under4000)
                .attr('opacity', 0.4)
                .attr("stroke-width", "1.5px");

            d3.select("#stepDescription").html("These are some snow pack test sites under 4000 ft elevation.");

            d3.select("#last").attr("class", "active");
            d3.select("#next").attr("class", "active");

            break;

          case 2:
            d3.selectAll('.lineBig').attr('opacity', bgOpacity);

            var between4kAnd5k = '#Dungeness,#LittleMeadows,#OlallieMeadows,#WellsCreek,#MudRidge,#SaltCreekFalls,#BlewettPass,#SurpriseLakes,#ThunderBasin,#UpperWheeler,#SasseRidge,#RedHill,#SwiftCreek,#WhitePassES,#SalmonMeadows,#PotatoHill,#BowmanSprings,#ParkCreekRidge,#BumpingRidge,#FishLk,#SentinelButte,#QuartzPeak,#Mckenzie,#ChemultAlternate,#RainyPass,#NewCrescentLake,#HighRidge,#HollandMeadows,#RoaringRiver,#LuckyStrike,#MFNooksack,#BunchgrassMdw'

            d3.selectAll(between4kAnd5k)
                .attr('opacity', 0.4)
                .attr("stroke-width", "1.5px");

              d3.select("#stepDescription").html("These are some snow pack test sites between 4000 and 5000 ft elevation.");

            break;

          case 3:

          d3.selectAll('.lineBig').attr('opacity', bgOpacity);

          var between5kAnd6k = '#MosesMtn,#Waterhole,#TaylorButte,#CascadeSummit,#LostHorse,#BigelowCamp,#Paradise,#BeaverReservoir,#MadisonButte,#Tipton,#LakeCreekRS,#StarrRidge,#BillieCreekDivide,#DiamondLake,#MtHoodTestSite,#SchneiderMeadows,#GoldCenter,#MorseLake,#OchocoMeadows,#Trough,#EilertsonMeadows,#Touchet,#IrishTaylor,#SummitLake,#WolfCreek,#ThreeCreeksMeadow,#SevenmileMarsh,#SpruceSprings,#SilverCreek,#TaylorGreen,#MossSprings,#ArbuckleMtn,#CorralPass,#PigtailPeak,#Bourne,#Derr,#BlueMountainSpring,#GreenLake,#ColdSpringsCamp,#FourmileLake,#LymanLake'
          d3.selectAll(between5kAnd6k)
              .attr('opacity', 0.4)
              .attr("stroke-width", "1.5px");

            d3.select("#stepDescription").html("These are some snow pack test sites between 5000 and 6000 ft elevation.");
            d3.select("#next").attr("class", "active");

          break;

          case 4:
          d3.selectAll('.lineBig').attr('opacity', bgOpacity);

          var above6k = '#AnnieSprings,#BigRedMountain,#CrazymanFlat,#SnowMountain,#HartsPass,#Silvies,#SummerRim,#AneroidLake2,#FishCreek,#MtHoward'
          d3.selectAll(above6k)
              .attr('opacity', 0.4)
              .attr("stroke-width", "1.5px");

            d3.select("#stepDescription").html("These are some snow pack test sites above 6000 ft elevation.");
            d3.select("#next").attr("class", "inactive");



            break;

          // case 5:
          //   d3.selectAll('.lineBig').attr('opacity', 0.3);
          //
          //   // d3.select("#stepDescription").html("Drier than before? The past 100 years of data show reservoirs in the Northwest have spiked below average further and with more frequency since 1990.");
          //
          //   d3.select("#next").attr("class", "inactive");
          //
          //   break;
          }

      }

  });
