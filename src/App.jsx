import { useRef } from "react";

import Stopwatch from "./modules/timer/Stopwatch.js";
import StopwatchComponent from "./modules/timer/components/Stopwatch.jsx";

import Timer from "./modules/timer/Timer.js";
import TimerComponent from "./modules/timer/components/Timer.jsx";

import Geolocation from "./modules/geolocation/Geolocation.js";
import GeolocationComponent from "./modules/geolocation/components/Geolocation.jsx";

import DeckOfCards from "./modules/random/DeckOfCards.js";
import DeckOfCardsComponent from "./modules/random/components/DeckOfCards.jsx";

import Dice from "./modules/random/Dice.js";
import DiceComponent from "./modules/random/components/Dice.jsx";

import WeightedDice from "./modules/random/WeightedDice.js";
import WeightedDiceComponent from "./modules/random/components/WeightedDice.jsx";

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