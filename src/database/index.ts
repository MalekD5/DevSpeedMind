import env from "../config";
import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle(env.db_url as string);
