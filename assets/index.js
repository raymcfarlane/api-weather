var city = $("#city-name");
var date = $("#date");
var temperature = $("#temp");

var cityArr = [];
var key = "0546b3fef081bff9f327303d5fb37097&units";


function returnUserWeather(lat, lon) {

    fetch("https://api.openweathermap.org/data/2.5/forecast/?lat=" + lat + "&lon=" + lon + "&appid=" + key + "=imperial&cnt=40")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            var datesArray = [];
            var dataArr = [];

            
            for (var i = 0; i < data.cnt; i++) {
                datesArray.push(dayjs(data.list[i].dt_txt).format("YYYY-MM-DD"))
            }

            
            var uniqueDatesArray = [...new Set(datesArray)];

            
            if (uniqueDatesArray.length === 5) {
                $("#fcst-day-5").attr("style", "display: none")
            }

            
            for (var i = 0; i < uniqueDatesArray.length; i++) {
                var dayData2 = data.list.filter(function (day) {
                    return day.dt_txt.includes(uniqueDatesArray[i])
                })
                dataArr.push(dayData2);
            }

            
            for (var i = 0; i < dataArr.length; i++) {
                $("#fcst-day-" + i).children(".day-header").text(dayjs(dataArr[i][0].dt_txt).format("ddd MMM DD, YYYY"));
                $("#fcst-day-" + i).children(".temp").text("Temperature: " + dataArr[i][0].main.temp);
                $("#fcst-day-" + i).children(".wind").text("Wind Speed: " + dataArr[i][0].wind.speed);
                $("#fcst-day-" + i).children(".humidity").text("Humidity: " + dataArr[i][0].main.humidity);
                $("#fcst-day-" + i).children(".icon").attr("src", "https://openweathermap.org/img/wn/" + dataArr[i][0].weather[0].icon + "@2x.png");
            }
        })
}


function createButtons() {
    $("#buttonList").text("");
    for (var i = 0; i < cityArr.length; i++) {
        var cityListEl = $("<button>").text(cityArr[i]).attr("class", "btn cityButton");
        localStorage.setItem("cities", JSON.stringify(cityArr));
        $("#buttonList").append(cityListEl);
    }
    $("#clearStorage").attr("style", "display: block");
}


$(function () {
    $("#buttonList").click(function (e) {
        userCity = e.target.innerHTML;
        searchCity(userCity);
    })

    if (localStorage.length === 0) {
        searchCity("Charlotte")
    } else {
        $("#clearStorage").attr("style", "display: block");
        var storedCities = JSON.parse(localStorage.getItem("cities"));

        
        searchCity(storedCities[storedCities.length - 1]);

        
        cityArr = JSON.parse(localStorage.getItem("cities"));

        
        for (var i = 0; i < storedCities.length; i++) {
            var buttonEl = $("<button>").text(storedCities[i]).attr("class", "btn cityButton");
            $("#buttonList").append(buttonEl);
        }
    }
})

$("#city-search-form").on("submit", handleCitySearch);

function handleCitySearch(e) {
    e.preventDefault();
    userCity = $("#city-input").val();

    
    if (userCity === "") {
        alert("Please enter a city!")
        return
    } else if (cityArr.includes(userCity)) {
        alert("That city already exists!")
        return
    }

    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=" + key)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            
            var userLat = data[0].lat;
            var userLon = data[0].lon;

          
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);

           
            cityArr.push(userCity);

            
            createButtons();
            returnUserWeather(userLat, userLon);
        })
        .catch(function (err) {
            alert("Please enter a valid name!");
        })
}


function searchCity(xCity) {
    userCity = xCity;
    city.text(userCity);
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=" + key)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            city.text(data[0].name + ", " + data[0].state + " - " + data[0].country);
            var userLat = data[0].lat;
            var userLon = data[0].lon;
            returnUserWeather(userLat, userLon);
        })
        .catch(function (err) {
            alert(err);
        })
}


$("#clearStorage").click(function () {
    cityArr = [];
    localStorage.clear();
    createButtons();
    $("#clearStorage").attr("style", "display: none");
})