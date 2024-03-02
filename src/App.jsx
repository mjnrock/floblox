import { useRef } from "react";

import Stopwatch from "./apps/timer/Stopwatch.js";
import StopwatchComponent from "./apps/timer/components/Stopwatch.jsx";

import Timer from "./apps/timer/Timer.js";
import TimerComponent from "./apps/timer/components/Timer.jsx";

export function App() {
	const stopwatch = useRef(Stopwatch.Factory());
	const timer = useRef(Timer.Factory({ duration: 2750 }));

	return (
		<div>
			<StopwatchComponent stopwatch={ stopwatch?.current } />
			<TimerComponent timer={ timer?.current } />
		</div>
	);
}

export default App;