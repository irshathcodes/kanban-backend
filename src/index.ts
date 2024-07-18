import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import boardsRouter from "./router/boards.js";
import { client } from "./db/index.js";

export const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (result.success) {
      return;
    }

    return c.json(
      {
        message: result.error.format(),
      },
      422
    );
  },
});

app.use(logger());

app.get("/", (c) => {
  return c.json("hello hono");
});

app.route("/", boardsRouter);

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Kanban API",
  },
});

// Swagger documentation
app.get(
  "/api-docs",
  swaggerUI({
    url: "/doc",
  })
);

const port = 3000;

client.connect().then(() => {
  console.log("Database Connected.");
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server is running on port ${port}`);
});
