import Flux from "../../flux/Flux.js";

export const State = () => ({
	time: 0,
	running: false,
	laps: [],
});

export const Reducers = () => ({
	start: (state) => ({
		...state,
		running: true,
	}),
	stop: (state) => ({
		...state,
		running: false,
	}),
	reset: (state) => ({
		...state,
		time: 0,
		laps: [],
		running: false,
	}),
	hardReset: (state) => State(),
	tick: (state) => (
		state.running ? {
			...state,
			time: state.time + 1,
		} : state
	),
	lap: (state) => (
		state.running ? {
			...state,
			laps: [
				...state.laps,
				state.time,
			],
		} : state
	),
});


export const Actions = (flux) => ({
	start: (data = {}) => {
		flux.dispatch({ type: "start", data });

		const tick = () => {
			flux.dispatch({
				type: "tick",
				data: data.interval ?? (1000 / 60),
			});
		};

		const interval = setInterval(tick, 10);

		return () => {
			clearInterval(interval);
		};
	},
	stop: (clearFn) => {
		clearFn();
		flux.dispatch({ type: "stop" });
	},
	reset: () => flux.dispatch({ type: "reset" }),
	lap: () => flux.dispatch({ type: "lap" }),
});

export const Factory = (state) => {
	const config = {
		state: state ?? State(),
		reducers: Reducers(),
		effects: [
			// (state, action) => console.log("State:", state, "Action:", action),
		],
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