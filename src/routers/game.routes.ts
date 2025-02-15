import { Router } from "express";
import {
	GameStatusController,
	StartGameController,
	SubmitGameController,
} from "../controllers";
import { startGameSchema, submitGameSchema } from "../lib/validate";
import { ZodBodyMiddleware } from "../middleware";

const router = Router();

router.post(
	"/game/start",
	ZodBodyMiddleware(startGameSchema),
	StartGameController,
);

router.post(
	"/game/:game_id/submit",
	ZodBodyMiddleware(submitGameSchema),
	SubmitGameController,
);
router.get("/game/:game_id/status", GameStatusController);

export default router;
