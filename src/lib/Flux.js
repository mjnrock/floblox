export const State = (initialState = {}) => {
	let state = initialState;

	return {
		getState: () => state,
		setState: (newState) => {
			state = newState;

			return state;
		},
	};
};

export const Reducers = (reducers) => reducers;

export const Factory = (config = {}) => {
	const { getState, setState } = State(config.initialState);
	const reducers = Reducers(config.reducers);
	const effects = config.effects || [];

	const dispatch = (action) => {
		if(reducers[ action.type ]) {
			const newState = reducers[ action.type ](getState(), action);
			setState(newState);

			effects.forEach(effect => effect(getState(), action));
		}
	};

	const subscribe = (effect) => {
		effects.push(effect);
	};

	return { getState, dispatch, subscribe };
};

export default {
	State,
	Reducers,
	Factory,
};