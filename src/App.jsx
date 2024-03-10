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
	body {
		${ tw`text-center` }
	}
	h2 {
		${ tw`text-2xl font-bold` }
	}
	button {
		${ tw`bg-emerald-500 border-emerald-100 border border-solid  m-1 text-white py-4 px-8 rounded cursor-pointer` }

		&:hover {
			${ tw`bg-emerald-600 border-emerald-200` }
		}

		&:active {
			${ tw`bg-emerald-700 border-emerald-300` }
		}
	}
	input {
		${ tw`text-neutral-700 p-1 m-1 rounded` }
	}
`;

export function App() {
	/* Create an instance of each module */
	const stopwatch = useRef(Stopwatch.Factory());
	const timer = useRef(Timer.Factory({
		duration: 2750,
		loop: true,
	}));
	const geo = useRef(Geolocation.Factory());
	const deck = useRef(DeckOfCards.Factory({
		seed: 2,
	}));
	const dice = useRef(Dice.Factory({
		sides: 5,
	}));
	const weightedDice = useRef(WeightedDice.Factory({
		weights: [ 1, 1 ],
	}));

	/* Convenience wrapper since we're using the same pattern for each module */
	const modules = [
		[ StopwatchComponent, { stopwatch: stopwatch?.current } ],
		[ TimerComponent, { timer: timer?.current } ],
		[ GeolocationComponent, { geo: geo?.current } ],
		[ DeckOfCardsComponent, { deckOfCards: deck?.current } ],
		[ DiceComponent, { dice: dice?.current } ],
		[ WeightedDiceComponent, { weightedDice: weightedDice?.current } ],
	];

	return (
		<>
			<GlobalStyle />
			<div
				className="flex flex-col items-center justify-center w-screen bg-gray-800 text-white font-mono text-lg gap-2 p-2"
			>
				{
					modules.map(([ Component, props ], index) => (
						<div className="w-full flex flex-row items-center justify-center space-x-4 border border-solid border-white p-4 rounded">
							<Component key={ index } { ...props } />
						</div>
					))
				}
			</div>
		</>
	);
}

export default App;