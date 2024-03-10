import { useEffect, useRef } from "react";

import Timer from "./modules/timer/Timer.js";
import { Node, orchestrate } from "./$Orchestrator.js";

import TimerComponent from "./modules/timer/components/Timer.jsx";

const App = () => {
	const timer1 = useRef(Node.New(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));
	const timer2 = useRef(Node.New(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));
	const timer3 = useRef(Node.New(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));

	useEffect(() => {
		const orchestration = orchestrate([
			{
				from: [ timer1.current, "complete" ],
				to: [ timer2.current, "restart" ],
				iff: (from, to) => Math.random() > 0.5,
			},
			{
				from: [ timer2.current, "complete" ],
				to: [ timer3.current, "restart" ],
				iff: (from, to) => Math.random() > 0.5,
			},
			{
				from: [ timer3.current, "complete" ],
				to: [ timer1.current, "restart" ],
				iff: (from, to) => Math.random() > 0.5,
			},
		]);

		return () => {
			orchestration.forEach(cleanupEffect => cleanupEffect());
		};
	}, []);

	return (
		<div>
			<TimerComponent timer={ timer1?.current?.module } />
			<TimerComponent timer={ timer2?.current?.module } />
			<TimerComponent timer={ timer3?.current?.module } />
		</div>
	);
};

export default App;