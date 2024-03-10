import Flux from "../flux/Flux.js";

export const Helpers = {
	generateDeck: () => {
		const suits = [ "Clubs", "Diamonds", "Hearts", "Spades" ];
		const ranks = [ "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace" ];
		let deck = [];

		for(let suit of suits) {
			for(let rank of ranks) {
				deck.push({ rank, suit });
			}
		}

		return deck;
	},
	mulberry32: function (seed) {
		return function () {
			var t = seed += 0x6D2B79F5;
			t = Math.imul(t ^ t >>> 15, t | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 61);
			return ((t ^ t >>> 14) >>> 0) / 4294967296;
		}
	},
	shuffleArray: function (array, seed) {
		const rng = this.mulberry32(seed);
		for(let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(rng() * (i + 1));
			[ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
		}
	}
};

export const State = () => ({
	deck: Helpers.generateDeck(),
	dealtCards: [],
	discardedCards: [],
	remainingCards: 52,
});

export const Reducers = (helpers) => ({
	shuffle: (state, action) => {
		const combinedDeck = [ ...state.deck, ...state.dealtCards, ...state.discardedCards ];
		helpers.shuffleArray(combinedDeck, action.seed || Date.now());
		return {
			...state,
			deck: combinedDeck,
			dealtCards: [],
			discardedCards: [],
			remainingCards: combinedDeck.length,
		};
	},
	dealOneCard: (state) => {
		if(state.remainingCards === 0) {
			return state;
		}
		const dealtCard = state.deck.shift();
		return {
			...state,
			dealtCards: [ ...state.dealtCards, dealtCard ],
			remainingCards: state.remainingCards - 1,
		};
	},
	resetDeck: (state) => ({
		...state,
		deck: helpers.generateDeck(),
		dealtCards: [],
		discardedCards: [],
		remainingCards: 52,
	}),
	shuffleRemaining: (state, action) => {
		const combinedDeck = [ ...state.deck, ...state.discardedCards ];
		helpers.shuffleArray(combinedDeck, action.seed || Date.now());
		return {
			...state,
			deck: combinedDeck,
			discardedCards: [], // Clear discardedCards after they are shuffled back into the deck
			remainingCards: combinedDeck.length, // Update remainingCards count
		};
	},
	discard: (state) => {
		if(state.remainingCards === 0) {
			return state;
		}
		const discardedCard = state.deck.shift();
		return {
			...state,
			discardedCards: [ ...state.discardedCards, discardedCard ],
			remainingCards: state.remainingCards - 1,
		};
	},
});

export const Actions = (flux) => ({
	shuffle: (seed) => {
		flux.dispatch({ type: "shuffle", seed });
	},
	dealOneCard: () => {
		flux.dispatch({ type: "dealOneCard" });
	},
	resetDeck: () => {
		flux.dispatch({ type: "resetDeck" });
	},
	shuffleRemaining: (seed) => {
		flux.dispatch({ type: "shuffleRemaining", seed });
	},
	discard: () => {
		flux.dispatch({ type: "discard" });
	},
});

export const Factory = () => {
	const initialState = State();
	const reducers = Reducers(Helpers);
	const config = {
		state: initialState,
		reducers: reducers,
		effects: [],
	};

	return Flux.Factory(config);
};

export default {
	State,
	Reducers,
	Actions,
	Factory,
};