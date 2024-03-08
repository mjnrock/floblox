import Flux from "../flux/Flux.js";

export const State = ({
	duration,
	loop = false,
} = {}) => ({
	duration,
	loop,
	elapsedTime: 0,
	running: false,
	counter: 0,
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
	complete: (state) => {
		const newState = {
			...state,
			elapsedTime: state.loop ? 0 : state.duration,
			running: state.loop,
			counter: state.counter + 1,
		};

		if(state.loop) {
			newState.elapsedTime = 0;
		} else {
			newState.running = false;
		}

		return newState;
	},
	toggleLoop: (state) => ({
		...state,
		loop: !state.loop,
	}),
});

export const Factory = ({ duration, loop } = {}) => {
	const initialState = State({ duration, loop });
	const config = {
		state: initialState,
		reducers: Reducers(),
		effects: [
			(state, action, dispatch) => {
				if(action.type === "tick") {
					if(state.running && state.elapsedTime >= state.duration) {
						dispatch({ type: "complete" });

						if(state.loop) {
							dispatch({ type: "reset" });
							dispatch({ type: "start" });
						}
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