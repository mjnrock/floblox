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
	stop: (state) => ({
		...state,
		elapsedTime: 0,
		running: false,
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
	hardReset: (state) => State(),
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

export const Actions = (flux) => ({
	start: (data = {}) => {
		/* Fringe case where invoking this with an expired timer dispatching "complete" increments the `.counter` */
		if(flux.getState().elapsedTime >= flux.getState().duration) {
			return () => {};
		}

		flux.dispatch({ type: "start", data });

		let dt = data.interval || 10;
		const tick = () => {
			flux.dispatch({
				type: "tick",
				data: dt,
			});

			if(flux.getState().elapsedTime >= flux.getState().duration) {
				flux.dispatch({ type: "complete" });
				if(flux.getState().loop) {
					flux.dispatch({ type: "reset" });
				} else {
					clearInterval(interval);
				}
			}
		};

		const interval = setInterval(tick, dt);

		return () => {
			clearInterval(interval);
		};
	},

	pause: (clearFn) => {
		clearFn();
		flux.dispatch({ type: "pause" });
	},
	stop: (clearFn) => {
		clearFn();
		flux.dispatch({ type: "stop" });
	},
	reset: () => {
		flux.dispatch({ type: "reset" });
	},
	toggleLoop: () => {
		flux.dispatch({ type: "toggleLoop" });
	},
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
	Actions,
	Factory,
};