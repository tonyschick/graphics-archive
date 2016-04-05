
$("#quiz-buttons").hide();
$("#low-probability").hide();
$("#high-probability").hide();
$("#unknown-probability").hide();
$("#startover").hide(); 
// STEPPER

    var step = 1;

    // $("#yes").click(function() {
    //   if (step <= 4){
    //     step = ++step;
    //   }
    //   stepper(step);
    // });

    // $("#no").click(function() {
    //   if (step >= 1){
    //     step = --step;
    //   }
    //   stepper(step);
    // });

  function stepper(){

    // var bgOpacity = 0.10;

    switch(step) {
          case 0: // 

              $("#start-button").click(function(){

                step = 1
                stepper(step);

              })

          break;



          case 1: //
              $("#low-probability").hide();
              $("#high-probability").hide();
              $("#unknown-probability").hide();
              $("#startover").hide();

              $("#quiz-start").hide();
              $("#quiz-buttons").show();
              $("#question").show()

              $("#question").html("Were apple and/or pear trees grown on the property before 1947? Or is the property within an area affected by historical smelter emissions?");


              $("#yes").click(function(){
                step = 11
                stepper(step)
              })
              $("#no").click(function(){
                step = 2
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 2
                stepper(step)
              })


            break;



          case 2: // 

              $("#question").html("Is the property in a historical apple or pear growing area?");


              $("#yes").click(function(){
                step = 3
                stepper(step)
              })
              $("#no").click(function(){
                step = 10
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 3
                stepper(step)
              })              

            break;



          case 3: // 

              $("#question").html("Is the property on state or federal land?");

              $("#yes").click(function(){
                step = 10
                stepper(step)
              })
              $("#no").click(function(){
                step = 4
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 4
                stepper(step)
              })
            break;



          case 4: // 
              $("#question").html("Has the property never been disturbed or was it developed from undisturbed land after 1947?");


              $("#yes").click(function(){
                step = 10
                stepper(step)
              })
              $("#no").click(function(){
                step = 5
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 5
                stepper(step)
              })
            break;



          case 5: // 
              $("#question").html("Is the property above 2,500 feet in elevation (or above 2,000 feet if in Yakima County)?");

              $("#yes").click(function(){
                step = 10
                stepper(step)
              })
              $("#no").click(function(){
                step = 6
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 6
                stepper(step)
              })
    	
            break;


          case 6: // 
              $("#question").html("Does the property receive less than 15 inches of precipitation annually?");


                $("#yes").click(function(){
                step = 7
                stepper(step)
              })
              $("#no").click(function(){
                step = 9
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 9
                stepper(step)
              })    
            break;

          case 7: // 
              $("#question").html("Is property in an area where irrigation is routinely practiced?");

              $("#yes").click(function(){
                step = 8
                stepper(step)
              })
              $("#no").click(function(){
                step = 10
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 8
                stepper(step)
              })      
            break;

          case 8: // 
              $("#question").html("Is property in an area served by irrigation water prior to 1947?");

              $("#yes").click(function(){
                step = 11
                stepper(step)
              })
              $("#no").click(function(){
                step = 10
                stepper(step)
              })
              $("#dontknow").click(function(){
                step = 9
                stepper(step)
              })      
            break;

          case 9: // Unknown Probability
              $("#quiz-buttons").hide();
              $("#unknown-probability").show();
              $("#high-probability").hide();
              $("#low-probability").hide();
              $("#startover").show();
              $("#question").hide()

            // $("#startover").click(function(){
            //   step = 1
            //   stepper(step);
            // })

            break;

          case 10: // Low Probability
              $("#quiz-buttons").hide();
              $("#low-probability").show();
              $("#high-probability").hide();
              $("#unknown-probability").hide();
              $("#startover").show();
              $("#question").hide()

            // $("#startover").click(function(){
            //   step = 1
            //   stepper(step);
            // })

            break;

          case 11: // High Probability
             $("#quiz-buttons").hide();
             $("#high-probability").show();
             $("#low-probability").hide();
             $("#unknown-probability").hide();
             $("#startover").show();
             $("#question").hide()
      

            // $("#startover").click(function(){
            //   step = 1
            //   stepper(step);
            // })


            break;

          }

      }

stepper();