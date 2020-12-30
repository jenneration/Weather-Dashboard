$(document).ready(function () {
  console.log("I'm running too");

  //Variables
  var lat;
  var lon;
  var city;
  var currCity;
  var currIcon;
  var dayIconIn;
  var currentDate;
  var currDate;
  var dDate;
  var temp;
  var humidity;
  var wind;
  var uvIndex;
  var uvColor;
  var name;
  var apiKey = "ce88fbce1823777bbc3aa070ae9e6c27";
  //Storage array
  var storedCities = [];

  //Click event for input search
  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    city = $("#search-input").val();
    //TODO:Create message if no city entered
    // var message = $("<p>").text("Please enter a city");
    // message.attr("visibility", "hidden");
    // $.append(message);

    cityToStore();
    getCity();
  });

  //Click event for previous searches
  $(".row-cities-jg").on("click", ".btn", initializeTwo);

  function initializeTwo() {
    city = $(this).text();
    console.log(city);
    cityToStore();
    getCity();
  }

  //Local Storage functions

  //TODO: create clear options
  //localStorage.clear();

  //On load: get stored cities
  getCities();

  //On Load: get previous items
  function getCities() {
    var storedJSON = localStorage.getItem("storedCities");
    //Parse if items exists in array
    if (storedJSON !== null) {
      storedCities = JSON.parse(storedJSON);
      console.log(storedCities);
      console.log(storedCities[0].city);
    }
    //Render all recent searches in sidebar
    renderCities();
  }

  //Render sidebar/previous cities searched
  function renderCities() {
    for (var i = 0; i < storedCities.length; i++) {
      var storedDiv = $("<div>").text(storedCities[i].city);
      storedDiv.addClass("btn box-jg");
      storedDiv.attr("value", city);
      //console.log(storedCities[i].city);
      $(".row-cities-jg").append(storedDiv);
    }
  }

  //Render new search in sidebar & push searches to array & localStorage
  function cityToStore() {
    //Prepend new searches to sidebar
    var storedDiv = $("<div>").text(city);
    storedDiv.addClass("btn box-jg");
    storedDiv.attr("value", 0);

    $(".row-cities-jg").prepend(storedDiv);
    //Add new search to start of array
    name = { city };
    console.log(city);
    storedCities.unshift({ city });

    //Set new search to localStorage
    localStorage.setItem("storedCities", JSON.stringify(storedCities));
    console.log(storedCities);

    //Reset input
    $("#search-input").val("");
  }

  ////////////////////////////////////////////////////END LOCAL NEW LOCATION

  //CURRENT WEATHER - grabs city name
  function getCity() {
    //Query for current to get city name and coordinates
    var queryURL1 =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;

    //AJAX current weather to get city coordinates
    $.ajax({
      url: queryURL1,
      method: "GET",
    }).then(function (response) {
      console.log("THIS IS MAIN WEATHER");
      console.log(response);

      //Data from following One-Call
      dt = response.dt;
      currCity = response.name;
      lat = response.coord.lat;
      lon = response.coord.lon;
      currIcon = response.weather[0].icon;

      //Reset 5-day forecast div before rendering new search info
      $("#forecast").empty();
      //Make Ajax call to second URL for remaining stats
      getOneCall();

      //cityToStore();
    });
  }

  //AJAX ONE CALL
  function getOneCall() {
    var queryURL2 =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&dt=" +
      dt +
      "&exclude=minutely,hourly&units=imperial&appid=" +
      apiKey;

    $.ajax({
      url: queryURL2,
      method: "GET",
    }).then(function (response) {
      //Log the queryURL
      console.log("THIS IS ONE CALL");
      //console.log(queryURL2);
      console.log(response);

      //CURRENT weather stats
      temp = response.current.temp;
      humidity = humidity;
      wind = response.current.wind_speed;
      uvIndex = response.current.uvi;
      uvColor = Math.round(uvIndex);
      console.log(uvColor);

      //CURRENT CITY date
      currentDate = new Date(response.current.dt * 1000); //DATE
      //Date conversion
      console.log(currentDate.toDateString()); //Mon Dec 21 2020 ----YES
      console.log(currentDate);
      var monthA = currentDate.toLocaleString("en-US", { month: "numeric" });
      var dayB = currentDate.toLocaleString("en-US", { day: "numeric" });
      var yearC = currentDate.toLocaleString("en-US", { year: "numeric" });
      currDate = `(${monthA}/${dayB}/${yearC})`;
      console.log(currDate);

      /////////////////////

      //5-day Forecast
      for (var i = 1; i <= 5; i++) {
        // Convert "dt:"
        dDate = new Date(response.daily[i].dt * 1000);
        var month = dDate.toLocaleString("en-US", { month: "numeric" });
        var day = dDate.toLocaleString("en-US", { day: "numeric" });
        var year = dDate.toLocaleString("en-US", { year: "numeric" });
        formattedDate = `(${month}/${day}/${year})`;

        dayIconIn = $("<img>").attr(
          `src`,
          `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`
        );

        var dayTwo = $("<div class='col col-sm'>");

        var dayDate = $("<div class='row-city'>");
        dayDate.text(formattedDate);

        var dayTemp = $("<div class='box'>");
        dayTemp.text(`Temp: ${response.daily[i].temp.day} F`);

        var dayHumidity = $("<div class='box'>");
        dayHumidity.text(`Humidity: ${response.daily[i].humidity} %`);

        dayTwo.append(dayDate, dayIconIn, dayTemp, dayHumidity);
        $("#forecast").append(dayTwo);
      }

      //Reset current city elements before loading new search elements
      $("#city-weather-jg").empty();
      currentCity();
    });
  }

  //Render current search
  function currentCity() {
    //Main content
    var divCity = $("<h2>").text(currCity);
    var divDate = $("<div>").text(`${currDate}`);
    var currIconIn = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/wn/" + currIcon + "@2x.png"
    );
    var divTemp = $("<div>").text(`Temperature: ${temp} F`);
    var divHumidity = $("<div>").text(`Humidity: ${humidity}%`);
    var divWind = $("<div>").text(`Wind Speed: ${wind} MPH`);
    var divUV = $("<div>").text(`UV Index: ${uvIndex}`);

    //UV Color background
    console.log(uvColor);
    if (uvColor <= 2) {
      divUV.attr("class", "green uv");
    } else if ((uvColor = 3 && uvColor <= 5)) {
      divUV.attr("class", "yellow uv");
    } else if ((uvColor = 6 && uvColor <= 7)) {
      divUV.attr("class", "orange uv");
    } else if ((uvColor = 8 && uvColor <= 10)) {
      divUV.attr("class", "red uv");
    } else if (uvColor >= 11) {
      divUV.attr("class", "violet uv");
    }

    $("#city-weather-jg").append(
      divCity,
      divDate,
      currIconIn,
      divTemp,
      divHumidity,
      divWind,
      divUV
    );
  }
});
