import { isAnswerCorrect } from "../lib/utils";
import { gameIdZod } from "../lib/validate";
import {
	getHistory,
	getQuestionBySlug,
	updateGameStatus,
} from "../repository/game.repository";
import type { Request, Response } from "express";

export default async function SubmitGameController(
	req: Request,
	res: Response,
) {
	const { answer } = req.body;
	const paramResult = gameIdZod.safeParse(req.params.game_id);
	if (!paramResult.success) {
		res.status(400).json({ error: paramResult.error.message });
		return;
	}

	const game_id = paramResult.data;

	const game = await getQuestionBySlug(game_id);

	if (!game.ok || !game.question) {
		res.status(404).json({ error: "Game not found" });
		return;
	}

	const {
		slug,
		createdAt,
		answer: correct_answer,
		player,
		attempted,
	} = game.question;

	if (attempted) {
		res
			.status(400)
			.json({ error: "You have already submitted this question!" });
		return;
	}

	const historyResult = await getHistory(player, slug);

	let history: {
		question: string;
		answer: string;
		timeTaken: number;
	}[] = [];

	if (historyResult.ok && historyResult.history) {
		history = historyResult.history;
	}

	const timeTakenMilliseconds =
		new Date(Date.now()).getTime() - new Date(createdAt).getTime();

	if (isAnswerCorrect(answer, Number.parseFloat(correct_answer))) {
		const result = await updateGameStatus(
			slug,
			player,
			timeTakenMilliseconds,
			true,
			answer,
		);

		if (!result.ok) {
			res.status(500).json({ error: "Internal server error" });
			return;
		}

		res.status(200).json({
			message: `Good job ${player}, your answer is correct!`,
			time_taken: timeTakenMilliseconds / 1000,
			current_score: `${result.score}/${result.attempts}`,
			history,
		});
		return;
	}
	const result = await updateGameStatus(
		slug,
		player,
		timeTakenMilliseconds,
		false,
		answer,
	);

	if (!result.ok) {
		res.status(500).json({ error: "Internal server error" });
		return;
	}

	res.status(200).json({
		message: `Sorry ${player}, your answer is incorrect!`,
		time_taken: timeTakenMilliseconds / 1000,
		current_score: result.score,
		history,
	});
}
