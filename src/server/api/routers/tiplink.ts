import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { Token } from "@/types";
import { eq } from "drizzle-orm";

export const tiplinkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createTiplinksSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [link] = await ctx.db
        .insert(schema.tipLink)
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
      return ctx.db.query.tipLink.findFirst({
        where: (link, { eq }) => eq(link.id, input.id),
        with: {
          user: true,
        },
      });
    }),

  mine: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;

    // const result = ctx.db
    //   .select()
    //   .from(schema.tipLink)
    //   .where(eq(schema.tipLink.userId, userId))
    //   .leftJoin(
    //     schema.tipLinkClaim,
    //     eq(schema.tipLink.id, schema.tipLinkClaim.tiplinkId),
    //   );

    // console.log("sql 1: ", result.toSQL());
    // console.log("sql 1: ", await result);

    const result1 = ctx.db.query.tipLink.findMany({
      where: (link, { eq }) => eq(link.userId, userId),
      with: {
        claims: {
          columns: {
            claimant: true,
            note: true
          }
        },
      },
      
    });

    console.log("sql 2: ", result1.toSQL());

    return [] as any;
  }),
});
