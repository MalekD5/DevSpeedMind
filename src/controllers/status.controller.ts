import { gameIdZod } from "../lib/validate";
import { getGameBySlug, getHistory } from "../repository/game.repository";
import type { Request, Response } from "express";

export default async function GameStatusController(
	req: Request,
	res: Response,
) {
	const paramResult = gameIdZod.safeParse(req.params.game_id);
	if (!paramResult.success) {
		res.status(400).json({ error: paramResult.error.message });
		return;
	}

	const game_id = paramResult.data;

	const game = await getGameBySlug(game_id);

	if (!game.ok || !game.game) {
		res.status(404).json({ error: "Game not found" });
		return;
	}

	const { playerName, score, attempts, totalTime, difficulty } = game.game;

	const history = await getHistory(playerName);

	if (!history.ok || !history.history) {
		res.status(500).json({ error: "Internal server error" });
		return;
	}

	res.status(200).json({
		name: playerName,
		difficulty,
		current_score: `${score}/${attempts}`,
		total_time_spent: totalTime,
		history: history.history,
	});
}
