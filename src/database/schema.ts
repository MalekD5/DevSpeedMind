import type { InferSelectModel } from "drizzle-orm";
import {
	boolean,
	datetime,
	double,
	index,
	int,
	mysqlTable,
	serial,
	smallint,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core";

// needed as drizzle does not provide default length for varchar
const varchar255 = (name: string) => varchar(name, { length: 255 });

export const gameTable = mysqlTable(
	"game_sessions",
	{
		playerName: varchar255("player_name").notNull().primaryKey(),
		score: int("score").notNull().default(0),
		attempts: int("attempts").notNull().default(0),
		totalTime: double("total_time").notNull().default(0),
	},
	(table) => [index("fk_name_idx").on(table.playerName)],
);

export const questionsTable = mysqlTable(
	"questions",
	{
		slug: varchar255("slug").notNull().primaryKey(),
		player: varchar255("player_name")
			.notNull()
			.references(() => gameTable.playerName),
		difficulty: smallint("difficulty", {
			unsigned: true,
		}).notNull(),
		question: varchar255("question").notNull(),
		answer: varchar255("answer").notNull(),
		attempted: boolean("attempted").notNull().default(false),
		createdAt: datetime("created_at").notNull(),
		timeTaken: double("time_taken").notNull().default(0),
	},
	(table) => [index("fk_slug_idx").on(table.slug)],
);

export type GameTable = InferSelectModel<typeof gameTable>;
export type QuestionsTable = InferSelectModel<typeof questionsTable>;
