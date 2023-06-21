import './css/App.css';
import './css/Fonts.css';
import './css/Texture.css'
import React, { useState, useEffect } from 'react';

import Socket from './CAN-subscriber.js'
import TemperatureGauge from './components/temperature.js';
import Speedometer from './components/speedometer.js'
import DateTime from './components/date-time.js';
import RadialBar from './components/radial-progress';
import ValueBox from './components/valuebox'
import SoC from './components/soc';

import motorIcon from './images/motor.png';
import mosfetIcon from './images/mosfet.jpg';
import batteryIcon from './images/battery.png';
import vescIcon from './images/VESC-Project_Logo_small.png'

function App() {

    const [data, setData] = useState({})
    const [config, setConfig] = useState({})

    // Connect and recieve CAN data from socket
    // NOTE: this is inefficient. 
    // It updates the data state, which refreshes ALL gui elements.
    // Ideally, only the elements that change should be updated.
    // This would require a major rewrite, where each component
    // is specialized and has a socket connection within the
    // component specifically for its data crumb
    useEffect(() => {
        const socket = new Socket(5002)

        socket.getSocket().on('data', (canData) => {
            setData(canData)
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    const max_speed = 50;
    const capacity_ah = 16;
    const soc = (capacity_ah - data.ah_consumed) / capacity_ah

    return (
        <div className="center-screen">
            <div className="viewport bg-texture-0 flex-container">
                <div className='viewport-overlay' />
                <label className="background">Moped Guage App</label>

                {/* Uncomment this for full CANbus debug information */}
                {/* {Object.entries(data).map(([key, value]) => <label key={key} className='rawtext'>{key} = {Math.trunc(value * 100) / 100}</label>)} */}

                <TemperatureGauge value={data.mot_temp} className="motor-temp flex-center" min={0} max={100} ticks={5} size={200} />
                <TemperatureGauge value={data.mos_temp} className="mosfet-temp flex-center" min={0} max={100} ticks={5} size={200} />

                <Speedometer value={Math.abs(data.mph)} className="speedometer center-gauge" title="" min={0} max={max_speed} ticks={11} size={550} />
                <ValueBox className={'mph-label'} value='mph' />

                <DateTime className="clock-new font-face-dot" fontsize={40} width={250} justify={'center'} />

                <ValueBox className="voltmeter font-face-segment" value={data.battery_voltage} units='V' decimals={1} fontsize={60} width={210} justify={'right'} />
                <ValueBox className="speed-ro center-gauge font-face-segment" value={data.mph} fontsize={100} width={250} justify={'right'} />
                <ValueBox className="speed-ro-bg center-gauge font-face-segment" value={'~~~'} fontsize={100} width={250} justify={'right'} />

                <ValueBox className="odometer font-face-dot" value={data.odometer} fontsize={30} decimals={2} units="MI" width={250} justify={'right'} />

                <img src={motorIcon} id="motor-icon" alt="motor temp icon" />
                <img src={mosfetIcon} id="mosfet-icon" alt="mosfet temp icon" />
                <img src={batteryIcon} id="battery-icon" alt="battery icon" />
                <img src={vescIcon} id="vesc-icon" alt="vesc icon" />

                <RadialBar className="center-gauge" value={data.motor_current} units='A' primaryColor={['lightcoral', 'plum']} secondaryColor={['palegreen', 'seagreen']} max={150} radius={615} strokeWidth={20} start={.6} end={.9} tx='20%' ty='6%' showValue={true} />
                <RadialBar className="center-gauge" value={data.battery_current} units='A' primaryColor={['khaki', 'orange']} secondaryColor={['palegreen', 'seagreen']} max={80} radius={700} strokeWidth={30} start={.63} end={.87} tx='12%' ty='11.5%' showValue={true} />

                <RadialBar className="center-gauge" mirror={true} value={data.motor_voltage} units='V' primaryColor={['lightcoral', 'plum']} secondaryColor1={['palegreen', 'seagreen']} max={58.8} radius={615} strokeWidth={20} start={.6} end={.9} tx='20%' ty='6%' showValue={true} />
                <RadialBar className="center-gauge" mirror={true} value={data.battery_voltage} units='V' primaryColor={['khaki', 'orange']} secondaryColor={['palegreen', 'seagreen']} min={40} max={58.8} radius={700} strokeWidth={30} start={.63} end={.87} tx='12%' ty='11.5%' showValue={true} />

                <SoC className="soc" value={soc} size={200} />

            </div>
        </div>
    );
}

export default App;