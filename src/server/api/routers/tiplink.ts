import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { SQLWrapper, and, eq } from "drizzle-orm";
import { Token } from "@/types";

export const tiplinkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createTiplinksSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [link] = await ctx.db
        .insert(schema.tipLinks)
        .values({
          id: generatePublicId(),
          userId,
          ...input,
          token: input.token as Token,
        })
        .returning();

      return link!;
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.tipLinks.findFirst({
        where: (link, { eq }) => eq(link.id, input.id),
        with: {
          user: true,
        },
      });
    }),

  all: protectedProcedure.query(({ ctx, input }) => {
    const userId = ctx.session.user.id;

    const filters: SQLWrapper[] = [];

    filters.push(eq(schema.donationTransactions.userId, userId));

    return ctx.db.query.tipLinks.findMany({
      where: and(...filters),
    });
  }),
});
