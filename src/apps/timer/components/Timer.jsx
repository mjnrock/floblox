import React, { useEffect } from "react";
import { useFlux } from "../../flux/hooks/useFlux";

export const useTimer = (timer, running) => {
	useEffect(() => {
		let interval;
		if(running) {
			interval = setInterval(() => {
				timer.dispatch({ type: "tick", data: 10 });
			}, 10);
		}

		return () => clearInterval(interval);
	}, [ running, timer ]);
};

export const Timer = ({ timer }) => {
	const flux = useFlux(timer);
	const elapsedTime = flux.useSelector(state => state.elapsedTime);
	const running = flux.useSelector(state => state.running);
	const loop = flux.useSelector(state => state.loop);
	const duration = flux.useSelector(state => state.duration);
	const counter = flux.useSelector(state => state.counter);

	useTimer(timer, running);

	const handleStartResume = () => {
		if(!running) {
			timer.dispatch(running ? { type: "pause" } : { type: "start" });
		}
	};

	const handlePause = () => timer.dispatch({ type: "pause" });
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