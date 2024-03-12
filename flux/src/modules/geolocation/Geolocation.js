import Flux from "../../flux/Flux.js";

export const State = () => ({
	tracking: false,
	currentLocation: null,
	watchId: null,
});

export const Reducers = () => ({
	startTracking: (state) => ({
		...state,
		tracking: true,
	}),
	updateLocation: (state, action) => ({
		...state,
		currentLocation: action.data,
	}),
	stopTracking: (state) => ({
		...state,
		tracking: false,
		currentLocation: null,
	}),
	setWatchId: (state, action) => ({
		...state,
		watchId: action.data,
	}),
	clearLocation: (state) => ({
		...state,
		currentLocation: null,
	}),
});

export const Actions = (flux) => ({
	getCurrentLocation: () => {
		const success = (position) => {
			flux.dispatch({
				type: "updateLocation",
				data: position,
			});
		};

		const error = (err) => {
			console.warn(`ERROR(${ err.code }): ${ err.message }`);
		};

		navigator.geolocation.getCurrentPosition(success, error, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		});
	},
	startTracking: () => {
		const success = (position) => {
			flux.dispatch({
				type: "updateLocation",
				data: position,
			});
		};

		const error = (err) => {
			console.warn(`ERROR(${ err.code }): ${ err.message }`);
		};

		flux.dispatch({ type: "startTracking" });
		const watchId = navigator.geolocation.watchPosition(success, error, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		});

		flux.dispatch({
			type: "setWatchId",
			data: watchId,
		});
	},
	stopTracking: () => {
		navigator.geolocation.clearWatch(flux.getState().watchId);
		flux.dispatch({ type: "stopTracking" });
	},
	stopAndClearTracking: () => {
		navigator.geolocation.clearWatch(flux.getState().watchId);
		flux.dispatch({ type: "stopTracking" });
		flux.dispatch({ type: "clearLocation" });
	},
});

export const Factory = () => {
	const initialState = State();
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