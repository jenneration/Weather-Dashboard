$(document).ready(function () {
  console.log("I'm running too");

  //Variables
  var lat;
  var lon;
  var city;
  var currIcon;
  var currIconIn;
  var dayIcon;
  var dayIconIn;
  var currentDate;
  var currDate;
  var newDate;
  var temp;
  var humidity;
  var wind;
  var uvIndex;
  var dayOne;
  var dayTwo;
  var dayThree;
  var dayFour;
  var dayFive;
  //Page Elements

  var weatherStats = [];

  //Open Weather Key & URLs
  var apiKey = "ce88fbce1823777bbc3aa070ae9e6c27";
  var queryURL1 =
    "https://api.openweathermap.org/data/2.5/weather?q=Boston&appid=" + apiKey; //Set to Boston

  ////MOVED INTO function getWeather

  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    city = $("#search-input").val();
    // console.log("I'm clicked");
    // console.log(city);

    getCity();
    //pushInfo();//NOT WORKING
  });

  ////////////////////////////////////////////////////

  getCity(); //TEST
  //CURRENT WEATHER - grabs city name
  function getCity() {
    // var queryURL1 =
    //For button SUBMIT
    // var queryURL1 =
    //   "https://api.openweathermap.org/data/2.5/weather?q=" +
    //   city +
    //   "&appid=" +
    //   apiKey;
    $.ajax({
      url: queryURL1,
      method: "GET",
    }).then(function (response) {
      console.log("THIS IS MAIN WEATHER");
      //console.log(queryURL1);
      console.log(response);
      // console.log(response.name);

      //Coordinates for following One-Call
      lat = response.coord.lat;
      lon = response.coord.lon;
      dt = response.dt;
      console.log(dt);
      //PAGE ELEMENTS
      //Current city being searched
      city = response.name;
      currIcon = response.weather[0].icon;

      var divCity = $("<h2>");
      divCity.text(city);

      currIconIn = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + currIcon + "@2x.png"
      );
      $("#city-weather-jg").append(divCity, currIconIn);
      // console.log(icon);

      getOneCall();
    });
  } //END getCity

  //ONE CALL
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
      console.log(temp);
      humidity = humidity;
      wind = response.current.wind_speed;
      uvIndex = response.current.uvi;

      // //CURRENT CITY date
      currentDate = new Date(response.current.dt * 1000); //DATE

      //TODO: TIME SOLUTION?????

      // var time = moment(timestamp).format("DD-MM-YYYY");
      // console.log(time);

      console.log(currentDate.toDateString()); //Mon Dec 21 2020 ----YES
      console.log(currentDate);
      var monthA = currentDate.toLocaleString("en-US", { month: "numeric" });
      var dayB = currentDate.toLocaleString("en-US", { day: "numeric" });
      var yearC = currentDate.toLocaleString("en-US", { year: "numeric" });
      currDate = `(${monthA}/${dayB}/${yearC})`;
      console.log(currDate);

      /////////////////////

      //FIVE-DAY STATS
      //TODO: DATES!!!!!
      // // Convert "dt:"
      // var dayDate = new Date(response.daily[1].dt * 1000);
      // var month = dayDate.toLocaleString("en-US", { month: "numeric" });
      // var day = dayDate.toLocaleString("en-US", { day: "numeric" });
      // var year = dayDate.toLocaleString("en-US", { year: "numeric" });
      // formattedDate = `(${month}/${day}/${year})`;

      // //var string = (dayDate.toDateString()); //Mon Dec 21 2020 -- YES
      // var month = dayDate.toLocaleString("en-US", { month: "numeric" });
      // var day = dayDate.toLocaleString("en-US", { day: "numeric" });
      // var year = dayDate.toLocaleString("en-US", { year: "numeric" });
      // var formattedDate = `(${month}/${day}/${year})`;

      // newDate = $("<div>");
      // newDate.text(formattedDate); //DATE

      // // TODO: Create 5-day forecast section
      // dTemp = response.daily[0].temp.day;
      // dHumidity = response.daily[0].humidity;
      // dayIcon = response.daily[0].weather[0].icon;

      //5-day Forecast
      for (var i = 1; i <= 5; i++) {
        var dayTwo = $("<div class='col col-sm'>");

        dayIconIn = $("<img>").attr(
          `src`,
          `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`
        );

        var dayTemp = $("<div>");
        dayTemp.text(`Temp: ${response.daily[i].temp.day} F`);

        var dayHumidity = $("<div>");
        dayHumidity.text(`Humidity: ${response.daily[i].humidity} %`);

        dayTwo.append(dayTemp, dayHumidity, dayIconIn);
        $("#forecast").append(dayTwo);
      }

      renderPage();
    });
  }

  //////////////////////////////////Create current city weather div
  function renderPage() {
    //Main content

    var divDate = $("<div>");
    divDate.text(`${currDate}`);

    var divTemp = $("<div>");
    divTemp.text(`Temperature: ${temp} F`);

    var divHumidity = $("<div>");
    divHumidity.text(`Humidity: ${humidity}%`);

    var divWind = $("<div>");
    divWind.text(`Wind Speed: ${wind} MPH`);

    var divUV = $("<div>");
    divUV.text(`UV Index: ${uvIndex}`);

    $("#city-weather-jg").append(divDate, divTemp, divHumidity, divWind, divUV);
  }

  //Function to convert and format "dt:" date

  //////////
});

// var dayDate = new Date(response.daily[1].dt * 1000);
// function convertDate(date) {
//   var month = dayDate.toLocaleString("en-US", { month: "numeric" });
//   var day = dayDate.toLocaleString("en-US", { day: "numeric" });
//   var year = dayDate.toLocaleString("en-US", { year: "numeric" });
//   var formattedDate = `(${month}/${day}/${year})`;
//   console.log(formattedDate);
// }

//current weather stats
// console.log(response.daily[0].dt); // current day
// console.log(response.current.temp);
// console.log(response.current.humidity);
// console.log(response.current.wind_speed);
// console.log(response.current.uvi);

// cDate = Date.parse(currDate);
// console.log(cDate);
// console.log(currDate);
// console.log(currentDate);
