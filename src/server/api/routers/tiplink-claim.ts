import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";

export const tiplinkClaimRouter = createTRPCRouter({
  create: publicProcedure
    .input(schema.createTiplinkClaimSchema)
    .mutation(async ({ ctx, input }) => {
      const { reference, ...rest } = input;

      const txId = generatePublicId();

      await ctx.db.insert(schema.transaction).values({
        id: txId,
        status: "PROCESSING",
        reference,
      });

      const [transaction] = await ctx.db
        .insert(schema.tipLinkClaim)
        .values({
          id: generatePublicId(),
          txId,
          ...rest,
        })
        .returning();

      return transaction;
    }),

  //   getUserDonations: publicProcedure
  //     .input(
  //       z.object({
  //         id: z.string(),
  //       }),
  //     )
  //     .query(async ({ ctx, input }) => {
  //       const result = (
  //         await ctx.db
  //           .select()
  //           .from(schema.donationTransaction)
  //           .where(eq(schema.donationTransaction.profileId, input.id))
  //           .leftJoin(
  //             schema.transaction,
  //             // TODO
  //             eq(schema.transaction.id, schema.donationTransaction.txId),
  //           )
  //       )
  //         .filter((item) => item.transaction?.status === "SUCCESS")
  //         .map((item) => item.donation_transaction);

  //       return result;
  //     }),
});
