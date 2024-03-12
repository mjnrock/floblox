import Flux from "../../flux/Flux.js";

export const Helpers = {
	rollDice: (sides) => {
		if(sides === Infinity) {
			return Math.random();
		} else if(sides === -Infinity) {
			return -Math.random();
		} else {
			return Math.floor(Math.random() * sides) + 1;
		}
	},
	calculateStats: (results) => {
		const numbers = results.map(result => result.result);
		const sum = numbers.reduce((acc, val) => acc + val, 0);
		const mean = sum / numbers.length;
		const sortedNumbers = numbers.slice().sort((a, b) => a - b);
		const median = sortedNumbers.length % 2 === 0
			? (sortedNumbers[ sortedNumbers.length / 2 - 1 ] + sortedNumbers[ sortedNumbers.length / 2 ]) / 2
			: sortedNumbers[ Math.floor(sortedNumbers.length / 2) ];
		const mode = numbers.sort((a, b) =>
			numbers.filter(v => v === a).length
			- numbers.filter(v => v === b).length
		).pop();
		const range = Math.max(...numbers) - Math.min(...numbers);
		const min = Math.min(...numbers);
		const max = Math.max(...numbers);

		return { sum, mean, median, mode, range, min, max };
	}
};

export const State = ({ sides = 6 } = {}) => ({
	sides,
	history: [],
	stats: { mean: 0, median: 0, mode: 0, range: 0, min: 0, max: 0, sum: 0 },
});

export const Reducers = (helpers) => ({
	setSides: (state, action) => ({
		...state,
		sides: action.sides
	}),
	rollDice: (state) => {
		const result = helpers.rollDice(state.sides);
		const newHistory = [ ...state.history, { sides: state.sides, result } ];
		const newStats = helpers.calculateStats(newHistory);
		return {
			...state,
			history: newHistory,
			stats: newStats
		};
	},
	resetResults: (state) => ({
		...state,
		history: [],
		stats: { mean: 0, median: 0, mode: 0, range: 0, min: 0, max: 0, sum: 0 }
	})
});

export const Actions = (flux) => ({
	setSides: (sides) => {
		flux.dispatch({ type: "setSides", sides });
	},
	rollDice: () => {
		flux.dispatch({ type: "rollDice" });
	},
	resetResults: () => {
		flux.dispatch({ type: "resetResults" });
	}
});

export const Factory = (args = {}) => {
	const initialState = State(args);
	const reducers = Reducers(Helpers);
	const config = {
		state: initialState,
		reducers: reducers,
		effects: []
	};

	const flux = Flux.Factory(config);
	flux.actions = Actions(flux);

	return flux;
};

export default {
	Helpers,
	State,
	Reducers,
	Actions,
	Factory,
};