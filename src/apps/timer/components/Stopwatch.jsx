import React, { useEffect, useState } from "react";

export const Stopwatch = ({ stopwatch }) => {
	const [ time, setTime ] = useState(stopwatch.getState().time);
	const [ laps, setLaps ] = useState(stopwatch.getState().laps);

	useEffect(() => {
		const update = (state) => {
			setTime(state.time);
			setLaps(state.laps);
		};
		stopwatch.subscribe(update);

		const tickInterval = setInterval(() => {
			if(stopwatch.getState().running) {
				stopwatch.dispatch({ type: "tick" });
			}
		}, 10);

		return () => clearInterval(tickInterval);
	}, []);

	const handleStart = () => stopwatch.dispatch({ type: "start" });
	const handleStop = () => stopwatch.dispatch({ type: "stop" });
	const handleReset = () => stopwatch.dispatch({ type: "reset" });
	const handleLap = () => stopwatch.dispatch({ type: "lap" });

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