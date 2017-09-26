$(document).ready(function() {

  $("#myModal").modal('hide');
  $('svg, #checkmarkText, #crossText').hide();

  $('#food').keypress(function(e) {
    if (e.which == 13) {
      $("#search").click();
    }
  });

  // search nutritionix api
  $("#search").on("click", function() {

    var foodItem = $("#food").val().trim();
    var nxParams = foodItem + "?results=0:10&fields=*&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06"

    //check for empty search
    if (foodItem.length <= 1) {
      $("#errorModal").modal('show');
      return;
    }

    $('#getFoodProgress').show();
    console.log(foodItem);

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
          //get the
          var thisDataField = data.hits[$(this).attr("id").split("-")[1]].fields;
          console.log(data);
          var
            divTableFoodItem = thisDataField.item_name,

            //get all serving info
            servingSizeQty = thisDataField.nf_serving_size_qty,
            servingSizeUnit = thisDataField.nf_serving_size_unit,
            servingWeightGrams = thisDataField.nf_serving_weight_grams,

            //piece together serving info
            divTableServingSize = servingSizeQty + " " + servingSizeUnit + " (" + servingWeightGrams + "g)",

            //get all nutrition facts first by weight, then calculate their DV respectivly
            totFatGrams = Math.round(thisDataField.nf_total_fat),
            totFatDv = Math.round(totFatGrams / 65 * 100),
            satFatGrams = Math.round(thisDataField.nf_saturated_fat),
            satFatDv = Math.round(satFatGrams / 20 * 100),
            cholesterolMgrams = Math.round(thisDataField.nf_cholesterol),
            cholesterolDv = Math.round(cholesterolMgrams / 300 * 100),
            totCarbsGrams = Math.round(thisDataField.nf_total_carbohydrate),
            totCarbsDv = Math.round(totCarbsGrams / 300 * 100),
            fiberGrams = Math.round(thisDataField.nf_dietary_fiber),
            fiberDv = Math.round(fiberGrams / 25 * 100),
            sugarsGrams = Math.round(thisDataField.nf_sugars),
            sugarsDv = Math.round(sugarsGrams / 25 * 100),
            proteinGrams = Math.round(thisDataField.nf_protein),
            proteinDv = Math.round(proteinGrams / 50 * 100),

            //calculateCalories by macro nutrient
            totFatCalories = totFatGrams * 9,
            totCarbCalories = totCarbsGrams * 4,
            proteinCalories = proteinGrams * 4,

            //calc tot calories & dv
            calories = Math.round(totFatCalories + totCarbCalories + proteinCalories),
            caloriesDv = Math.round(calories / 2000 * 100)

          //display all nutrition data gathered above
          $('#divTableFoodItem').html('<h3>' + divTableFoodItem + '</h3>');
          $('#divTableServingSize').html('<h4>' + divTableServingSize + '</h4>');

          $('#calories').html(calories);
          $('#caloriesDv').html(caloriesDv + '%');
          $('#totFatGrams').html(totFatGrams + 'g');
          $('#totFatDv').html(totFatDv + '%');
          $('#satFatGrams').html(satFatGrams + 'g');
          $('#satFatDv').html(satFatDv + '%');
          $('#cholesterolMgrams').html(cholesterolMgrams + 'g');
          $('#cholesterolDv').html(cholesterolDv + '%');
          $('#totCarbsGrams').html(totCarbsGrams + 'g');
          $('#totCarbsDv').html(totCarbsDv + '%');
          $('#fiberGrams').html(fiberGrams + 'g');
          $('#fiberDv').html(fiberDv + '%');
          $('#sugarsGrams').html(sugarsGrams + 'g');
          $('#sugarsDv').html(sugarsDv + '%');
          $('#proteinGrams').html(proteinGrams + 'g');
          $('#proteinDv').html(proteinDv + '%');

          //sugar guilt
          if (sugarsGrams > 8 || sugarsDv > 33) {
            $('.sugarDV').html('This food alone put you at <strong>' + sugarsDv + '</strong>% of your daily sugar allowance!');
          }

          // 5:1 fiber ratio rule
          if ((totCarbsGrams / fiberGrams) <= 5) {
            $('#checkmark, #checkmarkText').show();
          } else {
            $('#cross, #crossText').show();
          }

          console.log(thisDataField);

          //prep data for chart
          percentCalFromFat = Math.round(totFatCalories / calories * 100),
            percentCalFromCarbs = Math.round(totCarbCalories / calories * 100),
            percentCalFromProtein = Math.round(proteinCalories / calories * 100);

          var ctx = document.getElementById('myChart').getContext('2d');
          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',
            // The data for our dataset
            data: {
              labels: [
                percentCalFromFat + '% Fat',
                percentCalFromCarbs + '% Carb',
                percentCalFromProtein + '% Protein'
              ],
              datasets: [{
                //label: "Macro Nutrient Breakdown",
                backgroundColor: ['#10aeb2', '#ecf284', '#daa520'],
                borderColor: 'rgb(255, 99, 132)',
                data: [percentCalFromFat, percentCalFromCarbs, percentCalFromProtein],
              }]
            },

            // Configuration options go here
            options: {}
          });
        });
      });
  });
});
