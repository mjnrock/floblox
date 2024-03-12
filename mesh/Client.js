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
	url = "wss://localhost:3900",
	reconnectInterval = 1000,
	maxReconnectInterval = 30000,
	maxReconnectAttempts = 10,
	subscribers = [],
	autoConnect = false,
	dossier,
} = {}) => {
	let reconnectAttempts = 0;
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

		return ws;
	};

	const handleReconnection = (dossier) => {
		if(reconnectAttempts < maxReconnectAttempts) {
			setTimeout(() => {
				console.log(`Attempting to reconnect... Attempt #${ reconnectAttempts + 1 }`);
				connect(dossier);
				reconnectAttempts++;
			}, Math.min(reconnectInterval * Math.pow(2, reconnectAttempts), maxReconnectInterval));
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

	if(autoConnect === true) {
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

export async function main({ url = "wss://localhost:3900", dossier, config } = {}) {
	const clientConfig = {
		url,
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