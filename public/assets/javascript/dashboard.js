$("#myModal").modal();

$('#food').keypress(function(e) {
  if (e.which == 13) {
    $("#search").click();
  }
});

// search nutritionix api
$("#search").on("click", function() {
  $('#getFoodProgress').show();

  var foodItem = $("#food").val().trim();
  var nxParams = foodItem + "?results=0:10&fields=*&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06"

  // nutritionix
  var nxQuery = "https://api.nutritionix.com/v1_1/search/" + nxParams;

  $.get(nxQuery, function(data, status) {})
    .done(function(data) {
      $('#getFoodProgress').hide();
      $("#resultsBox").html("");

      for (var i = 0; i < data.hits.length; i++) {
        var fields = data.hits[i].fields;
        var well = '<div class="well" id="foodWell-' + i + '" data-toggle="modal" data-target="#myModal">' +
          '<h4><strong>#' + (i + 1) + '</strong> - ' + fields.brand_name + ' ' + fields.item_name + '</h4></div>';
        $("#resultsBox").append(well);
      }

      $('#resultsBox').on('click', '.well', function() {
        console.log('test');
      });

    });
});

var fatData = 65;

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'pie',
  // The data for our dataset
  data: {
    labels: [
      "Fat " + fatData + '%', "Carbs " + fatData + '%', "Protein " + fatData + '%'
    ],
    datasets: [{
      //label: "Macro Nutrient Breakdown",
      backgroundColor: ['#10aeb2', '#ecf284', '#daa520'],
      borderColor: 'rgb(255, 99, 132)',
      data: [62, 2, 36],
    }]
  },

  // Configuration options go here
  options: {}
});
