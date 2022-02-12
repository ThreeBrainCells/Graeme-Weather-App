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
  if (!$('#city-name').val()){
    console.log('There was nothing in the array');
    return
  }
    // console.log($('#city-name').val());
    cityName=$('#city-name').val();
    console.log(cityName)
    cityNameArr.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cityNameArr));
    createCityBtn(cityName)
}

function createCityBtn(cityName){
  console.log(cityName)
  var newBtnDiv = $('#city-buttons')
  var newBtn = $('<button></button>')
  newBtn.attr('id', cityName);
  newBtn.text(cityName)
  newBtn.addClass('cityBtn btn btn-secondary btn-lg btn-block');
  newBtnDiv.append(newBtn)
  getLocationData(cityName);
}
//on page load, create city elements from local storage

function createStoredBtn(){
  if (localStorage.getItem("cities")===null){
    return
  }
  cityNameArr=JSON.parse(localStorage.getItem("cities"))
  for (let i = 0; i < cityNameArr.length; i++) {
    // $('#city-buttons').append(`<button id="${cityNameArr[i]}">${cityNameArr[i]}</button>`);
    // $(`#${cityNameArr[i]}`).addClass('cityBtn btn btn-secondary btn-lg btn-block')
    var newBtnDiv = $('#city-buttons')
    var newBtn = $('<button></button>')
    newBtn.attr('id', cityNameArr[i]);
    newBtn.text(cityNameArr[i])
    newBtn.addClass('cityBtn btn btn-secondary btn-lg btn-block');
    newBtnDiv.append(newBtn)
  }
}

//returns city's lat and long then sends it to getWeatherData
var getLocationData = function (cityName) {
    var locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKEY}`;
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
  var date = moment().format('MMM/Do/YYYY').toString()
  $('#current-day').children('.card-header').html(`${cityName}(${date})`)
  $('#current-day').children('.icon').attr("src",`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`)
  $('#current-day').children('ul').children('.temp').html(`Temp: ${data.current.temp}`)
  $('#current-day').children('ul').children('.wind').html(`Wind: ${data.current.wind_speed} mph`)
  $('#current-day').children('ul').children('.humid').html(`Humidity: ${data.current.humidity}`)
  $('#current-day').children('ul').children('.uv-index').html(`UV Index: ${data.current.uvi}`)

  //Now to do the same for the forecast cards
  $('.forecast-card').each(function(i){
    var UTC = data.daily[i+1].dt*1000;
    var forecastDay = moment.utc(UTC).format('dddd');
    $('.forecast-card').children('.card-header').eq(i).html(`${forecastDay}`)
    $('.forecast-card').children('ul').children('.icon').eq(i).attr("src",`http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`)
    $('.forecast-card').children('ul').children('.temp').eq(i).html(`Temp: ${data.daily[i].temp.day}`)
    $('.forecast-card').children('ul').children('.wind').eq(i).html(`Wind: ${data.daily[i].wind_speed} mph`)
    $('.forecast-card').children('ul').children('.humid').eq(i).html(`Humidity: ${data.daily[i].humidity}`)
  })
}

$('#search-button').on('click', function(){
  console.log('this works')
  getCityName()
});
//make every city element a clickable button that triggers getLocationData()
$('#city-buttons').on('click', $('.cityBtn'), function(event){
  console.log('this button works')
  if (event.target.classList.contains('cityBtn')){
      cityName=event.target.textContent
  getLocationData(cityName)
  }

})

getLocationData()
//(this is just for testing)
createStoredBtn()
