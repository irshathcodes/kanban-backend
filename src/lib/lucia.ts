import { Lucia } from "lucia";
import { db } from "../db/index.js";
import { sessionTable, userTable } from "../db/schema.js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: true,
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
