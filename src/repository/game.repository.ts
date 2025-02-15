import { db } from "../database";
import { gameTable, questionsTable } from "../database/schema";
import { createGameSlug, generateRandomQuestion } from "../lib/utils";
import { and, eq, not, sql } from "drizzle-orm";

// get game from player name
export async function getGame(name: string) {
	try {
		const gameObject = await db
			.select()
			.from(gameTable)
			.where(eq(gameTable.playerName, name));

		if (gameObject.length === 0) {
			return { ok: false, game: null };
		}

		return { ok: true, game: gameObject[0] };
	} catch (error) {
		return { ok: false, game: null };
	}
}

export async function getQuestionBySlug(slug: string) {
	try {
		const questionObject = await db
			.select()
			.from(questionsTable)
			.where(eq(questionsTable.slug, slug));

		if (questionObject.length === 0) {
			return { ok: false, question: null };
		}

		return { ok: true, question: questionObject[0] };
	} catch (error) {
		return { ok: false, question: null };
	}
}

export async function getGameBySlug(slug: string) {
	try {
		const question = await db
			.select()
			.from(questionsTable)
			.where(eq(questionsTable.slug, slug));

		if (question.length === 0) {
			return { ok: false, game: null };
		}

		const data = question[0];

		const game = await db
			.select()
			.from(gameTable)
			.where(eq(gameTable.playerName, data.player));

		return {
			ok: true,
			game: {
				...game[0],
				difficulty: data.difficulty,
			},
		};
	} catch (error) {
		return { ok: false, game: null };
	}
}

export async function createGame(
	playerName: string,
	difficulty: 1 | 2 | 3 | 4,
) {
	const slug = createGameSlug();
	const { question, answer } = generateRandomQuestion(difficulty);

	try {
		await db.transaction(async (trx) => {
			await trx.insert(gameTable).values({
				playerName,
			});

			await trx.insert(questionsTable).values({
				player: playerName,
				slug,
				question,
				answer,
				difficulty,
				createdAt: new Date(Date.now()),
			});
		});
		return { ok: true, slug, question };
	} catch (error) {
		console.error(error);
		return { ok: false, error: error as Error };
	}
}

export async function createAQuestion(
	player: string,
	difficulty: 1 | 2 | 3 | 4,
) {
	const slug = createGameSlug();
	const { question, answer } = generateRandomQuestion(difficulty);

	try {
		await db.insert(questionsTable).values({
			player,
			slug,
			question,
			answer,
			difficulty,
			createdAt: new Date(Date.now()),
		});

		return { ok: true, question, slug };
	} catch (error) {
		return { ok: false, error: error as Error };
	}
}

export async function updateGameStatus(
	slug: string,
	player: string,
	timeTaken: number,
	correct: boolean,
	playerAnswer: string,
) {
	try {
		await db.transaction(async (trx) => {
			if (correct) {
				await trx
					.update(gameTable)
					.set({
						score: sql`${gameTable.score} + 1`,
						totalTime: sql`${gameTable.totalTime} + ${timeTaken}`,
						attempts: sql`${gameTable.attempts} + 1`,
					})
					.where(eq(gameTable.playerName, player));
			} else {
				await trx
					.update(gameTable)
					.set({
						totalTime: sql`${gameTable.totalTime} + ${timeTaken}`,
						attempts: sql`${gameTable.attempts} + 1`,
					})
					.where(eq(gameTable.playerName, player));
			}

			await trx
				.update(questionsTable)
				.set({
					attempted: true,
					timeTaken,
					answer: playerAnswer,
				})
				.where(eq(questionsTable.slug, slug));
		});

		const game = await getGame(player);

		// should be impossible, but added it just in case
		if (!game.ok || !game.game) {
			return { ok: false, error: new Error("Game not found") };
		}

		return { ok: true, score: game.game.score, attempts: game.game.attempts };
	} catch (error) {
		return { ok: false, error: error as Error };
	}
}

export async function getHistory(player: string, current = "") {
	try {
		const gameHistory = await db
			.select()
			.from(questionsTable)
			.where(
				and(
					eq(questionsTable.player, player),
					not(eq(questionsTable.slug, current)),
				),
			);

		return {
			ok: true,
			history: gameHistory.map((game) => ({
				question: game.question,
				answer: game.answer,
				timeTaken: game.timeTaken,
			})),
		};
	} catch (error) {
		return { ok: false, error: error as Error };
	}
}
