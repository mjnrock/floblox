import { useState } from "react";

import Stopwatch from "./apps/timer/Stopwatch.js";
import StopwatchComponent from "./apps/timer/components/Stopwatch.jsx";

export function App() {
	const [ stopwatch, setStopwatch ] = useState(Stopwatch.Factory(Stopwatch.State()));

	return (
		<div>
			<StopwatchComponent
				stopwatch={ stopwatch }
			/>
		</div>
	);
}

export default App;