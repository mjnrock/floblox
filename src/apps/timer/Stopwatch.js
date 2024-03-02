import Flux from "../../lib/Flux.js";

export const State = () => ({
	time: 0,
	running: false,
	laps: [],
});

export const Reducers = () => ({
	start: (state) => ({ ...state, running: true }),
	stop: (state) => ({ ...state, running: false }),
	reset: (state) => ({ ...state, time: 0, laps: [], running: false }),
	tick: (state) => state.running ? { ...state, time: state.time + 1 } : state,
	lap: (state) => ({ ...state, laps: [ ...state.laps, state.time ] })
});

export const Factory = (state, action) => {
	// create and use a config object with Flux.Factory
	const config = {
		initialState: state,
		reducers: Reducers(),
		effects: [
			(state, action) => console.log('State:', state, 'Action:', action),
		],
	};

	return Flux.Factory(config);
};

export default {
	State,
	Reducers,
	Factory,
};