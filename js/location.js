export const openMeteoURL = [
    {
      city: "Guayaquil",
      URLChart1 : "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&current=temperature_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto",
      URLChart2 : "https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=apparent_temperature,precipitation_probability&timezone=auto"
    },
    {
      city: "Machala",
      URLChart1 : "https://api.open-meteo.com/v1/forecast?latitude=-3.2586&longitude=-79.9605&current=temperature_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto",
      URLChart2 : "https://api.open-meteo.com/v1/forecast?latitude=-3.2586&longitude=-79.9605&hourly=apparent_temperature,precipitation_probability&timezone=auto"
    },
    {
      city: "Quito",
      URLChart1 : "https://api.open-meteo.com/v1/forecast?latitude=-0.2298&longitude=-78.525&current=temperature_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto",
      URLChart2 : "https://api.open-meteo.com/v1/forecast?latitude=-0.2298&longitude=-78.525&hourly=apparent_temperature,precipitation_probability&timezone=auto"
    }
  ]
  
  export const weatherCategories = [
      {
        codeRange: [0, 19],
        description: "Claro",
        icon: "<i class='fas fa-sun text-warning fa-3x'></i>",
      },
      {
        codeRange: [20, 29],
        description: "Nublado",
        icon: "<i class='fas fa-cloud text-secondary fa-3x'></i>",
      },
      {
        codeRange: [30, 39],
        description: "Tormentas",
        icon: "<i class='fas fa-wind text-brown fa-3x'></i>",
      },
      {
        codeRange: [40, 49],
        description: "Neblina",
        icon: "<i class='fas fa-smog text-muted fa-3x'></i>",
      },
      {
        codeRange: [50, 59],
        description: "Llovizna",
        icon: "<i class='fas fa-cloud-showers-heavy text-lightblue fa-3x'></i>",
      },
      {
        codeRange: [60, 69],
        description: "Lluvia",
        icon: "<i class='fas fa-cloud-rain text-primary fa-3x'></i>",
      },
      {
        codeRange: [70, 79],
        description: "Nieve",
        icon: "<i class='fas fa-snowflake text-lightblue fa-3x'></i>",
      },
      {
        codeRange: [80, 89],
        description: "Chubascos",
        icon: "<i class='fas fa-bolt text-warning fa-3x'></i>",
      },
      {
        codeRange: [90, 99],
        description: "Tormentas Fuertes",
        icon: "<i class='fas fa-bolt text-danger fa-3x'></i>",
      },
    ];
  