import Flux from "../../flux/Flux.js";
import DeckOfCards from "../../modules/random/DeckOfCards.js";

export const Helpers = {
	generateMultipleDecks: (numberOfDecks = 1, seed = 1) => {
		let decks = [];
		for(let i = 0; i < numberOfDecks; i++) {
			const { deck } = DeckOfCards.State({ seed });
			decks = decks.concat(deck);
		}
		DeckOfCards.Helpers.shuffleArray(decks, seed);
		return decks;
	}
};

export const State = ({ numberOfDecks = 1, seed = Date.now() } = {}) => ({
	decks: Helpers.generateMultipleDecks(numberOfDecks, seed),
	players: [],
	turns: [],
	currentTurn: 0,
	seed,
});

export const Reducers = (helpers) => ({
	shuffleDecks: (state, action) => {
		const newSeed = action.seed || state.seed;
		let combinedDecks = state.decks.flatMap(deck => deck);
		DeckOfCards.Helpers.shuffleArray(combinedDecks, newSeed);
		return {
			...state,
			decks: combinedDecks,
			seed: newSeed,
		};
	},
	addPlayer: (state, action) => {
		const newPlayer = {
			id: action.playerId,
			hand: [],
		};
		return {
			...state,
			players: [ ...state.players, newPlayer ],
		};
	},
	dealToPlayer: (state, action) => {
		if(state.decks.length === 0) return state;
		const { playerId, numberOfCards } = action;
		let deck = [ ...state.decks ];
		const playerIndex = state.players.findIndex(player => player.id === playerId);
		if(playerIndex === -1) return state;

		let cardsToDeal = deck.slice(0, numberOfCards);
		let newDeck = deck.slice(numberOfCards);
		let players = state.players.map((player, index) => {
			if(index === playerIndex) {
				return { ...player, hand: [ ...player.hand, ...cardsToDeal ] };
			}
			return player;
		});

		return {
			...state,
			decks: newDeck,
			players,
		};
	},
	playTurn: (state, action) => {
		const { playerId, cards } = action;
		const playerIndex = state.players.findIndex(player => player.id === playerId);
		if(playerIndex === -1) return state;

		let players = state.players.map((player, index) => {
			if(index === playerIndex) {
				let newHand = player.hand.filter(card => !cards.includes(card));
				return { ...player, hand: newHand };
			}
			return player;
		});

		let turns = [ ...state.turns, { playerId, cards } ];

		return {
			...state,
			players,
			turns,
			currentTurn: state.currentTurn + 1,
		};
	},
});

export const Actions = (flux) => ({
	shuffleDecks: (seed) => {
		flux.dispatch({ type: "shuffleDecks", seed });
	},
	addPlayer: (playerId) => {
		flux.dispatch({ type: "addPlayer", playerId });
	},
	dealToPlayer: (playerId, numberOfCards) => {
		flux.dispatch({ type: "dealToPlayer", playerId, numberOfCards });
	},
	playTurn: (playerId, cards) => {
		flux.dispatch({ type: "playTurn", playerId, cards });
	},
});

export const Factory = (args = {}) => {
	const initialState = State(args);
	const reducers = Reducers(Helpers);
	const config = {
		state: initialState,
		reducers: reducers,
		effects: [],
	};

	const flux = Flux.Factory(config);
	flux.actions = Actions(flux);

	return flux;
};

export default {
	State,
	Reducers,
	Actions,
	Factory,
};