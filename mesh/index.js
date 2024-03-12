import "./dotenv.js";

import Host from "./Host.js";
import Client from "./Client.js";

async function main() {
	const { http, wss } = await Host.main().catch(console.error);

	setTimeout(async () => {
		// Adjusted to include a callback for when the connection opens
		const client = await Client.main({
			url: "ws://localhost:3900",
			autoConnect: true,
			onOpen: () => {
				console.log("Connection is now open.");
				client.send({ message: "Hello, WebSocket server!" });
			}
		}).catch(console.error);

		client.subscribe(message => {
			console.log("Received message:", message);
		});

		// Moved the initial send inside the onOpen callback above
		// client.send({ message: "Hello, WebSocket server!" });

		setTimeout(() => {
			client.disconnect();
			// Close the WebSocket server and HTTP server
			wss.close(() => {
				console.log("WebSocket Server closed");
			});
			http.close(() => {
				console.log("HTTP Server closed");
			});
		}, 5000);
	}, 1000);
};

main().catch(console.error);