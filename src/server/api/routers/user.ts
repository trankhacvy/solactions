import { createTRPCRouter } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // create: publicProcedure
  //   .input(schema.createUserSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const result = await ctx.db
  //       .insert(schema.users)
  //       .values({
  //         id: generatePublicId(),
  //         ...input,
  //         acceptToken: input.acceptToken as Token,
  //       })
  //       .returning();
  //     return result[0]!;
  //   }),
  // update: protectedProcedure
  //   .input(schema.updateUserSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const [model] = await ctx.db
  //       .update(schema.users)
  //       .set({
  //         ...input,
  //         acceptToken: input.acceptToken as Token,
  //       })
  //       .where(eq(schema.users.id, ctx.session.user.id))
  //       .returning();
  //     return model;
  //   }),
  // updateV2: protectedProcedure
  //   .input(schema.updateUserSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const [model] = await ctx.db
  //       .update(schema.users)
  //       .set({
  //         ...input,
  //         acceptToken: input.acceptToken as Token,
  //       })
  //       .where(eq(schema.users.id, ctx.session.user.id))
  //       .returning();
  //     return model;
  //   }),
  // getById: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().trim().min(1),
  //     }),
  //   )
  //   .query(({ ctx, input }) => {
  //     return ctx.db.query.users.findFirst({
  //       where: (user, { eq }) => eq(user.id, input.id),
  //     });
  //   }),
  // getBySlug: publicProcedure
  //   .input(
  //     z.object({
  //       slug: z.string().trim().min(1),
  //     }),
  //   )
  //   .query(({ ctx, input }) => {
  //     return ctx.db.query.users.findFirst({
  //       where: (user, { eq }) => eq(user.slug, input.slug),
  //     });
  //   }),
  // getByWallet: publicProcedure
  //   .input(
  //     z.object({
  //       wallet: z.string().trim().min(1),
  //     }),
  //   )
  //   .query(({ ctx, input }) => {
  //     return ctx.db.query.users.findFirst({
  //       where: (user, { eq }) => eq(user.wallet, input.wallet),
  //     });
  //   }),
  // all: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.users.findMany({
  //     orderBy: (users, { asc }) => [asc(users.createdAt)],
  //   });
  // }),
});
