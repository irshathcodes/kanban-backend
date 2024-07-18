import { Lucia } from "lucia";
import { db } from "./index.js";
import { sessionTable, userTable } from "./schema.js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
    expires: false,
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
