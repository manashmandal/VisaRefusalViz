String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


 var x = [{
    "country": "eufra",
    "name": "France"
}, {

    "country": "euprt",
    "name": "Portugal"
}, {

    "country": "euesp",
    "name": "Spain"
}, {

    "country": "euita",
    "name": "Italy"
}, {

    "country": "asbgd",
    "name": "Bangladesh"
}];

code2country =  {
	"afago": "angola",
	"afbdi": "burundi",
	"afben": "benin",
	"afbfa": "burkina faso",
	"afbwa": "botswana"

}

country2code = {
  "angola" : "afago",
	"burundi" : "afbdi",
	"benin" : "afben",
	"burkina faso" : "afbfa",
	"botswana" : "afbwa"
}

var clist = ['afbdi', 'afbfa'];


var build_map_data = function(cl) {
  var dataset = [];
  cl.forEach(function(data){
    dataset.push({"name" : code2country[data].capitalize(),
                    "country" : data
                  })
  });
  return dataset;
}


console.log(build_map_data(clist));


// console.log(y['bangladesh'])
