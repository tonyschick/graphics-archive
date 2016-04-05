

d3.csv("http://opb-news-interactives.s3.amazonaws.com/news/2015/08August/lake-levels-data/lakelevels.csv", function(data) {

  $(".lake-levels-chart").each(function(){
    var lakeName = $(this).data('lake-name');
    var divID = '#' + $(this).data('chart-id');
    var formatDate = d3.time.format("%Y-%m-%d");
    d3.select(divID)
        .datum(data)
      .call(sparkline()
        .x(function(d) { return formatDate.parse(d.date); })
        .y(function(d) { return parseFloat(d[lakeName]); }));
  });

  $(".lake-level").each(function(){
    var lakeName = $(this).data('lake-name');
    var divID = '#' + $(this).data('lake-id');
    d3.select(divID)
      .html(data[99][lakeName])
      .style("color", function (){
              if (parseFloat(data[99][lakeName]) < 90){
                return "#ca0020";
              } if ( parseFloat(data[99][lakeName]) > 110 ){
                return "#0571b0";
              } else {
                return "gray";
              }
          });
  });


});

d3.csv("http://opb-news-interactives.s3.amazonaws.com/news/2015/08August/lake-levels-data/lake_snowpack.csv", function(data) {
  console.log(data);

  var nameByPack = d3.set();

  var nameByPack = data.map(function(d, i) {
    return data[i].name, data[i].current_basin_snowpack;
  });

  // console.log(nameByPack);


  $(".snow-level").each(function(){
    var lakeName = $(this).data('snow-name');
    var divID = '#' + $(this).data('snow-id');

    d3.select(divID)
        .datum(nameByPack)
        .html( function (d){
          return Math.round(d[1]) + "%";
          } )
        .style("color", function (d){
                if (parseFloat(d[1]) < 90){
                  return "#ca0020";
                } if ( parseFloat(d[1]) > 110 ){
                  return "#0571b0";
                } else {
                  return "gray";
                }
            });
  });



});
