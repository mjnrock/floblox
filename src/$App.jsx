import { useRef } from "react";

import Timer from "./modules/timer/Timer.js";
import { Node, orchestrate } from "./$Orchestrator.js";

import TimerComponent from "./modules/timer/components/Timer.jsx";

const App = () => {
	const timer1 = useRef(new Node(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));
	const timer2 = useRef(new Node(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));
	const timer3 = useRef(new Node(Timer.Factory, Timer.Actions, { duration: 500, loop: false }));

	/* [[ relationship, cleanupEffect ]] */
	const orchestration = useRef(orchestrate([
		[ "complete", timer1.current, "restart", timer2.current ],
		[ "complete", timer2.current, "restart", timer3.current ],
		[ "complete", timer3.current, "restart", timer1.current ],
	]));

	return (
		<div>
			<TimerComponent timer={ timer1?.current?.module } />
			<TimerComponent timer={ timer2?.current?.module } />
			<TimerComponent timer={ timer3?.current?.module } />
		</div>
	);
};

export default App;