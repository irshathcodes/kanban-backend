import { OpenAPIHono } from "@hono/zod-openapi";
import { boardsRoute } from "../route-schema/boards.js";
import { db } from "../db/index.js";
import { posts } from "../db/schema.js";

const boardsRouter = new OpenAPIHono();

boardsRouter.openapi(boardsRoute, async (c) => {
  const res = await db.select().from(posts);
  console.log("res: ", res);
  return c.json({ id: Date.now().toString(), age: 20, name: "irshath" }, 200);
});

export default boardsRouter;
