import { useState, useEffect, useRef } from "react";

export const useSelector = (store, selector) => {
	const [ selectedState, setSelectedState ] = useState(() => selector(store.getState()));

	const selectorRef = useRef(selector);
	selectorRef.current = selector;

	useEffect(() => {
		const checkForUpdates = () => {
			const newState = selectorRef.current(store.getState());
			setSelectedState(prevState => {
				if(JSON.stringify(prevState) !== JSON.stringify(newState)) {
					return newState;
				}
				return prevState;
			});
		};

		store.subscribe(checkForUpdates);

		return () => store.unsubscribe(checkForUpdates);
	}, [ store ]);

	return selectedState;
};

export const useFlux = (store) => {
	const useSelectorBound = selector => {
		return useSelector(store, selector);
	};

	return {
		useSelector: useSelectorBound,
	};
};

export default {
	useFlux,
	useSelector,
}