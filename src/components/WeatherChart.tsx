import { Chart } from "react-google-charts";
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";

export default function WeatherChart({ selectedVariable }) {
    const [values, setValues] = useState([["Hora", "Precipitación", "Humedad", "Nubosidad"]]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-2.1962&longitude=-79.8862&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,cloud_cover,visibility,uv_index,sunshine_duration,windspeed_1000hPa,winddirection_1000hPa&daily=temperature_2m_max,temperature_2m_min,uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1');
                const data = await response.json();

                const times = data.hourly.time;
                const precipitation = data.hourly.precipitation_probability;
                const humidity = data.hourly.relative_humidity_2m;
                const cloudCover = data.hourly.cloud_cover;

                const formattedData = times.map((time, index) => {
                    const hora = new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                    return [hora, precipitation[index], humidity[index], cloudCover[index]];
                });

                setValues([["Hora", "Precipitación", "Humedad", "Nubosidad"], ...formattedData]);
            } catch (error) {
                console.error('Error fetching the data', error);
            }
        }

        fetchData();
    }, []);

    const filteredData = () => {
        if (selectedVariable === -1) return values;
        const variableIndex = selectedVariable + 1; 
        return values.map(row => row.filter((_, index) => index === 0 || index === variableIndex));
    };

    const options = {
        title: "Precipitación, Humedad y Nubosidad vs Hora",
        curveType: "function",
        legend: { position: "right" },
    }

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Chart
                chartType="LineChart"
                data={filteredData()}
                width="100%"
                height="400px"
                options={options}
            />
        </Paper>
    );
}