import Flux from "../../flux/Flux.js";

export const State = ({ cards = [] } = {}) => ({
	cards,
});

export const Reducers = () => ({
	addCard: (state, action) => ({
		...state,
		cards: [ ...state.cards, action.card ],
	}),
	playCard: (state, action) => {
		const newCards = [ ...state.cards.slice(0, action.cardIndex), ...state.cards.slice(action.cardIndex + 1) ];
		return { ...state, cards: newCards, playedCard: state.cards[ action.cardIndex ] };
	},
});

export const Actions = (flux) => ({
	addCard: (card) => {
		flux.dispatch({ type: "addCard", card });
	},
	playCard: (cardIndex) => {
		flux.dispatch({ type: "playCard", cardIndex });
	},
});

export const Factory = (args = {}) => {
	const initialState = State(args);
	const config = {
		state: initialState,
		reducers: Reducers(),
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