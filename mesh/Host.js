import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

export async function main() {
	const app = express();
	const server = http.createServer(app);
	const wss = new WebSocketServer({ server });

	app.use((req, res, next) => {
		console.log(`${ req.method } request to ${ req.url }`);
		next();
	});

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get("/", (req, res) => {
		res.json({
			message: "Hello, GET request!",
			query: req.query,
		});
	});

	app.post("/", (req, res) => {
		res.json({
			message: "Hello, POST request!",
			body: req.body,
		});
	});


	function send(ws, payload) {
		if(typeof payload === "object") {
			payload = JSON.stringify(payload);
		}
		ws.send(payload);
	}
	function broadcast(payload) {
		clients.forEach(client => send(client, payload));
	}
	let clients = [];
	wss.on("connection", ws => {
		console.log("WebSocket connection established");
		clients.push(ws);

		ws.on("message", message => {
			console.log(`Received message - ${ message }`);
		});

		ws.on("close", () => {
			clients = clients.filter(client => client !== ws);
		});

		// send(ws, { message: "Hello, WebSocket!" });
		// broadcast({ message: "Hello, all WebSockets!" });
	});

	app.use("*", (req, res) => {
		res.status(404).send("404 Not Found");
	});

	const PORT = process.env.PORT ?? 3900;
	server.listen(PORT, () => console.log(`[${ Date.now() }][Server]: Running on port: ${ PORT }`));
	wss.on("listening", () => console.log(`[${ Date.now() }][WebSocket]: Running on port: ${ PORT }`));

	return {
		app,
		http: server,
		wss,
	};
}

export default {
	main,
};