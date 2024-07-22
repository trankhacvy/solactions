import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { and, eq, SQLWrapper } from "drizzle-orm";
import { Token } from "@/types";

export const donationTransactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(schema.createDonationTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { reference, ...rest } = input;

      await ctx.db.insert(schema.reference).values({
        type: "DONATION",
        reference,
      });

      const [transaction] = await ctx.db
        .insert(schema.donationTransaction)
        .values({
          ...rest,
          id: generatePublicId(),
          reference,
          status: "PROCESSING",
          currency: rest.currency as Token,
        })
        .returning();

      return transaction;
    }),

  update: publicProcedure
    .input(schema.updateDonationTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const [transaction] = await ctx.db
        .update(schema.donationTransaction)
        .set({
          ...rest,
          currency: rest.currency as Token,
        })
        .where(eq(schema.donationTransaction.id, id))
        .returning();

      return transaction;
    }),

  getByReference: publicProcedure
    .input(
      z.object({
        reference: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.donationTransaction.findFirst({
        where: (tx, { eq }) => eq(tx.reference, input.reference),
      });
    }),

  getByProfileId: protectedProcedure
    .input(
      z.object({
        profileId: z.string().trim().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filters: SQLWrapper[] = [];

      filters.push(eq(schema.donationTransaction.profileId, input.profileId));
      filters.push(eq(schema.donationTransaction.status, "SUCCESS"));

      return ctx.db.query.donationTransaction.findMany({
        where: and(...filters),
      });
    }),
});
