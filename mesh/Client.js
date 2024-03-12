import { v4 as uuid } from "uuid";
import WebSocket from "ws";

const clientMetaInitializer = (dossier) => {
	if(typeof dossier === "function") {
		return dossier();
	} else if(typeof dossier === "object") {
		return dossier;
	}
	return {};
};

const createWebSocketClient = ({
	url = "ws://localhost:3900",
	reconnectDelays = [ 1000, 5000, 5000 ],
	maxReconnectAttempts,
	subscribers = [],
	autoConnect = false,
	dossier,
} = {}) => {
	let reconnectAttempts = 0;
	let maxReconnectAttempts = reconnectDelays.length;
	let ws;

	const connect = (dossier) => {
		ws = new WebSocket(url);
		ws.meta = {
			id: uuid(),
			...clientMetaInitializer(dossier),
		};

		ws.on("open", () => {
			console.log(`[${ Date.now() }]: WebSocket connection established by ${ ws.meta.id }`);
			send({
				id: uuid(),
				type: "json",
				data: ws.meta,
				ts: Date.now(),
			});
			reconnectAttempts = 0;
		});

		ws.on("message", (data) => {
			console.log(`[${ Date.now() }]: Received message from ${ ws.meta.id } - `, data);
			subscribers.forEach(handler => handler(data));
		});

		ws.on("close", () => {
			console.log(`[${ Date.now() }]: WebSocket connection closed by ${ ws.meta.id }`);
			handleReconnection(dossier);
		});

		ws.on("error", (err) => {
			console.error(`[${ Date.now() }]: `, err);
			handleReconnection(dossier);
		});
	};

	const handleReconnection = (dossier) => {
		if(reconnectAttempts < maxReconnectAttempts) {
			const delay = reconnectDelays[ reconnectAttempts ];
			setTimeout(() => {
				console.log(`Attempting to reconnect... Attempt #${ reconnectAttempts + 1 }`);
				connect(dossier);
				reconnectAttempts++;
			}, delay);
		} else {
			console.log("Max reconnection attempts reached. Giving up.");
		}
	};

	const send = (message) => {
		if(ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		} else {
			console.log("WebSocket is not open. Cannot send message.");
		}
	};

	const subscribe = (handler) => {
		subscribers.push(handler);
	};

	const unsubscribe = (handler) => {
		subscribers = subscribers.filter(h => h !== handler);
	};

	const disconnect = () => {
		if(ws) {
			subscribers = [];
			ws.close();
		}
	};

	if(autoConnect) {
		connect(dossier);
	}

	return {
		connect: (dossier) => connect(dossier),
		send,
		subscribe,
		unsubscribe,
		disconnect,
	};
};

export const main = async ({ url = "ws://localhost:3900", dossier, config, autoConnect } = {}) => {
	const clientConfig = {
		url,
		autoConnect,
		...config,
	};
	const client = createWebSocketClient(clientConfig);

	if(clientConfig.autoConnect) {
		client.connect(dossier);
	}

	return client;
};

export default {
	main,
};