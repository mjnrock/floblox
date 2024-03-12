import "./dotenv.js";

import Host from "./Host.js";
import Client from "./Client.js";

async function main() {
	const { http, wss } = await Host.main().catch(console.error);

	setTimeout(async () => {
		const client = await Client.main({
			url: "ws://localhost:3900",
			autoConnect: true,
		}).catch(console.error);

		client.subscribe(message => {
			console.log("Received message:", message);
		});

		client.send({ message: "Hello, WebSocket server!" });

		setTimeout(() => {
			// Test the reconnect functionality
			client.disconnect();
			// New approach to close both the WebSocket server and HTTP server
			// wss.close(() => {
			// 	console.log("WebSocket Server closed");
			// });
			// http.close(() => {
			// 	console.log("HTTP Server closed");
			// });
		}, 5000);
	}, 1000);
};

main().catch(console.error);