import { weatherCategories, openMeteoURL } from "./location.js";

const selectedCity = document.querySelector(".active span").textContent;
// Graph
let cargarOpenMeteo = (URL,ChartID) => {
  //let URL =  "https://api.open-meteo.com/v1/dwd-icon?latitude=-2.1962&longitude=-79.8862&current=temperature_2m,weather_code&hourly=temperature_2m";

  fetch(URL)
    .then((responseText) => responseText.json())
    .then((responseJSON) => {
   /*   //Short-statistics
      let temperature = responseJSON.current.temperature_2m;
      let longitude = responseJSON.longitude;
      let latitude = responseJSON.latitude;
      let weather_code = responseJSON.current.weather_code;
      let weatherInfo = loadWeatherCode(weather_code);

      document.querySelector(".temperature h3").textContent = temperature;
      document.querySelector(".longitude h3").textContent = longitude;
      document.querySelector(".latitude h3").textContent = latitude;
      document.querySelector(".clima_WMO-icon").innerHTML = weatherInfo.icon;
      document.querySelector(".clima_WMO h3").textContent =
        weatherInfo.description;
*/
      //Chart
      let chartRef = document.getElementById(ChartID);
      let hourlyTime = responseJSON.hourly.time;
      let labels = [];
      hourlyTime.forEach((time) => {
        let date = time.slice(5, 10);
        labels.push(date);
      });

     /* let data = responseJSON.hourly.temperature_2m;
      console.log("elemento "+ data )*/
     let data = []
     let keys=[]
     let colorsLine = ["#007bff","#00cc66","#ff3333","#ffd633"]
      let hourly = responseJSON.hourly;
      for (let key in hourly) {
        if (key !== "time") {
          keys.push(key)
          data.push(hourly[key]);
          console.log("elemento "+hourly[key] )
        }
      }

      
      let config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [/*
            {
              label: "Temperature [2m]",
              data: data,
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 4,
              pointBackgroundColor: "#007bff",
            },*/
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      };
      for (var i = 0; i < data.length; i++) {
        console.log("aaaaa", data[i]);
        config.data.datasets.push({
          
          label: keys[i],
          data: data[i],
          lineTension: 0,
          backgroundColor: "transparent",
          borderColor: colorsLine[i],
          borderWidth: 4,
          pointBackgroundColor: "#007bff",

        });
      }
      let chart1 = new Chart(chartRef, config);
    })
    .catch(console.error);
};


let loadWeatherCode = (code) => {
  const category = weatherCategories.find(
    (category) => code >= category.codeRange[0] && code <= category.codeRange[1]
  );

  if (category) {
    return {
      description: category.description,
      icon: category.icon,
    };
  } else {
    return {
      description: "error",
      icon: '<i class="fas fa-exclamation-triangle text-danger fa-3x"></i>',
    };
  }
};

let loadShortStatistics = (URL) => {

  fetch(URL)
    .then((responseText) => responseText.json())
    .then((responseJSON) => {
      //Short-statistics
      let temperature = responseJSON.current.temperature_2m;
      let longitude = responseJSON.longitude;
      let latitude = responseJSON.latitude;
      let weather_code = responseJSON.current.weather_code;
      let weatherInfo = loadWeatherCode(weather_code);

      document.querySelector(".temperature h3").textContent = temperature +"°C";
      document.querySelector(".longitude h3").textContent = longitude;
      document.querySelector(".latitude h3").textContent = latitude;
      document.querySelector(".clima_WMO-icon").innerHTML = weatherInfo.icon;
      document.querySelector(".clima_WMO h3").textContent =
        weatherInfo.description;
    })
    .catch(console.error);
};
let loadCharts = () =>{
  openMeteoURL.forEach(function (element){
    if (element.city == selectedCity){
      cargarOpenMeteo(element.URLChart1,"myChart1");
      cargarOpenMeteo(element.URLChart2,"myChart2");
      loadShortStatistics(element.URLChart1);
    }
  })
  
}
loadCharts();

let parseXML = (responseText, day) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(responseText, "application/xml");
  let forecastElement = document.querySelector("#forecastbody");
  forecastElement.innerHTML = "";
  let timeArr = xml.querySelectorAll("time");

  if(day == "boot"){
  let daySelect = document.querySelector(".day-select");

  daySelect.innerHTML = `<option value="boot" selected>Seleccione un dia</option>`;

  for (let i = 0; i < timeArr.length; i += 8) {
    let fromValue = timeArr[i].getAttribute("from").slice(5, 10);
    daySelect.innerHTML += `<option value="${fromValue}">${fromValue}</option>`;
  }
  }
  timeArr.forEach((time) => {
    console.log(time.getAttribute("from").includes(day))
    if (time.getAttribute("from").includes(day)) {
      let from = time.getAttribute("from").slice(-8);

      let humidity = time.querySelector("humidity").getAttribute("value");
      let windSpeed = time.querySelector("windSpeed").getAttribute("mps");
      let precipitation = time
        .querySelector("precipitation")
        .getAttribute("probability");
      let pressure = time.querySelector("pressure").getAttribute("value");
      let cloud = time.querySelector("clouds").getAttribute("all");

      let template = `
          <tr>
              <td>${from}</td>
              <td>${humidity}</td>
              <td>${windSpeed}</td>
              <td>${precipitation}</td>
              <td>${pressure}</td>
              <td>${cloud}</td>
          </tr>
      `;

      forecastElement.innerHTML += template;
    }
  });
};

let loadForecast = async (event) => {
  let day = event && event.target ? event.target.value : "boot";
  let cityStorage = localStorage.getItem(selectedCity);

  if (cityStorage == null) {
    try {
      //API key
      let APIkey = "d33cc0a95aca9c04cf35531de58b502d";
      let url = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${APIkey}`;
      let response = await fetch(url);
      let responseText = await response.text();
      await localStorage.setItem(selectedCity, responseText);
      await parseXML(responseText, day);
    } catch (error) {
      console.log(error);
    }
  } else {
    await parseXML(cityStorage, day);
  }
};

loadForecast();

let loadForecastByDay = () => {
  let selectElement = document.querySelector("select");
  selectElement.addEventListener("change", loadForecast);
};
loadForecastByDay()


function updateClock() {
  let UserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let formattedSeconds = seconds <= 9 ? `0${seconds}` : seconds;
  let formattedMinutes = seconds <= 9 ? `0${minutes}` : minutes;
  let formattedHours = seconds <= 9 ? `0${hour}` : hour;
  let clock = document.getElementById('hora_actual');
  clock.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  if (hour % 3 === 0 && minutes === 0 && seconds === 0) {
    updateData();
  }
}

let updateData = () => {
  localStorage.clear();
  let tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";
  let selectElement = document.querySelector(".day-select");
  selectElement.value = "boot";
};
setInterval(updateClock, 1000);
updateClock();


