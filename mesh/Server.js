import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

// Async main function to wrap server setup
async function main() {
	const app = express();
	const server = http.createServer(app);
	const wss = new WebSocketServer({ server });

	// Middleware for logging requests
	app.use((req, res, next) => {
		console.log(`${ req.method } request to ${ req.url }`);
		next();
	});

	// JSON and URL-encoded middleware
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// GET route
	app.get("/", (req, res) => {
		res.send("Hello, GET request!");
	});

	// POST route
	app.post("/", (req, res) => {
		res.json({ message: "Hello, POST request!", body: req.body });
	});

	// WebSocket setup
	wss.on("connection", ws => {
		console.log("WebSocket connection established");
		ws.on("message", message => {
			console.log(`Received message - ${ message }`);
		});
		ws.send("Hello from WebSocket server!");
	});

	// Fallback route for unmatched routes
	app.use("*", (req, res) => {
		res.status(404).send("404 Not Found");
	});

	// Starting the HTTP and WS server
	const PORT = process.env.PORT || 3000;
	server.listen(PORT, () => console.log(`Server running on port ${ PORT }`));
}

main().catch(err => console.error(err));