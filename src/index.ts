import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import boardsRouter from "./router/boards.js";
import { client } from "./db/index.js";
import authRouter from "./router/auth.js";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import type { Context } from "hono";
import {
  authenticatedMiddleware,
  verifySessionMiddleware,
} from "./middlewares/auth.js";

type Variables = {
  user: any;
  session: any;
};

export type AppInstanceType = {
  Variables: Variables;
};

export type AppContext = Context<AppInstanceType>;

export const app = new OpenAPIHono<{ Variables: Variables }>({
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

export type AppInstance = typeof app;

app.use(
  "/*",
  cors({
    // TODO: Change origin later
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(csrf({ origin: "http://localhost:3001" }));

app.use(logger());

// ====== Public routes goes here ======

app.get("/", (c) => {
  return c.json("hello hono");
});

// The OpenAPI documentation.
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

app.route("/", authRouter);
// ====== end of public routes ======

// Verify if the user is logged in, if yes, adds the `user` object to the context.
app.use("*", verifySessionMiddleware);

// Checks for `user` object in the context, if it is not available returns 401.
app.use("*", authenticatedMiddleware);

// ====== Protected routes goes here ======
app.route("/", boardsRouter);
// ====== End of protected routes ======

const port = 3000;

client.connect().then(() => {
  console.log("Database Connected.");
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`Server is running on port ${port}`);
});
