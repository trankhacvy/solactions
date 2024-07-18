import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import * as schema from "@/db";
import { SQLWrapper, and, eq, inArray } from "drizzle-orm";

export const transactionRouter = createTRPCRouter({
  updateByReference: publicProcedure
    .input(schema.updateTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { reference, ...rest } = input;
      return ctx.db
        .update(schema.transaction)
        .set(rest)
        .where(eq(schema.transaction.reference, input.reference!));
    }),

  getPendingTransactionByReference: publicProcedure
    .input(
      z.object({
        addresses: z.array(z.string()),
      }),
    )
    .query(({ ctx, input }) => {
      const filters: SQLWrapper[] = [];

      filters.push(eq(schema.transaction.status, "PROCESSING"));
      filters.push(inArray(schema.transaction.reference, input.addresses));

      return ctx.db.query.transaction.findMany({
        where: and(...filters),
      });
    }),
});
