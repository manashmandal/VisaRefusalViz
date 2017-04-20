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
    var clist = ['asbgd', 'euita'];

    //Map viz begin
    var sample_data;

    // Draws the map
    d3.json('js/map_data.json', function(data){
      sample_data = data;
      console.log(data);

      var visualization = d3plus.viz()
          .container("#viz")
          .data(build_map_data(clist))
          .type("geo_map")
          .coords({
              "solo":  clist, //["euesp", "euita", "eufra", "euprt", "asbgd", "ocnru"],
              "value": "http://d3plus.org/topojson/countries.json"
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
    });


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
    // Send Graph data according to the modal
    $("#myModal").on("show.bs.modal", function (event) {
        console.log("MOdal Opened");
    });
    $("#myModal").on("hide.bs.modal", function (event) {
        console.log("Modal Closed");
    });


    $("#draw-btn").on('click', function(){
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
    });



});
