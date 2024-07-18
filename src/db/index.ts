import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

export const client = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

export const db = drizzle(client, { schema });
