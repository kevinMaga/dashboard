import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';
import { Container, Paper, Typography, AppBar, Toolbar } from '@mui/material';
import './App.css';

function App() {
  let [rowsTable, setRowsTable] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState("");

  useEffect(() => {
    (async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");
      let nowTime = new Date().getTime();

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        let API_KEY = "e4ebd4104ffa941a2d5027a4d709aa33";
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`);
        savedTextXML = await response.text();

        let hours = 1;
        let delay = hours * 3600000;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", (nowTime + delay).toString());
      }

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");
      let dataToIndicators = [];

      let location = xml.getElementsByTagName("location")[1];
      let geobaseid = location.getAttribute("geobaseid");
      dataToIndicators.push(["Location", "geobaseid", geobaseid]);

      let latitude = location.getAttribute("latitude");
      dataToIndicators.push(["Location", "Latitude", latitude]);

      let longitude = location.getAttribute("longitude");
      dataToIndicators.push(["Location", "Longitude", longitude]);

      let indicatorsElements = dataToIndicators.map(
        (element, index) => <Indicator key={index} title={element[0]} subtitle={element[1]} value={element[2]} />
      );

      setIndicators(indicatorsElements);

      let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {
        let rangeHours = timeElement.getAttribute("from").split("T")[1] + " - " + timeElement.getAttribute("to").split("T")[1];
        let precipitation = timeElement.getElementsByTagName("precipitation")[0].getAttribute("probability");
        let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " " + timeElement.getElementsByTagName("windDirection")[0].getAttribute("code");
        let temperature = timeElement.getElementsByTagName("temperature")[0].getAttribute("unit") + " " + timeElement.getElementsByTagName("temperature")[0].getAttribute("value");
        let humidity = timeElement.getElementsByTagName("humidity")[0].getAttribute("value") + " " + timeElement.getElementsByTagName("humidity")[0].getAttribute("unit");

        return { "rangeHours": rangeHours, "windDirection": windDirection, "precipitation": precipitation, "temperature": temperature, "humidity": humidity };
      });

      arrayObjects = arrayObjects.slice(0, 8);
      setRowsTable(arrayObjects);
    })();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h2" component="div">
            Dashboard de Datos
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>

          <Grid container spacing={5}>
            {indicators.map((indicator, index) => (
              <Grid xs={6} lg={2} key={index}>
                {indicator}
              </Grid>
            ))}
            <Grid xs={6} md={4} lg={2}>
              <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} />
            </Grid>
            <Grid xs={6} sm={4} md={3} lg={2}>
              <Summary />
            </Grid>
            <Grid xs={12} lg={10}>
              <WeatherChart selectedVariable={selectedVariable} rows={rowsTable} />
            </Grid>
            <Grid xs={12} lg={2}>
              <ControlPanel setValorActual={setSelectedVariable} />
            </Grid>
            <Grid xs={12} lg={8}>
              <BasicTable rows={rowsTable} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default App;
