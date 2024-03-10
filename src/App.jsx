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

import { createGlobalStyle } from "styled-components";
import tw from "twin.macro";

const GlobalStyle = createGlobalStyle`
button {
  ${ tw`bg-emerald-500 border-emerald-100 border text-white py-4 px-8 rounded` }
}
`;

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
		<>
			<GlobalStyle />
			<div
				className="flex flex-col items-center justify-center w-screen bg-gray-800 text-white font-mono text-lg gap-2 p-2"
			>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<StopwatchComponent stopwatch={ stopwatch?.current } />
				</div>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<TimerComponent timer={ timer?.current } />
				</div>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<GeolocationComponent geo={ geo?.current } />
				</div>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<DeckOfCardsComponent deckOfCards={ deck?.current } />
				</div>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<DiceComponent dice={ dice?.current } />
				</div>
				<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
					<WeightedDiceComponent weightedDice={ weightedDice?.current } />
				</div>
			</div>
		</>
	);
}

export default App;