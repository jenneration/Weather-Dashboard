$(document).ready(function() {
    console.log("I'm running too");
    //TODO: responsive, ensure no empty divs
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

    function displayMessage(type, message) {
        $("#message").text(message);
        $("#message").attr("class", type);
    }




    //Click event#1 for input search
    $("#search-btn").on("click", function(event) {
        event.preventDefault();

        city = $("#search-input").val();

        //if no city entered, return
        if (!$("#search-input").val()) {
            return;
        }

        // if ($("#search-input").val() === "") {
        //     displayMessage("error", "Please enter a city");
        // }


        cityToStore();
        getCity();
    });

    //Click event#2 for previous searches
    $(".row-cities-jg").on("click", ".btn", initializeTwo);

    function initializeTwo() {
        city = $(this).text();
        console.log(city);
        cityToStore();
        getCity();
    }

    //On load: get stored cities
    getCities();

    //On load: render last searched city's current weather
    // renderLastSearch();
    function renderLastSearch() {
        var getOneJSON = localStorage.getItem("storedCities[0].name");
        if (getOneJSON !== null) {
            storedCities[0].name = JSON.parse(getOneJSON);
            console.log(storedCities[0].name);
        }

    }


    //Render on page load: last search and previous cities searched
    function getCities() {
        var storedJSON = localStorage.getItem("storedCities");
        //Parse if items exists in array
        if (storedJSON !== null) {
            storedCities = JSON.parse(storedJSON);
            console.log(storedCities);
            console.log(storedCities[0].city);
            if (storedCities[0].city !== null) {
                city = storedCities[0].city;
                //Renders main search div
                getCity();
            }
        }

        //Renders previously searched cities 
        renderCities();
    }

    //Renders previous cities searched
    function renderCities() {

        //Limit saved searches to 10
        storedCities.length = 10;

        for (var i = 0; i < storedCities.length; i++) {
            var storedDiv = $("<div>").text(storedCities[i].city);
            storedDiv.addClass("btn box-jg");
            storedDiv.attr("value", city);
            //console.log(storedCities[i].city);
            $(".row-cities-jg").append(storedDiv);
        }
    }

    //Render current search in sidebar & push searches to array & localStorage
    function cityToStore() {

        //Add new search to start of array
        name = { city };
        console.log(city);
        storedCities.unshift({ city });

        //Set new search to localStorage
        localStorage.setItem("storedCities", JSON.stringify(storedCities));
        console.log(storedCities);

        //Reset input
        $("#search-input").val("");
        $("#forecast").empty();
        $(".row-cities-jg").empty();
        getCities();
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
        }).then(function(response) {
            console.log("THIS IS MAIN WEATHER");
            console.log(response);

            //Data from following One-Call
            dt = response.dt;
            currCity = response.name;
            lat = response.coord.lat;
            lon = response.coord.lon;
            currIcon = response.weather[0].icon;

            //Reset 5-day forecast div before rendering new search info
            ///////////////////////////////////////////////////////////////////
            // $("#forecast").empty();
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
        }).then(function(response) {
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
            $("#forecast").empty();
            for (var i = 1; i <= 5; i++) {
                // Convert "dt:"
                dDate = new Date(response.daily[i].dt * 1000);
                var month = dDate.toLocaleString("en-US", { month: "numeric" });
                var day = dDate.toLocaleString("en-US", { day: "numeric" });
                var year = dDate.toLocaleString("en-US", { year: "numeric" });
                formattedDate = `${month}/${day}/${year}`;

                dayIconIn = $("<img class='day-icon'>").attr(
                    `src`,
                    `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`
                );

                var dayTwo = $("<div class='col col-five-jg'>");

                var cardColumns = $("<card-column column>");

                var divCard = $("<div class='card card-jg'>");

                var divCardBody = $("<div class='card-body card-body-jg shadow p-3 mb-5 rounded'>");

                var dayDate = $("<h6 class='row-city card-title'>");
                dayDate.text(formattedDate);

                var dayTemp = $("<p class='box card-text'>");
                dayTemp.text(`Temp: ${response.daily[i].temp.day} F`);

                var dayHumidity = $("<p class='box card-text'>");
                dayHumidity.text(`Humidity: ${response.daily[i].humidity} %`);

                divCardBody.append(dayDate, dayIconIn, dayTemp, dayHumidity);
                divCard.append(divCardBody);
                cardColumns.append(divCard);
                dayTwo.append(cardColumns)
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
        var currWrapper = $("<div class='curr-wrapper'>");
        var divCity = $("<div class='htwo'>").html(`<span>${currCity}</span> ${currDate}`);
        var currIconIn = $("<img class='img-main'>").attr("src", "http://openweathermap.org/img/wn/" + currIcon + "@2x.png");
        var divTemp = $("<div class='curr'>").text(`Temperature: ${temp} F`);
        var divHumidity = $("<div class='curr'>").text(`Humidity: ${humidity}%`);
        var divWind = $("<div class='curr'>").text(`Wind Speed: ${wind} MPH`);
        var divUV = $("<div class='curr divUV'>").text("UV Index: ")
        var uv = $("<span class='uvi'>").text(`${uvIndex}`);
        $(currWrapper).append(divCity, currIconIn, divTemp, divHumidity, divWind, divUV, uv);
        $("#city-weather-jg").append(currWrapper);

        //UV Color background
        console.log(uvColor);
        if (uvColor <= 2) {
            uv.attr("class", "green uv");
        } else if ((uvColor = 3 && uvColor <= 5)) {
            uv.attr("class", "yellow uv");
        } else if ((uvColor = 6 && uvColor <= 7)) {
            uv.attr("class", "orange uv");
        } else if ((uvColor = 8 && uvColor <= 10)) {
            uv.attr("class", "red uv");
        } else if (uvColor >= 11) {
            uv.attr("class", "violet uv");
        }


    }
});