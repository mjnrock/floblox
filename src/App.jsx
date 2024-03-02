import { useRef } from "react";

import Stopwatch from "./apps/timer/Stopwatch.js";
import StopwatchComponent from "./apps/timer/components/Stopwatch.jsx";

export function App() {
	const stopwatch = useRef(Stopwatch.Factory());

	return (
		<div>
			<StopwatchComponent
				stopwatch={ stopwatch?.current }
			/>
		</div>
	);
}

export default App;