import { z } from "@hono/zod-openapi";

const ErrorSchema = z.object({
  message: z.string().openapi({}),
});

export const validationErrorSchema = {
  content: {
    "application/json": {
      schema: ErrorSchema,
    },
  },
  description: "Gives you validation errors",
};

export const badRequestErrorSchema = {
  content: {
    "application/json": {
      schema: ErrorSchema,
    },
  },
  description: "",
};
