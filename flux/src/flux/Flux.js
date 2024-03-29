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
		const reducer = reducers[ action.type ];
		if(reducer) {
			const state = getState();
			const newState = reducer(state, action);
			if(newState === state) {
				return;
			} else if(JSON.stringify(newState) === JSON.stringify(state)) {
				return;
			}

			setState(newState);

			effects.forEach(effect => effect(state, action, dispatch));
		}
	};

	const subscribe = (effect) => {
		effects.push(effect);
	};
	const subscribeTo = (type, effect) => {
		const sub = (state, action, dispatch) => {
			if(action.type === type) {
				effect(state, action, dispatch);
			}
		};

		effects.push(sub);

		return sub;
	}

	const unsubscribe = (effect) => {
		const index = effects.indexOf(effect);
		if(index > -1) {
			effects.splice(index, 1);
		}
	}
	const unsubscribeFrom = (sub) => {
		const index = effects.indexOf(sub);
		if(index > -1) {
			effects.splice(index, 1);
		}
	}

	return { getState, dispatch, subscribe, unsubscribe, subscribeTo, unsubscribeFrom };
};

export default {
	State,
	Reducers,
	Factory,
};