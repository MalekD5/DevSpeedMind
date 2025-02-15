import { generateSlug } from "random-word-slugs";
import { evaluate } from "./math";

export function createGameSlug() {
	const randomNum = Math.floor(Math.random() * 999) + 1;
	const slug = generateSlug(2);
	return `${slug}-${randomNum}`;
}

const operands = ["+", "-", "*", "/"];

export function generateRandomQuestion(difficulty: 1 | 2 | 3 | 4) {
	const numberLength = difficulty;
	const numberOfOperands = difficulty + 1;

	let question = "";

	for (let i = 0; i < numberOfOperands; i++) {
		const maxNumber = 10 ** numberLength - 1;
		const randomNumber = Math.floor(Math.random() * maxNumber) + 1;
		const signedNumber = Math.random() < 0.5 ? -randomNumber : randomNumber;

		if (signedNumber < 0) {
			question += `(${signedNumber})`;
		} else {
			question += signedNumber;
		}

		if (i < numberOfOperands - 1) {
			question += operands[Math.floor(Math.random() * operands.length)];
		}
	}

	return {
		question,
		answer: evaluate(question),
	};
}

export function isAnswerCorrect(
	ans: number,
	correct: number,
	epsilon = 0.0001,
) {
	return Math.abs(ans - correct) < epsilon;
}

export function formatDate(date: Date) {
	return date.toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
}
