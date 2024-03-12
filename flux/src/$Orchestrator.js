export class Node {
	static New = (module, actions, config) => new Node(module, actions, config);

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
			this.module.subscribe(fn);
		};
	}
	unsubscribe(...fns) {
		for(let fn of fns) {
			this.module.unsubscribe(fn);
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
	if(Array.isArray(relationships[ 0 ])) {
		let cleanup = [];
		for(const relationship of relationships) {
			const [ fromAction, fromNode, toAction, toNode ] = relationship;
			const effect = () => toNode.action(toAction);
			fromNode.module.subscribeTo(fromAction, effect);

			const cleanupEffect = () => toNode.unsubscribe(effect);
			cleanup.push(cleanupEffect);
		}

		return cleanup;
	}


	let cleanup = [];
	for(const relationship of relationships) {
		const { from, to, iff } = relationship;
		const [ fromNode, fromAction ] = from;
		const [ toNode, toAction ] = to;

		let effect;
		if(iff) {
			effect = () => {
				if(iff({ ...fromNode.module.getState() }, { ...toNode.module.getState() })) {
					toNode.action(toAction);
				}
			};
		} else {
			effect = () => toNode.action(toAction);
		}
		fromNode.module.subscribeTo(fromAction, effect);

		const cleanupEffect = () => toNode.unsubscribe(effect);
		cleanup.push(cleanupEffect);
	}

	return cleanup;
};