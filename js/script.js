$(document).ready(function () {

    //Map viz begin
    var sample_data = [{
        // "value": 30,
        "country": "eufra",
        "name": "France"
    }, {
        //"value": 40,
        "country": "euprt",
        "name": "Portugal"
    }, {
        //"value": 50,
        "country": "euesp",
        "name": "Spain"
    }, {
        //"value": 60,
        "country": "euita",
        "name": "Italy"
    }, {
        //"value": 80,
        "country": "asbgd",
        "name": "Bangladesh"
    }]


    var visualization = d3plus.viz()
        .container("#viz")
        .data(sample_data)
        .type("geo_map")
        .coords({
            "solo": ["euesp", "euita", "eufra", "euprt", "asbgd", "ocnru"],
            "value": "http://d3plus.org/topojson/countries.json"
        })
        .id("country")
        .text("name")
        // .color("value")
        .tooltip("name")
        .draw();



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



    // Redraw map on selection
    $(".selectpicker").on('change', function (e) {
        console.log(e);
        console.log($("[aria-selected='true']").val());
    });


    function draw() {
        console.log("Redrawing");
    }

});
