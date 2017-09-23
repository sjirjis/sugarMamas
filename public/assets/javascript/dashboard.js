$("#myModal").modal('hide');

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
        var thisDataField = data.hits[$(this).attr("id").split("-")[1]].fields;
        var
          calories = thisDataField.nf_calories,                caloriesDv = Math.ceil(calories / 2000 * 100),
          totFatGrams = thisDataField.nf_total_fat,            totFatDv = Math.ceil(totFatGrams / 65 * 100),
          satFatGrams = thisDataField.nf_saturated_fat,        satFatDv = Math.ceil(satFatGrams / 20) * 100,
          cholesterolMgrams = thisDataField.nf_cholesterol,    cholesterolDv = Math.ceil(cholesterolMgrams / 300 * 100),
          totCarbsGrams = thisDataField.nf_total_carbohydrate, totCarbsDv = Math.ceil(totCarbsGrams / 300 * 100),
          fiberGrams = thisDataField.nf_dietary_fiber,         fiberDv = Math.ceil(fiberGrams / 25 * 100),
          sugarsGrams = thisDataField.nf_sugars,               sugarsDv = Math.ceil(sugarsGrams / 25 * 100),
          proteinGrams = thisDataField.nf_protein,             proteinDv = Math.ceil(proteinGrams / 50 * 100)

          $('#calories').html(calories);                          $('#caloriesDv').html(caloriesDv + '%');
          $('#totFatGrams').html(totFatGrams + 'g');              $('#totFatDv').html(totFatDv + '%');
          $('#satFatGrams').html(satFatGrams + 'g');              $('#satFatDv').html(satFatDv + '%');
          $('#cholesterolMgrams').html(cholesterolMgrams + 'g');  $('#cholesterolDv').html(cholesterolDv + '%');
          $('#totCarbsGrams').html(totCarbsGrams + 'g');          $('#totCarbsDv').html(totCarbsDv + '%');
          $('#fiberGrams').html(fiberGrams + 'g');                $('#fiberDv').html(fiberDv + '%');
          $('#sugarsGrams').html(sugarsGrams + 'g');              $('#sugarsDv').html(sugarsDv + '%');
          $('#proteinGrams').html(proteinGrams + 'g');            $('#proteinDv').html(proteinDv + '%');

          console.log(thisDataField);

      });

    });
});

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'pie',
  // The data for our dataset
  data: {
    labels: [
      "Fat " +  + '%', "Carbs " +  + '%', "Protein " +  + '%'
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
