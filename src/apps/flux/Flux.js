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

/* { state, reducers, effect } = config;	*/
export const Factory = (config = {}) => {
	const { getState, setState } = State(config.state);
	const reducers = Reducers(config.reducers);
	const effects = config.effects || [];

	const dispatch = (action) => {
		if(reducers[ action.type ]) {
			const newState = reducers[ action.type ](getState(), action);
			if(newState === getState()) {
				return;
			} else if(JSON.stringify(newState) === JSON.stringify(getState())) {
				return;
			}

			setState(newState);

			effects.forEach(effect => effect(getState(), action, dispatch));
		}
	};

	const subscribe = (effect) => {
		effects.push(effect);
	};

	const unsubscribe = (effect) => {
		const index = effects.indexOf(effect);
		if(index > -1) {
			effects.splice(index, 1);
		}
	}

	return { getState, dispatch, subscribe, unsubscribe };
};

export default {
	State,
	Reducers,
	Factory,
};