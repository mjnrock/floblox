import Flux from "../flux/Flux.js";

export const State = ({ duration } = {}) => ({
	duration,
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
		const newElapsedTime = state.elapsedTime + action.data;
		return {
			...state,
			elapsedTime: newElapsedTime,
		};
	},
	reset: (state) => {
		if(state.running) {
			return state;
		} else {
			return {
				...state,
				elapsedTime: 0,
			};
		}
	},
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
			(state, { type, data }, dispatch) => {
				if(type === "tick") {
					if(state.running && state.elapsedTime >= state.duration) {
						dispatch({ type: "complete" });
					}
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