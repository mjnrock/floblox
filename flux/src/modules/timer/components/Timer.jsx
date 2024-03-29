import { useRef } from "react";
import { useFlux } from "../../../flux/hooks/useFlux";

export const Timer = ({ timer }) => {
	const flux = useFlux(timer);
	const elapsedTime = flux.useSelector(state => state.elapsedTime);
	const running = flux.useSelector(state => state.running);
	const loop = flux.useSelector(state => state.loop);
	const duration = flux.useSelector(state => state.duration);
	const counter = flux.useSelector(state => state.counter);

	let clearFn = useRef();

	const handleStartResume = () => {
		if(!running) {
			clearFn.current = timer.actions.start({ interval: 10 });
		}
	};
	const handlePause = () => timer.actions.pause(clearFn.current);
	const handleReset = () => timer.actions.reset();
	const handleToggleLoop = () => timer.actions.toggleLoop();

	return (
		<div>
			<h2>Timer: { elapsedTime }ms / { duration }ms [x{ counter }]</h2>
			<button onClick={ handleStartResume }>Start</button>
			<button onClick={ handlePause } disabled={ !running }>Pause</button>
			<button onClick={ handleReset }>Reset</button>
			<button onClick={ handleToggleLoop }>{ loop ? "Disable" : "Enable" } Loop</button>
		</div>
	);
};

export default Timer;