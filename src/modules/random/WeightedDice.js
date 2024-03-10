import Flux from "../flux/Flux.js";

export const Helpers = {
	rollDice: (weights) => {
		if(!weights || weights.length === 0) {
			return Math.random();
		}

		const totalWeight = weights.reduce((acc, val) => acc + val, 0);
		let random = Math.random() * totalWeight;
		for(let i = 0; i < weights.length; i++) {
			if(random < weights[ i ]) {
				return i + 1;
			}
			random -= weights[ i ];
		}
	},
	calculateStats: (results, weights) => {
		const numbers = results.map(result => result.result);
		const sum = numbers.reduce((acc, val) => acc + val, 0);
		const mean = sum / numbers.length;
		const sortedNumbers = numbers.slice().sort((a, b) => a - b);
		const median = sortedNumbers.length % 2 === 0
			? (sortedNumbers[ sortedNumbers.length / 2 - 1 ] + sortedNumbers[ sortedNumbers.length / 2 ]) / 2
			: sortedNumbers[ Math.floor(sortedNumbers.length / 2) ];
		const mode = numbers.sort((a, b) =>
			numbers.filter(v => v === a).length - numbers.filter(v => v === b).length
		).pop();
		const range = Math.max(...numbers) - Math.min(...numbers);
		const min = Math.min(...numbers);
		const max = Math.max(...numbers);
		const odds = weights.length > 0
			? weights.map(weight => weight / weights.reduce((acc, val) => acc + val, 0))
			: [];

		const dist = Array(weights.length).fill(0);
		results.forEach(result => {
			// Subtract 1 from result.result to align with 0-based indexing for distribution
			if(result.result > 0 && result.result <= weights.length) {
				dist[ result.result - 1 ] += 1; // Adjust for 1-based result indexing
			}
		});

		return { sum, mean, median, mode, range, min, max, odds, dist };
	},
};

export const State = ({ weights = [] } = {}) => ({
	weights,
	history: [],
	stats: { mean: 0, median: 0, mode: 0, range: 0, min: 0, max: 0, sum: 0 },
});

export const Reducers = (helpers) => ({
	setWeights: (state, action) => ({
		...state,
		weights: action.weights
	}),
	rollDice: (state) => {
		const result = helpers.rollDice(state.weights);
		const newHistory = [ ...state.history, { result } ];
		const newStats = helpers.calculateStats(newHistory, state.weights);
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
	setWeights: (weights) => {
		flux.dispatch({ type: "setWeights", weights });
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
	State,
	Reducers,
	Actions,
	Factory
};