import { Lucia } from "lucia";
import { db } from "../db/index.js";
import { sessionTable, userTable } from "../db/schema.js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { setCookie } from "hono/cookie";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
