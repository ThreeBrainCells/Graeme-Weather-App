//GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
var APIKEY = '0055e6e7d4bc4244c147e7e0496cc226';

//grab user input(cityName) and creates an element with that name (and stores that name to local storage)
var cityName = 'Denver';
var cityNameArr=[];

function getCityName(){
    cityName=$('#city-name').val();
    cityNameArr.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cityNameArr));
    createCityBtn(cityName)
}

function createCityBtn(cityName){
  $('#city-buttons').append(`<button id="${cityName}">${cityName}</button>`);
  $(`#${cityName}`).addClass('cityBtn btn btn-secondary btn-lg btn-block');
  getLocationData(cityName);
}
//on page load, create city elements from local storage

function createStoredBtn(){
  if (localStorage.getItem("cities")===null){
    return
  }
  cityNameArr=JSON.parse(localStorage.getItem("cities"))
  for (let i = 0; i < cityNameArr.length; i++) {
    $('#city-buttons').append(`<button id="${cityNameArr[i]}">${cityNameArr[i]}</button>`);
    $(`#${cityNameArr[i]}`).addClass('cityBtn btn btn-secondary btn-lg btn-block')
  }
}

//returns city's lat and long then sends it to getWeatherData
var getLocationData = function () {
    var locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKEY}`;
    fetch(locationUrl).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            var latitude=data[0].lat
            var longitude=data[0].lon
            getWeatherData(latitude, longitude);
          });
        }
      })

  };

// compile weather data then send it to another function
var getWeatherData = function (latitude, longitude){
    var weatherUrl=`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIKEY}`
    fetch (weatherUrl).then(function(response){
         if(response.ok){
             console.log(response)
             response.json().then(function(data){
                 console.log(data)
                  displayWeatherData(data)
           })
       }
    })
};

//use weather data to create/fill in elements in html with the city name, the date, 
//an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

function displayWeatherData(data){
  var date = moment().format('M/DD/YYYY')
  $('#current-day').children('.card-header').html(`${cityName}(${date})${data.current.weather[0].icon}`)
  $('#current-day').children('.temp').html(`Temp:${data.current.temp}`)
  $('#current-day').children('.wind').html(`Wind:${data.current.wind_speed}`)
  $('#current-day').children('.humid').html(`Humidity:${data.current.humidity}`)
  $('#current-day').children('.uv-index').html(`UV Index: ${data.current.uvi}`)
}

// $('#searchBtn').on('click', getCityName());
//make every city element a clickable button that triggers getLocationData()
$('.cityBtn').on('click', getLocationData(this.textContent))

getLocationData()
//(this is just for testing)
