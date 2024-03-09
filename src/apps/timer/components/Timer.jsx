import { useRef } from "react";
import { useFlux } from "../../flux/hooks/useFlux";

import { Actions } from "../Timer";

export const Timer = ({ timer }) => {
	const flux = useFlux(timer);
	const elapsedTime = flux.useSelector(state => state.elapsedTime);
	const running = flux.useSelector(state => state.running);
	const loop = flux.useSelector(state => state.loop);
	const duration = flux.useSelector(state => state.duration);
	const counter = flux.useSelector(state => state.counter);

	const actions = useRef(Actions(timer));
	const interval = useRef();

	const handleStartResume = () => {
		if(!running) {
			interval.current = actions.current.start({ interval: 10 });
		}
	};
	const handlePause = () => actions.current.pause(interval.current);
	const handleReset = () => timer.dispatch({ type: "reset" });
	const handleToggleLoop = () => timer.dispatch({ type: "toggleLoop" });

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