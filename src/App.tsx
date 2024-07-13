import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import BasicTable from './components/BasicTable';
import Componente from './components/Componente';
import Card from './components/Card'; // Importa el nuevo componente Card
import { useEffect, useState } from 'react';
import { Container, Paper, Typography, AppBar, Toolbar, CssBaseline } from '@mui/material';
import './App.css';
import locationImage from './assets/location.png';
import temperatureImage from './assets/temperature.png';
import windImage from './assets/wind.png';
import infoImage from './assets/info.png';
import guayaquilImage from './assets/Guayaquil.png'; // Asegúrate de tener estas imágenes en tu proyecto
import machalaImage from './assets/Machala.png';
import quitoImage from './assets/Quito.png';
// Kevin Magallanes
function App() {
  const [indicators, setIndicators] = useState<JSX.Element[]>([]);
  const [rowsTable, setRowsTable] = useState<{ time: string; uv: number; windSpeed: string; temperature: string; }[]>([]);
  const [selectedCity, setSelectedCity] = useState('Quito');

  useEffect(() => {
    (async () => {
      let API_KEY = "e4ebd4104ffa941a2d5027a4d709aa33";
      let responseOpenWeather = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&mode=xml&appid=${API_KEY}`);
      let savedTextXML = await responseOpenWeather.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      let responseOpenMeteo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,cloud_cover,visibility,uv_index,sunshine_duration,windspeed_1000hPa,winddirection_1000hPa&daily=temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`);
      let dataJson = await responseOpenMeteo.json();

      let dataToIndicators = new Array();

      let location = xml.getElementsByTagName("location")[1];
      if (location) {
        let geobaseid = location.getAttribute("geobaseid");
        let latitude = location.getAttribute("latitude");
        let longitude = location.getAttribute("longitude");

        let temperatureTag = xml.getElementsByTagName("temperature");
        if (temperatureTag.length > 0) {
          let temp_max = Number(temperatureTag[0].getAttribute("max"));
          let temp_min = Number(temperatureTag[0].getAttribute("min"));
          let temp_prom = (temp_max + temp_min) / 2;

          let windDirectionTag = xml.getElementsByTagName("windDirection");
          if (windDirectionTag.length > 0) {
            let WindDirection = windDirectionTag[0].getAttribute("deg") + "° (" + windDirectionTag[0].getAttribute("code") + ")";
            let windSpeedTag = xml.getElementsByTagName("windSpeed");
            if (windSpeedTag.length > 0) {
              let windSpeed = windSpeedTag[0].getAttribute("mps") + windSpeedTag[0].getAttribute("unit") + " (" + windSpeedTag[0].getAttribute("name") + ")";
              let windGustTag = xml.getElementsByTagName("windGust");
              if (windGustTag.length > 0) {
                let windGust = windGustTag[0].getAttribute("gust") + windGustTag[0].getAttribute("unit");

                let cityName = xml.getElementsByTagName("name")[0]?.textContent;
                let country = xml.getElementsByTagName("country")[0]?.textContent;
                let timezoneTag = xml.getElementsByTagName("timezone")[0]?.textContent;
                let timezone = Number(timezoneTag) / 3600;

                dataToIndicators.push(["Temperatura", "Max: " + temp_max + "°C", "Min: " + temp_min + "°C", "Avg: " + Math.round(temp_prom) + "°C", temperatureImage]);
                dataToIndicators.push(["Viento", "Direction: " + WindDirection, "Speed: " + windSpeed, "Gust: " + windGust, windImage]);
                dataToIndicators.push(["Localición", "Latitude: " + latitude, "Longitude: " + longitude, "Geobase: " + geobaseid, locationImage]);
                dataToIndicators.push(["Información", "City: " + cityName, "Country: " + country, "Time zone: " + "UTC" + timezone, infoImage]);

                let indicatorsElements = Array.from(dataToIndicators).map(
                  (element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} value2={element[3]} image={element[4]} />
                );

                let hourlyData = dataJson.hourly;

                let mappedData = hourlyData.time.map((time: string, index: number) => {
                  return {
                    "time": time.split("T")[1],
                    "windSpeed": hourlyData.windspeed_1000hPa[index] + " " + "km/h",
                    "uv": hourlyData.uv_index[index],
                    "temperature": hourlyData.temperature_2m[index] + " " + "°C"
                  };
                });

                setRowsTable(mappedData);
                setIndicators(indicatorsElements);
              }
            }
          }
        }
      }
    })();
  }, [selectedCity]);

  return (
    <>
      <CssBaseline />
      <AppBar position="static" style={{ backgroundColor: '#4fb53f', borderRadius: '20px'}}>
        <Toolbar>
          <Typography variant="h2" component="div" style={{ color: '#ffffff' }}>
            Dashboard de Datos
          </Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fbfacc', borderRadius: '10px' }}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid xs={12} md={6} lg={3}>
              <Card title="Guayaquil" image={guayaquilImage} onClick={() => setSelectedCity('Guayaquil')} />
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              <Card title="Machala" image={machalaImage} onClick={() => setSelectedCity('Machala')} />
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              <Card title="Quito" image={quitoImage} onClick={() => setSelectedCity('Quito')} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Container maxWidth="xl" style={{ marginTop: '30px' }}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#fbfacc', borderRadius: '10px' }}>
          <Grid container spacing={5}>
            <Grid xs={12} md={6} lg={3}>
              {indicators[3]}
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              {indicators[0]}
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              {indicators[1]}
            </Grid>
            <Grid xs={12} md={6} lg={3}>
              {indicators[2]}
            </Grid>
            <Grid xs={12}>
              <Componente />
            </Grid>
            <Grid xs={12}>
              <BasicTable rows={rowsTable} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default App;
