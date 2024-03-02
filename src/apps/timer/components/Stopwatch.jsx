import React, { useEffect, useState } from 'react';
import { Factory, State } from "../Stopwatch.js"

const fluxStopwatch = Factory(State());

console.log(fluxStopwatch);

export const Stopwatch = () => {
	const [ time, setTime ] = useState(fluxStopwatch.getState().time);
	const [ laps, setLaps ] = useState(fluxStopwatch.getState().laps);

	useEffect(() => {
		// Subscribe to state changes
		const update = (state) => {
			setTime(state.time);
			setLaps(state.laps);
		};
		fluxStopwatch.subscribe(update);

		// Set up the interval for the 'tick' action if the stopwatch is running
		const tickInterval = setInterval(() => {
			if(fluxStopwatch.getState().running) {
				fluxStopwatch.dispatch({ type: 'tick' });
			}
		}, 10); // Update every 10 milliseconds for demonstration

		return () => clearInterval(tickInterval); // Cleanup on component unmount
	}, []);

	const handleStart = () => fluxStopwatch.dispatch({ type: 'start' });
	const handleStop = () => fluxStopwatch.dispatch({ type: 'stop' });
	const handleReset = () => fluxStopwatch.dispatch({ type: 'reset' });
	const handleLap = () => fluxStopwatch.dispatch({ type: 'lap' });

	return (
		<div>
			<h2>Stopwatch: { time }ms</h2>
			<button onClick={ handleStart }>Start</button>
			<button onClick={ handleStop }>Stop</button>
			<button onClick={ handleReset }>Reset</button>
			<button onClick={ handleLap }>Lap</button>
			<h3>Laps:</h3>
			<ul>
				{ laps.map((lap, index) => (
					<li key={ index }>{ lap }ms</li>
				)) }
			</ul>
		</div>
	);
};

export default Stopwatch;