import { OpenAPIHono } from "@hono/zod-openapi";
import { loginUserRoute, registerUserRoute } from "../route-schema/auth.js";
import { db } from "../db/index.js";
import { userTable } from "../db/schema.js";
import { and, eq, or } from "drizzle-orm";
import { attachAuthCookie, hashPassword, verifyPassword } from "../utils.js";
import { generateId } from "lucia";

const authRouter = new OpenAPIHono();

authRouter.openapi(registerUserRoute, async (c) => {
  const body = await c.req.json();

  const existingUser = await db
    .select()
    .from(userTable)
    .where(or(eq(userTable.email, body.email), eq(userTable.name, body.name)));

  if (existingUser.length) {
    return c.json(
      {
        message: `A user with this email already exist. Please login`,
      },
      400
    );
  }

  const hash = await hashPassword(body.password);
  const id = generateId(15);

  const result = await db
    .insert(userTable)
    .values({
      email: body.email,
      password: hash,
      name: body.name,
      id,
      accountType: "email",
    })
    .returning();

  const { password, ...rest } = result[0]!;
  attachAuthCookie(rest!.id, c);

  return c.json(rest, 200);
});

authRouter.openapi(loginUserRoute, async (c) => {
  const body = await c.req.json();

  const [user] = await db
    .select()
    .from(userTable)
    .where(
      and(
        or(eq(userTable.name, body.name), eq(userTable.email, body.email)),
        eq(userTable.accountType, "email")
      )
    );

  if (!user) {
    return c.json({ message: "User does not exist, Please sign up." }, 400);
  }

  const isPasswordMatched = await verifyPassword(body.password, user.password);

  if (!isPasswordMatched) {
    return c.json({ message: "Invalid credentials" }, 400);
  }

  attachAuthCookie(user.id, c);

  return c.json({ email: user.email, name: user.name }, 200);
});

export default authRouter;
