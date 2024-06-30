import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import * as schema from "@/db/schema";
import { generatePublicId } from "@/utils/nano-id";
import { SQLWrapper, and, eq, inArray } from "drizzle-orm";
import { Token } from "@/types";

export const donationRouter = createTRPCRouter({
  createNew: publicProcedure
    .input(schema.createDonationTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(schema.donationTransactions)
        .values({
          id: generatePublicId(),
          ...input,
          currency: input.currency as Token,
        })
        .returning();

      return result[0]!;
    }),

  updateByReference: publicProcedure
    .input(schema.updateDonationTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.donationTransactions)
        .set({
          ...input,
          currency: input.currency as Token,
        })
        .where(eq(schema.donationTransactions.reference, input.reference!));
    }),

  getPendingTransaction: publicProcedure
    .input(
      z.object({
        receiver: z.string(),
        addresses: z.array(z.string()),
      }),
    )
    .query(({ ctx, input }) => {
      const filters: SQLWrapper[] = [];

      filters.push(eq(schema.donationTransactions.status, "PROCESSING"));
      filters.push(
        inArray(schema.donationTransactions.reference, input.addresses),
      );

      return ctx.db.query.donationTransactions.findMany({
        where: and(...filters),
      });
    }),

  getUserDonations: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const filters: SQLWrapper[] = [];

      filters.push(eq(schema.donationTransactions.status, "SUCCESS"));
      filters.push(eq(schema.donationTransactions.receiver, input.wallet));

      return ctx.db.query.donationTransactions.findMany({
        where: and(...filters),
      });
    }),
});
