import { OpenAPIHono } from "@hono/zod-openapi";
import { boardsRoute } from "../route-schema/boards.js";
import { db } from "../db/index.js";

const boardsRouter = new OpenAPIHono();

boardsRouter.openapi(boardsRoute, async (c) => {
  return c.json({ id: Date.now().toString(), age: 20, name: "irshath" }, 200);
});

export default boardsRouter;
