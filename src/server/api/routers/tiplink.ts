import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { Token } from "@/types";
import { and, eq, SQLWrapper } from "drizzle-orm";
import dayjs from "dayjs";

export const tiplinkRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createTiplinksSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const [link] = await ctx.db
        .insert(schema.tipLink)
        .values({
          ...input,
          id: generatePublicId(),
          userId,
          token: input.token as Token,
          expiredAt: dayjs().add(30, "day").toDate(),
        })
        .returning();

      return link!;
    }),

  update: publicProcedure
    .input(schema.updateTiplinksSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      if (rest.reference) {
        await ctx.db.insert(schema.reference).values({
          type: "TIPLINK",
          reference: rest.reference,
        });
      }

      const [tiplink] = await ctx.db
        .update(schema.tipLink)
        .set({
          ...rest,
          token: rest.token as Token,
        })
        .where(eq(schema.tipLink.id, id))
        .returning();

      return tiplink;
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

  getByReference: publicProcedure
    .input(
      z.object({
        reference: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.tipLink.findFirst({
        where: (tipLink, { eq }) => eq(tipLink.reference, input.reference),
      });
    }),

  mine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const filters: SQLWrapper[] = [];

    filters.push(eq(schema.tipLink.userId, userId));
    // filters.push(eq(schema.tipLink.status, "SUCCESS"));

    return ctx.db.query.tipLink.findMany({
      where: and(...filters),
    });
  }),
});
