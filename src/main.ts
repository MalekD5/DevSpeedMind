import express from "express";
import morgan from "morgan";
import env from "./config";
import bodyParser from "body-parser";
import gameRouter from "./routers/game.routes";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

// Add request timestamp in ISO format
app.use((req, _res, next) => {
	req.timestamp = new Date().toISOString();
	next();
});

app.use("/", gameRouter);

app.listen(env.port, () => {
	console.log(`Server is running on port ${env.port}`);
});

declare global {
	namespace Express {
		interface Request {
			timestamp: string;
		}
	}
}
