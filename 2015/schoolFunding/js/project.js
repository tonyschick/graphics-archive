var data; // a global

d3.json("schoolfunding.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;

  console.log(json[4]);

  for (var i = 0; i < data.length; i++) {
    if ( (json[i].Private2011 >= json[i].Private2010 && json[i].Public2011 <= json[i].Public2010)
        ||
         (json[i].Private2012 >= json[i].Private2011 && json[i].Public2012 <= json[i].Public2011) 
        ||
         (json[i].Private2013 >= json[i].Private2012 && json[i].Public2013 <= json[i].Public2012) 
         ){
      console.log(json[i].Institution_Name);
    }
  };  

});


// for (var i = 0; i < data.length; i++) {

//   if ( json[i].Private2011 > json[i].Private2010 || json[i].Public2011 < json[i].Public2010 ){
//     console.log(json[i].Institution_Name);
//   }

// };  