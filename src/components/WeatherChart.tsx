import { Chart } from "react-google-charts";
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

export default function WeatherChart({ selectedVariable, rows }) {
  let options = {
    title: `${selectedVariable} vs Hora`,
    curveType: "function",
    legend: { position: "right" },
  };

  const [data, setData] = useState([["Hora", "Precipitación", "Humedad", "Nubosidad"]]);

  useEffect(() => {
    let chartData = [["Hora", "Precipitación", "Humedad", "Nubosidad"]];
  
    if (selectedVariable === "Precipitación") {
      chartData = [
        ["Hora", selectedVariable],
        ...rows.map(row => [row.rangeHours, parseFloat(row.precipitation)])
      ];
    } else if (selectedVariable === "Humedad") {
      chartData = [
        ["Hora", selectedVariable],
        ...rows.map(row => [row.rangeHours, parseFloat(row.humidity)])
      ];
    } else if (selectedVariable === "Nubosidad") {
      chartData = [
        ["Hora", selectedVariable],
        ...rows.map(row => [row.rangeHours, parseFloat(row.cloudiness)])
      ];
    } else {
      // Si no se selecciona ninguna variable específica, mostrar todas por defecto
      chartData = [
        ["Hora", "Precipitación", "Humedad", "Nubosidad"],
        ...rows.map(row => [
          row.rangeHours,
          parseFloat(row.precipitation),
          parseFloat(row.humidity),
          parseFloat(row.cloudiness)
        ])
      ];
    }
  
    console.log("ChartData:", chartData); // Añade este console.log para depurar
  
    setData(chartData);
  }, [selectedVariable, rows]);
  

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 400,
      }}
    >
      <Chart
        chartType="LineChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    </Paper>
  );
}
