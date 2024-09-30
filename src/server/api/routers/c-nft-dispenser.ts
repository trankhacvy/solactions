import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { and, eq, SQLWrapper } from "drizzle-orm";

export const cnftDispenserRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createCNFTDispenserSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;

      const [dispenser] = await ctx.db
        .insert(schema.cnftDispenser)
        .values({
          id: generatePublicId(),
          ...input,
          userId,
          royalty: String(input.royalty),
          max_depth: String(input.max_depth),
          max_buffer_size: String(input.max_buffer_size),
          canopy_depth: String(input.canopy_depth),
        })
        .returning();

      return dispenser;
    }),

  update: protectedProcedure
    .input(schema.updateCNFTDispenserSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, royalty, max_depth, max_buffer_size, canopy_depth, ...rest } = input;

      const [profile] = await ctx.db
        .update(schema.cnftDispenser)
        .set({
          ...rest,
          royalty: String(royalty),
          max_depth: String(max_depth),
          max_buffer_size: String(max_buffer_size),
          canopy_depth: String(canopy_depth)
        })
        .where(eq(schema.cnftDispenser.id, id))
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
      return ctx.db.query.cnftDispenser.findFirst({
        where: (dispenser, { eq }) => eq(dispenser.id, input.id),
      });
    }),

  mine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const filters: SQLWrapper[] = [];

    filters.push(eq(schema.cnftDispenser.userId, userId));
    // filters.push(eq(schema.tipLink.status, "SUCCESS"));

    return ctx.db.query.cnftDispenser.findMany({
      where: and(...filters),
    });
  }),
});
