console.log("ready!");

$(document).ready(function () {
  console.log("I'm running too");
  //Variables

  //Search for City
  var apiKey = "ce88fbce1823777bbc3aa070ae9e6c27";

  var queryURL1 =
    "https://api.openweathermap.org/data/2.5/weather?" +
    city +
    "&appid=" +
    apiKey;

  //Search for 5-day forecast
  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?" +
    "q=London&cnt=45&units=imperial&appid=" +
    apiKey; //TODO: Add cnt=56&imperial

  //UV Index
  var queryURL3 =
    "http://api.openweathermap.org/data/2.5/uvi?lat=51.51&lon=-0.13&appid=" +
    apiKey;

  //Initialize weather queries
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    console.log("I'm clicked");
  });

  ////////////////////////////////////////////////////
  //AJAX call to the OpenWeatherMap - WEATHER
  $.ajax({
    url: queryURL1,
    method: "GET",
  }).then(function (response) {
    // Log the queryURL
    console.log("THIS IS MAIN WEATHER");
    //console.log(queryURL1);
    console.log(response);
    console.log(response.name);
    console.log(response.weather[0]); //Image div?
    console.log(response.main.temp);
    console.log(response.main.humidity);
    console.log(response.wind);
  });

  //////////////////////////////////////////
  //AJAX call to the OpenWeatherMap - 5-day forecast
  $.ajax({
    url: queryURL2,
    method: "GET",
  }).then(function (response) {
    // Log the queryURL
    console.log("THIS IS 5-DAY FORECAST");
    console.log(queryURL2);
    console.log(response);
    console.log(response.list[0]);
    console.log(response.list[0].main.temp);
    console.log(response.list[0].main.humidity);
    console.log(response.list[0].weather[0]); //Icons?
    console.log(response.list[0].dt_txt); //Icons?
  });

  ////////////////////////////////////////
  //AJAX for UV Index
  $.ajax({
    url: queryURL3,
    method: "GET",
  }).then(function (response) {
    // Log the queryURL
    console.log("THIS IS UV INDEX");
    console.log(queryURL3);
    console.log(response);
    console.log(response.value);
    //console.log(resonse.value);
    //console.log(date_iso);
    //console.log(date);
  });
});
