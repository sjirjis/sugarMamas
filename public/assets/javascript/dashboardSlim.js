$(document).ready(function() {

  // search nutritionix api
  $("#search").on("click", function() {

    //get users search value
    var foodItem = $("#food").val().trim();

    // prep nutritionix query
    var nxParams = foodItem + "?results=0:10&fields=*&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06"
    var nxQuery = "https://api.nutritionix.com/v1_1/search/" + nxParams;

    $.get(nxQuery)
      .done(function(data) {

        $('#resultsBox').empty();

        console.log('outsitde well', data);

        $('#resultsBox').on('click', '.well', function() {

          console.log('inside well', data);

          //$('#resultsBox').off();
        });

      });
  });
});
