import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { badRequestErrorSchema, validationErrorSchema } from "./errors.js";

const createUserRequestSchema = z.object({
  name: z.string().min(1).openapi({}).nullable(),
  password: z.string().min(8),
  email: z.string().email(),
});

const loginUserRequestSchema = z
  .object({
    name: z.string().min(1).optional(),
    password: z.string().min(8),
    email: z.string().email().optional(),
  })
  .refine((data) => data.email || data.name, {
    message: "Either name or email must be provided",
    path: ["name", "email"],
  });

const registerUserResponse = createUserRequestSchema.omit({ password: true });

export const registerUserRoute = createRoute({
  method: "post",
  path: "/auth/register/email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: registerUserResponse,
        },
      },
      description: "No content",
    },
    422: validationErrorSchema,
    400: badRequestErrorSchema,
  },
});

export const loginUserRoute = createRoute({
  method: "post",
  path: "/auth/login/email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginUserRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: registerUserResponse,
        },
      },
      description: "No content",
    },
    422: validationErrorSchema,
    400: badRequestErrorSchema,
  },
});
