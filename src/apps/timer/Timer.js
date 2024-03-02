import Flux from "../flux/Flux.js";

export const State = ({ duration } = {}) => ({
	duration: duration,
	elapsedTime: 0,
	running: false,
});

export const Reducers = () => ({
	start: (state) => ({
		...state,
		running: true,
	}),
	pause: (state) => ({
		...state,
		running: false,
	}),
	resume: (state) => ({
		...state,
		running: true,
	}),
	tick: (state, action) => {
		const newElapsedTime = state.elapsedTime + action.payload;
		return {
			...state,
			elapsedTime: newElapsedTime,
		};
	},
	reset: (state) => ({
		...state,
		running: false,
		elapsedTime: 0,
	}),
	complete: (state) => ({
		...state,
		running: false,
		elapsedTime: state.duration,
	}),
});

export const Factory = ({ duration } = {}) => {
	const initialState = State({ duration });
	const config = {
		state: initialState,
		reducers: Reducers(),
		effects: [
			(state, action) => {
				if(state.elapsedTime >= state.duration) {
					console.log("Timer completed");
					state = { ...state, running: false, elapsedTime: state.duration };
				}
			},
		],
	};

	return Flux.Factory(config);
};

export default {
	State,
	Reducers,
	Factory,
};