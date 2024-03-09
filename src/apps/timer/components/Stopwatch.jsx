import { useEffect, useRef } from "react";
import { Actions } from "../Stopwatch";

import { useFlux } from "../../flux/hooks/useFlux";

export const useStopwatch = (stopwatch, running) => {
	useEffect(() => {
		const tickInterval = setInterval(() => {
			if(running) {
				stopwatch.dispatch({ type: "tick" });
			}
		}, 10);

		return () => clearInterval(tickInterval);
	}, [ running, stopwatch ]);
};


export const Stopwatch = ({ stopwatch }) => {
	const flux = useFlux(stopwatch);
	const time = flux.useSelector(state => state.time);
	const laps = flux.useSelector(state => state.laps);
	const running = flux.useSelector(state => state.running);

	const actions = useRef(Actions(stopwatch));
	const interval = useRef();

	const handleStart = () => {
		if(!running) {
			interval.current = actions.current.start({ interval: 10 });
		}
	};
	const handleStop = () => actions.current.stop(interval.current);
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