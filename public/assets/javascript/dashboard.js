// search nutritionix api
$("#search").on("click", function() {
  var foodItem = $("#food").val().trim();
  var nxParams = foodItem + "?results=0:10&fields=*&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06"

  // nutritionix
  var nxQuery = "https://api.nutritionix.com/v1_1/search/" + nxParams;

  $.get(nxQuery, function(data, status) {}).done(function(data) {

    $("#resultsBox").html("");

    for (var i = 0; i < data.hits.length; i++) {
      var fields = data.hits[i].fields;
      var well = '<div class="well well-sm id=foodWell-' + i + '">'
       + fields.brand_name + " " + fields.item_name + '</div>';
      $("#resultsBox").append(well);
    }
  });
});
