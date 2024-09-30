import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { and, eq, SQLWrapper } from "drizzle-orm";

export const nftDispenserRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createNFTDispenserSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;

      const [dispenser] = await ctx.db
        .insert(schema.nftDispenser)
        .values({
          id: generatePublicId(),
          ...input,
          userId,
          royalty: String(input.royalty),
        })
        .returning();

      return dispenser;
    }),

  update: protectedProcedure
    .input(schema.updateNFTDispenerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, royalty, ...rest } = input;

      const [profile] = await ctx.db
        .update(schema.nftDispenser)
        .set({
          ...rest,
          royalty: String(royalty),
        })
        .where(eq(schema.nftDispenser.id, id))
        .returning();

      return profile;
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.nftDispenser.findFirst({
        where: (dispenser, { eq }) => eq(dispenser.id, input.id),
      });
    }),

  mine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const filters: SQLWrapper[] = [];

    filters.push(eq(schema.nftDispenser.userId, userId));
    // filters.push(eq(schema.tipLink.status, "SUCCESS"));

    return ctx.db.query.nftDispenser.findMany({
      where: and(...filters),
    });
  }),
});