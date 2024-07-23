import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import * as schema from "@/db";

export const referenceRouter = createTRPCRouter({
  create: publicProcedure
    .input(schema.createReferenceSchema)
    .mutation(async ({ ctx, input }) => {
      const [reference] = await ctx.db
        .insert(schema.reference)
        .values(input)
        .returning();

      return reference;
    }),

  getByReference: publicProcedure
    .input(
      z.object({
        reference: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.reference.findFirst({
        where: (reference, { eq }) => eq(reference.reference, input.reference),
      });
    }),
});
