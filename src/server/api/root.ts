import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { donationRouter } from "./routers/donation";
import { donationTransactionRouter } from "./routers/donation-transaction";
import { referenceRouter } from "./routers/reference";
import { tiplinkRouter } from "./routers/tiplink";
import { talkwithmeRouter } from "./routers/talkwithme";
import { talkWithMeTransactionRouter } from "./routers/talkwithme-transaction";
import { nftDispenserRouter } from "./routers/nft-dispenser";
import { cnftDispenserRouter } from "./routers/c-nft-dispenser";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  donation: donationRouter,
  donationTransaction: donationTransactionRouter,
  reference: referenceRouter,
  tiplink: tiplinkRouter,
  talkwithme: talkwithmeRouter,
  talkwithmeTransactions: talkWithMeTransactionRouter,
  nftDispenser: nftDispenserRouter,
  cnftDispenser: cnftDispenserRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);