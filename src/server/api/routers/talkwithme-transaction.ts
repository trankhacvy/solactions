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

export const talkWithMeTransactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(schema.createKolTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { reference, ...rest } = input;

      await ctx.db.insert(schema.reference).values({
        type: "TALKWITHME",
        reference,
      });

      const [transaction] = await ctx.db
        .insert(schema.donationTransaction)
        .values({
          ...rest,
          id: generatePublicId(),
          reference,
          currency: rest.currency as Token,
        })
        .returning();
        
      return transaction;
    }),

  update: publicProcedure
    .input(schema.updateKolTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const [transaction] = await ctx.db
        .update(schema.kolTransaction)
        .set({
          ...rest,
          currency: rest.currency as Token,
        })
        .where(eq(schema.kolTransaction.id, id))
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
      return ctx.db.query.kolTransaction.findFirst({
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

      filters.push(eq(schema.kolTransaction.profileId, input.profileId));
      filters.push(eq(schema.kolTransaction.status, "SUCCESS"));

      return ctx.db.query.kolTransaction.findMany({
        where: and(...filters),
      });
    }),
});
