$(document).ready(function () { 

    //Required variables
    var code2country;
    var country2code;
    var selected_countries = [];

    

    // Capitalizes word for country
    String.prototype.capitalize = function() {
      return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };



    //Populate option using json file
    $.getJSON("js/options.json", function(data){
      console.log(data);
      data.forEach(function(v){
        $("#select-countries").append($('<option>', {
            value: v,
            text: v.capitalize()
          }));
      });
    
      //Grabbing data on the fly 
      $('#select-countries').selectize({
          create: false,
          allowEmptyOption: false,
          placeholder: "Select Countries [Max: 7]",
          maxItems: 7,
          onItemAdd: function (data, $item){
              console.log(data);
              
              //Add selected countries to the list 
              selected_countries.push(country2code[data.toLowerCase()])

              console.log(selected_countries);
              console.log($item);
          },
          onItemRemove: function(data){
              console.log("THE DATA : " + data);
              //index of the data 
              var del_index = selected_countries.indexOf(code2country[data.toLowerCase()]);
              // Removing the selected data
              selected_countries.splice(del_index, 1);
          }
      });

    });



    // Loading code to country conversion file
    console.log("Code to country");
    d3.json('js/code2country.json', function(data){
      code2country = data;
    });

    // Loading country to code conversion file
    d3.json('js/country2code.json', function(data){
      country2code = data;
    })

    // Build map data to visualize based on countrylist argument
    // argument -> ['afbdi', 'afbfa'];
    // Returns -> [ { name: 'Burundi', country: 'afbdi' },
        //    { name: 'Burkina Faso', country: 'afbfa' } ]
    var build_map_data = function(cl) {
      var dataset = [];
      cl.forEach(function(data){
        dataset.push({"name" : code2country[data].capitalize(),
                        "country" : data
                      })
      });
      return dataset;
    }

    //
    var clist = ['asind', 'aspak', 'asbgd'];

    //Map viz begin
    var sample_data;

    // Draws the map
    d3.json('js/map_data.json', function(data){
      sample_data = data;

      var visualization = d3plus.viz()
          .container("#viz")
          .data(build_map_data(clist))
          .type("geo_map")
          .coords({
              "solo":  clist, //["euesp", "euita", "eufra", "euprt", "asbgd", "ocnru"],
              "value": "countries.json"
          })
          .id("country")
          .text("name")
          // .color("value")
          .tooltip("name")
          .draw();
    });


    //Bar viz begins
    var sd;
    // Loading external data
    d3.json('js/visa_refusal.json', function (data) {
        sd = data;

        // Initialize comparison bar chart 
        var cd = [];
        clist.forEach(function(cc){
        sd[cc].forEach(function(dat){
                cd.push(dat);
        });

    });

    // Plotting the bar chart 
    var visualization = d3plus.viz()
                                .container("#viz3")
                                .data(cd)
                                .type("bar")
                                .id("name")
                                .x("year")
                                .y("rate")
                                .time("year")
                                .legend({"size":50})
                                .draw()
    });

    //Initiates the comparison viz
    var draw_comparison_chart = function(cl){
        // Remove the viz first 
        $("#viz3").remove();

        // Then append 
        $("#vizid3").append("<div id='viz3'></div>");


        var comparison_dataset = [];
        cl.forEach(function(country_code){
            sd[country_code].forEach(function(dat){
                comparison_dataset.push(dat);
            })
        });

        console.log("Comparison dataset");
        console.log(comparison_dataset);

        var visualization = d3plus.viz()
                                .container("#viz3")
                                .data(comparison_dataset)
                                .type("bar")
                                .id("name")
                                .x("year")
                                .y("rate")
                                .time("year")
                                .draw()
    }
    

    //Initialize comparison 

    


    var current_id = '';
    var old_id = '';
    console.log("READY");
    // Selecting static parent then adding click function to the dynamic element
    $(document).on('click', ".d3plus_data", function (e) {

        // Get current id
        current_id = e.target.id;

        console.log("Current country " + current_id);

        var is_focused = $("#d3plus_tooltip_id_visualization_focus").length;
        if (is_focused > 0) {
            if (current_id !== old_id) {
                $("#viz2").remove();
                old_id = current_id;
            }

            //Getting country name from code
            console.log(code2country[current_id]);

            $("#vizid2").append("<div id='viz2'></div>")

            var visualization = d3plus.viz()
                .container("#viz2")
                .data(sd[current_id])
                .type("bar")
                .id("name")
                .x({ "stacked": true, "value": "rate" })
                .y("year")
                .color({
                    "range": ["blue", "white", "yellow"],
                    "value": "rate"
                })
                .time("year")
                .draw()

        } else {
            // Check if clicked outside the map viz
            if (current_id !== '')
                $("#viz2").remove();
        }
    });


    $("#draw-btn").on('click', function(){
        
        if (selected_countries.length <= 0)
            alert("Select a country first!")
        else {
        // Deleting the viz 
        $("#viz").remove();

        // Now making viz again with selected data 
        $("#vizid").append("<div id='viz'></div>");

        // Redrawing map 
        var visualization = d3plus.viz()
          .container("#viz")
          .data(build_map_data(selected_countries))
          .type("geo_map")
          .coords({
              "solo":  selected_countries, //["euesp", "euita", "eufra", "euprt", "asbgd", "ocnru"],
              "value": "http://d3plus.org/topojson/countries.json"
          })
          .id("country")
          .text("name")
          // .color("value")
          .tooltip("name")
          .draw();

          // draw comparison chart 
          draw_comparison_chart(selected_countries);
        }
    });

});
