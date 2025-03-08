import { z } from "zod";

export const startGameSchema = z.object({
	name: z
		.string()
		.regex(/^[A-Za-z0-9]+$/g, "name must be alphanumeric")
		.min(3, "name must be at least 3 characters")
		.max(30, "name must be at most 30 characters")
		.toLowerCase(),
	difficulty: z.preprocess((val) => {
		if (typeof val === "string") return Number.parseInt(val, 10);
		return val;
	}, z
		.number()
		.int("difficulty must be a number in range of 1-4")
		.min(0)
		.max(4)),
});

export const submitGameSchema = z.object({
	answer: z.preprocess((val) => {
		if (typeof val === "string") return Number.parseInt(val, 10);
		return val;
	}, z.number()),
});

export const gameIdZod = z
	.string()
	.regex(
		/^[a-zA-Z]+-[a-zA-Z]+-\d{1,3}$/g,
		"game id was rejected as it does not match the format",
	);
