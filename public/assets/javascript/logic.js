// Initialize Firebase
var config = {
	apiKey: "AIzaSyC1xwFFh0HnpAEdj671N44k7-LTNa1BrjY",
    authDomain: "sugardaddy-5726a.firebaseapp.com",
    databaseURL: "https://sugardaddy-5726a.firebaseio.com",
    storageBucket: "sugardaddy-5726a.appspot.com",
    messagingSenderId: "235207951688"
};
firebase.initializeApp(config);
var database = firebase.database();
var fbAuth = firebase.auth();
var auth = {};
var logSearch = {};


$(document).ready(function() {
  $("#searchBox").hide();
  $("#resultsBox").hide();
  $("#finalBox").hide();

  // listens for login
  fbAuth.onAuthStateChanged(function(user){
      if (user){
        console.log(user);
        console.log(user.email);
        console.log(user.uid);
        sessionStorage.active = user.uid;
        console.log("user uid = " + sessionStorage.active + "user email = " + user.email + " LOGGED IN");
      } else {
        console.log('NOBODY LOGGED IN');
      }
    });

  //log in
  auth.logIn = function(){
    var $username = $('#loginUser').val().trim();
    var $password = $('#loginPassword').val().trim();        

    fbAuth.signInWithEmailAndPassword($username, $password).catch(function(error){
      console.log(error.message);
    });
  };

  $('#loginSubmit').on('click', function(){
    console.log("login start");
    var $username = $('#loginUser').val().trim();
    var $password = $('#loginPassword').val().trim();        
    var loginFirstName = ''

    fbAuth.signInWithEmailAndPassword($username, $password).catch(function(error){
      console.log(error.message);
    });
    
    //if the login was successully, show to modal
    //$('.modal-title').html('Welcome back' + loginFirstName + '!')
    $('.modal-title').html('Welcome Back!')
    $('#myModal').modal('show');
    setTimeout(function() {$('#myModal').modal('hide');}, 2000);    

    $("#loginBox").hide();
    $("#searchBox").show();
    $(".signUp").hide();
    $(".login").hide();
  });

  //logout
  auth.logOut = function(){
    console.log("successfully logged out");
    fbAuth.signOut();

  };

  $('#logoutNow').on('click', function(){
    auth.logOut();    
    //not working, don't know why @todo    
    // $('.modal-title').html('See you next time, eat well!');
    // $('#myModal').modal('show');   
    // setTimeout(function() {$('#myModal').modal('hide');}, 2000);
    setTimeout(function(){window.location.href='index.html', 3000});      
  });

  $('#logoutNoww').on('click', function(){
    auth.logOut();    
    //not working, don't know why @todo    
    // $('.modal-title').html('See you next time, eat well!');
    // $('#myModal').modal('show');   
    // setTimeout(function() {$('#myModal').modal('hide');}, 2000);
    setTimeout(function(){window.location.href='index.html', 3000});      
  });

  $("#signupSubmit").on("click", function() {
    var firstName = $("#signupFn").val().trim();
    var lastName = $("#signupLn").val().trim();
    var zipcode = $("#signupZipcode").val().trim();
    var isr = $("#signupIsr").val().trim();
    var ibr = $("#signupIbr").val().trim();
    var $password = $("#signupPassword").val().trim();
    var $username = $("#signupEmail").val().trim();

    // can only register one account per email
    fbAuth.createUserWithEmailAndPassword($username, $password).then(function(user){
      if (user in fbAuth) {
        console.log("ALREADY EXISTS")
      } else {
        database.ref('main/users').once("value").then(function(snapshot) {
          if (user.uid in snapshot.val()) {
            console.log("UID ALREADY EXISTS");
            alert("This e-mail has already been registered. Please try another.");
          } else {
            database.ref('main/users').child(user.uid).set({
              firstName: firstName,
              lastName: lastName,
              zipcode: zipcode,
              isr: isr,
              ibr: ibr,
              email: $username,
            });
            //if the login was created successully, show to modal
            $('.modal-title').html('Welcome ' + firstName + '!')
            $('#myModal').modal('show');
            setTimeout(function() {$('#myModal').modal('hide');}, 2000);
          }
        });
      }
    }).catch(function(error) {
      console.log(error.message);
    });

    $("#signupBox").hide();
    $("#searchBox").show();
    $(".signUp").hide();
    $(".login").hide();
  });

  // search nutritionix api
  $("#searchSubmit").on("click", function() {
    var nxQuery = $("#searchInput").val().trim();
    var nxFormat = "?results=0:20&fields=*"
    // nutritionix
    var nxTail = "&appId=84a9f6f9&appKey=48136d097a467ec20665eaa96a5f6f06";
    var nxHead = "https://api.nutritionix.com/v1_1/search/"
    var together = nxHead + nxQuery + nxFormat + nxTail;
    $.ajax({
      url: together,
      method: 'GET'
    }).done(function(result) {
      $("#resultsBox").html("");
      console.log(result);

      for (var i = 0; i < 10; i++) {
        var slot = ("r" + i);
        var stored = result.hits[i].fields;
        database.ref("main/results").child(slot).update(stored);

        temp = $("<p>");
        temp.addClass("resultsOptions");
        temp.attr("id", slot);
        temp.html(result.hits[i].fields.brand_name + " " + result.hits[i].fields.item_name)
        $("#resultsBox").append(temp);
      };
    });

    $("#searchBox").hide();
    $("#resultsBox").show();
  });

  $("#resultsBox").on("click", ".resultsOptions", function() {
    identity = $(this).attr("id");
    console.log(identity);
    $("#resultsBox").html("");

    database.ref("main/results").child(identity).once("value").then(function(snapshot) {
      // store data and check values
      console.log(snapshot.val());
      var name = snapshot.val().brand_name + " " + snapshot.val().item_name;
      console.log(name);

      var serving = snapshot.val().nf_serving_size_qty + 
      " " + snapshot.val().nf_serving_size_unit;
      console.log(serving);

      var calories = snapshot.val().nf_calories;
      console.log("calories " + calories);

      var fats = snapshot.val().nf_total_fat;
      console.log("fats " + fats);

      var carbs = snapshot.val().nf_total_carbohydrate;
      console.log("carbohydrates " + carbs);

      var protein = snapshot.val().nf_protein;
      console.log("protein " + protein);

      var sugar = snapshot.val().nf_sugars;
      console.log("sugar " + sugar + "g");

      var fiber = snapshot.val().nf_dietary_fiber;
      console.log("fiber " + fiber + "g");

      logSearch = {
        name: name,
        calories: calories,
        sugar: sugar
      }
      console.log(logSearch);

      // actual output

      // nutrition facts
      var nameX = $("<h1>").html(name);
      var servingX = $("<p>").html(serving);
      var caloriesX = $("<p>").html("calories " + calories);
      var fatsX = $("<p>").html("fats " + fats);
      var carbsX = $("<p>").html("carbohydrates " + carbs);
      var proteinX = $("<p>").html("protein " + protein);
      if (sugar === undefined) {
        var sugarX = $("<p>").html("<strong>No sugar information available.</strong>");
      } else {
        var sugarX = $("<p>").html("sugar " + sugar + "g");
      }
      if (fiber === undefined) {
        var fiberX = $("<p>").html("<strong>No fiber information available.</strong>");
      } else {
        var fiberX = $("<p>").html("fiber " + fiber + "g");
      }

      // recommendations
      var sugarCal = (sugar * 4);
      var sugarCalX = $("<p>").html("This product contains " + sugarCal + " calories from <strong>sugar alone</strong>");

      var moreFiber = Math.round(sugar - fiber);
      var moreFiberX = $("<p>").html("you should consume " + moreFiber + "g more fiber");

      var spinachServings = Math.round(10*(moreFiber/(0.7)))/10;
      var spinachCalories = Math.round(spinachServings * 7)
      var spinachX = $("<p>").html(spinachServings +
        " cups of spinach, which adds " + spinachCalories + " calories");

      var celeryServings = Math.round(10*(moreFiber/(1.6)))/10;
      var celeryCalories = Math.round(celeryServings * 16)
      var celeryX = $("<p>").html(celeryServings +
        " cups of celery, which adds " + celeryCalories + " calories");

      var almondServings = Math.round(10*(moreFiber/(11)))/10;
      var almondCalories = Math.round(almondServings * 529);
      var almondX = $("<p>").html(almondServings +
        " cups of almonds, which adds " + almondCalories + " calories");

      var oatmealServings = Math.round(10*(moreFiber/(4)))/10;
      var oatmealCalories = Math.round(oatmealServings * 158);
      var oatmealX = $("<p>").html(oatmealServings +
        " cups of oatmeal, which adds " + oatmealCalories + " calories");

      var beanServings = Math.round(10*(moreFiber/(30)))/10;
      var beanCalories = Math.round(beanServings * 670);
      var beanX = $("<p>").html(beanServings +
        " cups of beans, which adds " + beanCalories + " calories");



      // diabetic information
      database.ref('main/users').child(sessionStorage.active).once("value").then(function(snapshot) {
        if ((snapshot.val().isr === "") && (snapshot.val().ibr === "")) {
          console.log("not diabetic");
        } else {
          var insulinNeeded = Math.round(10*(sugar/(snapshot.val().isr)))/10;
          var isrX = $("<p>").html("You will need to take " + insulinNeeded + " doses of insulin.")
          var bsRise = Math.round((snapshot.val().ibr/snapshot.val().isr) * sugar);
          var bsrX = $("<p>").html("Your blood sugar will rise " + bsRise + " units");
        }
      });

      // WEATHER
      var apiKey = '5710c2dc5b0a0e4708bc544bb75227eb'
      ,temperature = ''
      ,weatherDescription = ''
      ,condition = "";

      $.ajax({
        //url: 'api.openweathermap.org/data/2.5/forecast?appid=' + apiKey + '&zip=94040,us'
        url: 'https://proxy-cbc.herokuapp.com/proxy',
        method: 'POST',
        data: {url: 'http://api.openweathermap.org/data/2.5/forecast'
        +'?appid=5710c2dc5b0a0e4708bc544bb75227eb'
        +'&zip=92021,us'
        +'&cnt=1'
        +'&units=imperial'}
        }).done(function(response){
          temperature = response.data.list[0].main.temp;
          weatherDescription = response.data.list[0].weather[0].description;
          condition = response.data.list[0].weather[0].main;

          console.log("temp: " + temperature);
          console.log("weather description " + weatherDescription);
          console.log(condition);

          var weatherDescriptionX = $("<p>").html("It's " + temperature + 
            " degrees Fahrenheit outside with " + weatherDescription);
          var conditionX = $("<p>");

          if ((condition === "Clouds") || (condition === "Clear")) {
            conditionX.html("You should exercise outside!")
          } else {
            conditionX.html("It's raining. Maybe you should go to the gym.")
          };

          var exerciseBox = $("<div>").attr("id", "exerciseBox");
          exerciseBox.append("<h3>Exercise Recommendations</h3>");

          bikeTime = Math.round(caloriesX / (650/60));
          bikeTimeX = $("<p>").html("You could bike for " + bikeTime + " minutes.");
          exerciseBox.append(weatherDescriptionX, conditionX);

          $("#outputBox").append(exerciseBox);
        });

      // output everything
      $("#outputBox").html("");
      $("#outputBox").append(nameX);
      var nutritionInfo = $("<div>").attr("id", "nutritionInfo");
      nutritionInfo.append(servingX, caloriesX, fatsX, carbsX, proteinX,
        sugarX, fiberX);
      $("#outputBox").append(nutritionInfo);
      $("#outputBox").append("<br>");
      var bloodInfo = $("<div>").attr("id", "bloodBox");
      $("#outputBox").append(bloodInfo);

      if ((sugar != undefined) && (fiber != undefined)) {
        $("#outputBox").append(sugarCalX, moreFiberX);
        $("#outputBox").append("<h3>You could eat:</h3><br>");
        $("#outputBox").append(spinachX, celeryX, almondX, oatmealX, beanX);
        database.ref('main/users').child(sessionStorage.active).once("value").then(function(snapshot) {
          if ((snapshot.val().isr === "") && (snapshot.val().ibr === "")) {
            console.log("not diabetic");
          } else {
            var insulinNeeded = Math.round(10*(sugar/(snapshot.val().isr)))/10;
            var isrX = $("<p>").html("You will need to take " + insulinNeeded + " doses of insulin.")
            var bsRise = Math.round((snapshot.val().ibr/snapshot.val().isr) * sugar);
            var bsrX = $("<p>").html("Your blood sugar will rise " + bsRise + " units");
            $("#bloodBox").append("<h3>Blood Sugar Information:<h3>")
            $("#bloodBox").append(bsrX, isrX, "<hr>");
          }
        });
      };
    });

$('#finalBox').show();

  });

  $("#historySubmit").on("click", function() {
    var dt = new Date();
    // stored as epoch time so you can print the history out in chronological order! 
    var time = dt.getTime();
    database.ref('main/users').child(sessionStorage.active).child('history').child(time).update({
      name: logSearch.name,
      sugar: logSearch.sugar,
      calories: logSearch.calories,
      date: dt
    })
  })

  $('#forgotPassword').on('click', function(){
       fbAuth.sendPasswordResetEmail(email);
   });

  $("#searchAgain").on('click', function() {
    $("#searchBox").show();
    $("#finalBox").hide();
  })

});