import { useRef } from "react";

import Stopwatch from "./apps/timer/Stopwatch.js";
import StopwatchComponent from "./apps/timer/components/Stopwatch.jsx";

import Timer from "./apps/timer/Timer.js";
import TimerComponent from "./apps/timer/components/Timer.jsx";

import Geolocation from "./apps/geolocation/Geolocation.js";
import GeolocationComponent from "./apps/geolocation/components/Geolocation.jsx";

import DeckOfCards from "./apps/random/DeckOfCards.js";
import DeckOfCardsComponent from "./apps/random/components/DeckOfCards.jsx";

import Dice from "./apps/random/Dice.js";
import DiceComponent from "./apps/random/components/Dice.jsx";

import WeightedDice from "./apps/random/WeightedDice.js";
import WeightedDiceComponent from "./apps/random/components/WeightedDice.jsx";

export function App() {
	const stopwatch = useRef(Stopwatch.Factory());
	const timer = useRef(Timer.Factory({
		duration: 2750,
		loop: true,
	}));
	const geo = useRef(Geolocation.Factory());
	const deck = useRef(DeckOfCards.Factory({
		seed: 2,
	}));
	const dice = useRef(Dice.Factory(6));
	const weightedDice = useRef(WeightedDice.Factory({
		sides: 6,
		weights: [ 1, 1 ],
	}));

	return (
		<div>
			<StopwatchComponent stopwatch={ stopwatch?.current } />
			<TimerComponent timer={ timer?.current } />
			<GeolocationComponent geo={ geo?.current } />
			<DeckOfCardsComponent deckOfCards={ deck?.current } />
			<DiceComponent dice={ dice?.current } />
			<WeightedDiceComponent weightedDice={ weightedDice?.current } />
		</div>
	);
}

export default App;