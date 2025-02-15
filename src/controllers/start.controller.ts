import { formatDate } from "../lib/utils";
import env from "../config";
import {
	createAQuestion,
	createGame,
	getGame,
} from "../repository/game.repository";
import type { Request, Response } from "express";

export default async function StartGameController(req: Request, res: Response) {
	const { name, difficulty } = req.body;

	const game = await getGame(name);

	// if player exists, create a new question
	if (game.ok) {
		const createdQuestion = await createAQuestion(name, difficulty);

		if (!createdQuestion.ok) {
			res
				.status(500)
				.json({ message: "internal server error: failed to create question" });
			return;
		}

		const { slug, question } = createdQuestion;

		res.status(200).json({
			message: `Hello ${name}, find your submit API URL below`,
			submit_url: `${env.server_url}/game/${slug}/submit`,
			question,
			time_started: formatDate(new Date(req.timestamp)),
		});
		return;
	}

	// player does not exists, return the game
	const createdGame = await createGame(name, difficulty);

	if (!createdGame.ok) {
		res
			.status(500)
			.json({ message: "internal server error: failed to create game" });
		return;
	}

	const { slug, question } = createdGame;

	res.status(201).json({
		message: `Hello ${name}, find your submit API URL below`,
		submit_url: `${env.server_url}/game/${slug}/submit`,
		question,
		time_started: formatDate(new Date(req.timestamp)),
	});
}
