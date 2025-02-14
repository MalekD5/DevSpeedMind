import express from "express";
import morgan from "morgan";
import env from "./config";

const app = express();
app.use(morgan("dev"));

app.listen(env.port, () => {
	console.log(`Server is running on port ${env.port}`);
});
