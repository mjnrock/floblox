export class Node {
	constructor (module, actions, config) {
		if(config) {
			this.module = module(config);
		} else {
			this.module = module;
		}

		this.actions = actions(this.module);
	}

	subscribe(...fns) {
		for(let fn of fns) {
			this.actions.subscribe(fn);
		};
	}
	unsubscribe(...fns) {
		for(let fn of fns) {
			this.actions.unsubscribe(fn);
		};
	}

	dispatch(type, { ...args } = {}) {
		console.log(type, args)
		this.module.dispatch({ type, ...args });
	}
	action(type, ...args) {
		this.actions?.[ type ](...args);
	}
};

export const orchestrate = (relationships = []) => {
	let cleanup = [];
	for(const relationship of relationships) {
		const [ fromAction, fromNode, toAction, toNode ] = relationship;
		const effect = () => toNode.action(toAction);
		fromNode.module.subscribeTo(fromAction, effect);

		const cleanupEffect = () => toNode.unsubscribe(effect);
		cleanup.push([ relationship, cleanupEffect ]);
	}

	return cleanup;
};