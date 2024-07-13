import { useState } from 'react';
import ControlPanel from './ControlPanel';
import WeatherChart from './WeatherChart';

export default function WeatherDashboard() {
    const [selectedVariable, setSelectedVariable] = useState(-1);

    return (
        <>
            <ControlPanel selectedVariable={selectedVariable} setSelectedVariable={setSelectedVariable} />
            <WeatherChart selectedVariable={selectedVariable} />
        </>
    );
}