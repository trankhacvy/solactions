import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { eq } from "drizzle-orm";

export const talkwithmeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.createKolProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;

      const [profile] = await ctx.db
        .insert(schema.kolProfile)
        .values({
          id: generatePublicId(),
          ...input,
          userId,
        })
        .returning();

      return profile;
    }),

  update: protectedProcedure
    .input(schema.updateKolProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const [profile] = await ctx.db
        .update(schema.kolProfile)
        .set(rest as any)
        .where(eq(schema.kolProfile.id, id))
        .returning();

      return profile;
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.kolProfile.findFirst({
      where: (profile, { eq }) => eq(profile.userId, ctx.session.user.id),
    });
  }),

  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().trim().min(1),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.kolProfile.findFirst({
        where: (profile, { eq }) => eq(profile.slug, input.slug),
      });
    }),
});
