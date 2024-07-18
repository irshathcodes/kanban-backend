import { z } from "@hono/zod-openapi";

const ErrorSchema = z.object({
  message: z.string().openapi({
    example: "Bad Request",
  }),
});

export const validationErrorSchema = {
  content: {
    "application/json": {
      schema: ErrorSchema,
    },
  },
  description: "Retrieve the user",
};
