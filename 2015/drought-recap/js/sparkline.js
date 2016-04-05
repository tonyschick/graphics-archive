
function sparkline() {

  var divWidth = $(".lake-levels-chart").width();
      margin = {top: 20, right: 5, bottom: 5, left: 0},
      width = divWidth - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      xScale = d3.time.scale()
      yScale = d3.scale.linear()
      xAxis = d3.svg.axis().scale(xScale).orient("bottom"),
      line = d3.svg.line().interpolate("cardinal").defined(function(d) { return !isNaN(d[1]); }).x(X).y(Y);

  function chart(selection) {
    selection.each(function(data) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      // Update the x-scale.
      xScale
          // .domain(d3.extent(data, function(d) { return d[0]; }))
          .domain([data[data.length - 37][0],data[data.length - 1][0]])
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          // .domain(d3.extent(data, function(d) { return d[1]; }))
          .domain([0,200])
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("path").attr("class", "area");
      gEnter.append("path").attr("class", "line");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Add Year Lables
      svg.append("text")
	      .attr("y", 10)
	      .attr("x", 0)
	      .attr("dx", "2.25em")
 		      .attr("class", "yearlabel")
	      .style("text-anchor", "end")
	      .text("1980");

		  svg.append("text")
	      .attr("y", 10)
	      .attr("x", width)
 		      .attr("class", "yearlabel")
	      .style("text-anchor", "end")
	      .text("2015");

      g.append("linearGradient")
          .attr("id", "level-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0).attr("y1", yScale(80) )
          .attr("x2", 0).attr("y2", yScale(120) )
        .selectAll("stop")
          .data([
            {offset: "0%", color: "#ca0020"},
            {offset: "50%", color: "gray"},
            {offset: "100%", color: "#0571b0"}
          ])
        .enter().append("stop")
          .attr("offset", function(d) { return d.offset; })
          .attr("stop-color", function(d) { return d.color; });

      // Update the line path.
      g.select(".line")
          .attr("d", line)
          .style("stroke", "url(#level-gradient)");

      // Average Line
      g.append("line")
          .attr("class", "averageline")
          .attr("y1", yScale(100) )
          .attr("x1", 0)
          .attr("y2", yScale(100) )
          .attr("x2", width);

      // Sparkline Circle
      g.append('circle')
         .attr('class', 'sparkcircle')
         .attr('cx', xScale(data[data.length - 1][0]))
         .attr('cy', yScale(data[data.length - 1][1]))
         .attr('r', 4.5)
         .style("fill",  function(d) {
           if (isNaN(data[data.length - 1][1])) {
             return "none";
           } if ( data[data.length - 1][1] > 110 ) {
              return "#0571b0";
            } if ( data[data.length - 1][1] < 90 )  {
              return "#ca0020";
            } if ( 80 < data[data.length - 1][1] < 120) {
              return "gray";
            }
         });

    //  TOOLTIP
		var focus = svg.append("g")
		      .attr("class", "focus")
		      .style("display", "none");

		  focus.append("circle")
		      .attr("r", 4.5);

      // The specific ID generator
      var random = Math.round(Math.random() * 10000);

		  svg.append("text")
		  	  .attr("class","tooltipText" + random)
		      .attr("x", (width / 2))
		      .style("text-anchor", "middle")
		      .attr("y", 14);

		  svg.append("rect")
		      .attr("class", "overlay")
		      .attr("width", width)
		      .attr("height", height)
		      .on("mouseover", function() {
		      	focus.style("display", null);
		        d3.select(".tooltipText" + random).style("display", null);
			  })
		      .on("mouseout", function() {
		      	focus.style("display", "none");
    				d3.select(".tooltipText" + random).style("display", "none");
		      })
		      .on("mousemove", mousemove);

      var bisectDate = d3.bisector(function(d) { return d[0]; }).left;

		  function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;

            var date = new Date(data[i][0]);
            var year = date.getFullYear();

        focus.attr("transform", "translate(" + xScale(data[i][0]) + "," + (yScale(data[i][1]) + margin.top) + ")")
		    d3.select(".tooltipText" + random).text( year + " - " + data[i][1] + "%" );
        }

      });
    }

    // The x-accessor for the path generator; xScale ∘ xValue.
    function X(d) {
      return xScale(d[0]);
      console.log(d);
    }

    // The x-accessor for the path generator; yScale ∘ yValue.
    function Y(d) {
      return yScale(d[1]);
    }

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
    };

return chart;

}
