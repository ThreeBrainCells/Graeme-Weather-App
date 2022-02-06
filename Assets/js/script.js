var getUserRepos = function () {
    var locationUrl = '';
    fetch(locationUrl)      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            getWeatherData(data);
          });
        }
      })

  };

var getWeatherData = function (){
    var weatherUrl=''
    fetch (weatherUrl).then(function(response){
         if(response.ok){
             console.log(response)
             response.json().then(function(data){
                 console.log(data)
                  displayWeatherData(data)
           })
       }
    })
}