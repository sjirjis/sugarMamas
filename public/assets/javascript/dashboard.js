$(document).ready(function() {

  console.log('dashboard.js loaded');

  $("#myModal").modal('hide');

  $('#food').keypress(function(e) {
    if (e.which === 13) {
      $("#search").click();
    }
  });

  // search nutritionix api
  $("#search").on("click", function() {

    //get users search value
    var foodItem = $("#food").val().trim();

    //check for empty search string
    if (foodItem.length == 0) {
      $('.modal-body').html('<p>Please enter a food in the search box.</p>')
      $("#errorModal").modal('show');
      return;
    }

    //display progress bar at static 90%
    $('#getFoodProgress').show();

    // nutritionix
    var nxParams = foodItem + "?results=0:10&fields=*&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06"
    var nxQuery = "https://api.nutritionix.com/v1_1/search/" + nxParams;

    $.get(nxQuery)
      .done(function(data) {
        $('#getFoodProgress').hide();

        //handle no api results
        if (data.hits.length == 0) {
          $('#resultsBox').empty();
          $('#resultsBox').off(); //release data from previous call so not to interfere with next call
          $("#errorModalBody").html('<p>No results. Try searching something else.</p>');
          $("#errorModal").modal('show');
          return;
        }

        //clear resultsBox
        $('#resultsBox').empty();
        $('#resultsBox').off(); //release data from previous call so not to interfere with next call

        //build resultsBox wells
        for (var i = 0; i < data.hits.length; i++) {
          var fields = data.hits[i].fields;
          var well = '<div class="well" id="foodWell-' + i + '" data-toggle="modal" data-target="#myModal">' +
            '<h4><strong>#' + (i + 1) + '</strong> - ' + fields.brand_name + ' ' + fields.item_name + '</h4></div>';
          $("#resultsBox").append(well);
        }

        //handle back to top button
        var wellCount = document.getElementById('resultsBox').childNodes.length;
        if (wellCount > 0) {
          $(".topOfSearch").show();
        }


        $('#resultsBox').on('click', '.well', function() {

          //get data for clicked-on well to display in modal
          var thisDataField = data.hits[$(this).attr("id").split("-")[1]].fields;

          console.log(thisDataField);
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
            $('.sugarDV').html('This food alone puts you at <strong>' + sugarsDv + '%</strong> of your daily sugar allowance!');
          }

          // 5:1 fiber ratio rule
          if ((totCarbsGrams / fiberGrams) <= 5) {
            $('.pass').show();
            $('.fail').hide();
          } else {
            $('.fail').show();
            $('.pass').hide();

            var totFiberNeeded = totCarbsGrams / 5;
            var addedFiberNeeded = Math.ceil(totFiberNeeded - fiberGrams);

            //display markup of how much more fiber is needed to get withithe 5:1 ratio
            //simple grammer handling for plural fiber amounts
            if (addedFiberNeeded == 1) {
              $('.fiberNeeds').html('<p>You would need an additonal' + addedFiberNeeded + ' additional gram of fiber to get within the 5:1 ratio.')
            } else {
              $('.fiberNeeds').html('<p>You would need an additonal' + addedFiberNeeded + ' additional grams of fiber to get within the 5:1 ratio.')
            }
          }

          //prep data for chart
          var chartData = {}
            chartData.percentCalFromFat = Math.round(totFatCalories / calories * 100),
            chartData.percentCalFromCarbs = Math.round(totCarbCalories / calories * 100),
            chartData.percentCalFromProtein = Math.round(proteinCalories / calories * 100);

          //generate the initial chart
          genChart(chartData);

            //re-gen the chart based on window servingSizeQty
            //listen for window resizing to re-gen chart
            $(window).resize(function() {
                genChartOnResize(chartData);
            });

        }); //end #resultsBox.on click
      }); //end get().done()
  }); //end #search.on click

  function genChart(data){

    $('#myChart').remove();
    $('.chartParentDiv').append('<canvas id="myChart"></canvas>');

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'pie',
      // The data for our dataset
      data: {
        labels: [
          data.percentCalFromFat + '% Fat',
          data.percentCalFromCarbs + '% Carb',
          data.percentCalFromProtein + '% Protein'
        ],
        datasets: [{
          //label: "Macro Nutrient Breakdown",
          backgroundColor: ['#10aeb2', '#ecf284', '#daa520'],
          borderColor: 'rgb(255, 99, 132)',
          data: [data.percentCalFromFat, data.percentCalFromCarbs, data.percentCalFromProtein],
        }]
      },
      // Configuration options go here
      options: {
        responsive: true
      }
    });
  }; //end chart function

  //this functiuon is to fix a defect in chart.js resizing
  //when we cross from mobile L to Tablet size screen, the chart size gets out of whack
  //so we look for when the cross of those windows sizes are, then re-gen the chart
  var lastX = window.innerWidth
  var lastY = window.innerHeight

  function genChartOnResize(data) {
     var x = window.innerWidth
     var y = window.innerHeight
     if (lastX <= 768 && 768 < x) {
        genChart(data);
     }
     lastX = x
     lastY = y
  }

});
