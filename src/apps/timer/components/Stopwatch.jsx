import { useRef } from "react";
import { Actions } from "../Stopwatch";

import { useFlux } from "../../flux/hooks/useFlux";


export const Stopwatch = ({ stopwatch }) => {
	const flux = useFlux(stopwatch);
	const time = flux.useSelector(state => state.time);
	const laps = flux.useSelector(state => state.laps);
	const running = flux.useSelector(state => state.running);

	const actions = Actions(stopwatch);
	const clearFn = useRef();

	const handleStart = () => {
		if(!running) {
			clearFn.current = actions.start({ interval: 10 });
		}
	};
	const handleStop = () => actions.stop(clearFn.current);
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