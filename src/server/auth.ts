import { SigninMessage } from "@/lib/signin-message";

import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { drizzleDb } from "./db";
import * as schema from "@/db";
import { generatePublicId } from "@/utils/nano-id";
import { SelectUser } from "@/types";
import { appendAddress } from "@/lib/helius";
import { env } from "@/env";
import { eq } from "drizzle-orm";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

console.log("VERCEL_DEPLOYMENT", VERCEL_DEPLOYMENT);

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: DrizzleAdapter(drizzleDb, {
    usersTable: schema.usersV2,
  }),
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      profile: (profile) => ({
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: ((profile.profile_image_url_https as string) ?? "").replace(
          "_normal",
          "",
        ),
        screen_name: profile.screen_name,
        emailVerified: profile.verified,
        description: profile.description,
      }),
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}"),
          );

          //   const nextAuthUrl = new URL(env.NEXTAUTH_URL);
          //   if (signinMessage.domain !== nextAuthUrl.host) {
          //     return null;
          //   }

          //   if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
          //     return null;
          //   }

          const validationResult = await signinMessage.validate(
            credentials?.signature || "",
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          let existingUser = await drizzleDb.query.users.findFirst({
            where: (user, { eq }) => eq(user.wallet, signinMessage.publicKey),
          });

          if (!existingUser) {
            const wallet = signinMessage.publicKey;
            const id = generatePublicId();

            const results = await drizzleDb
              .insert(schema.users)
              .values({
                id,
                wallet,
                avatar: `https://api.multiavatar.com/${wallet}.png`,
                slug: id,
              })
              .returning();

            await appendAddress(wallet);

            return results[0] as unknown as SelectUser;
          }

          return existingUser as unknown as SelectUser;
        } catch (error: any) {
          console.error(error);
          throw new Error(error?.message ?? "Unknown error");
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        // domain: VERCEL_DEPLOYMENT ? `.solactions-mu.vercel.app` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // console.log("[signIn] user", user);
      // console.log("[signIn] account", account);
      // console.log("[signIn] profile", profile);

      if (!user.email) return false;

      if (account?.provider === "twitter") {
        let existingUser = await drizzleDb.query.usersV2.findFirst({
          where: (users, { eq }) => eq(users.email, user.email!),
        });

        if (!existingUser || !profile) return true;

        // console.log("check exist existingUser", existingUser);

        // if the user already exists via email,
        // update the user with their name and image
        if (existingUser && profile) {
          // @ts-ignore
          const profilePic = profile.profile_image_url_https;
          // @ts-ignore
          const description = profile.description;
          // @ts-ignore
          const screen_name = profile.screen_name;

          const shouldUpdate =
            !existingUser.name ||
            !existingUser.image ||
            !existingUser.description ||
            !existingUser.screen_name;

          if (shouldUpdate) {
            await await drizzleDb
              .update(schema.usersV2)
              .set({
                ...(!existingUser.name && { name: profile.name }),
                ...(!existingUser.image && { avatar: profilePic }),
                ...(!existingUser.description && { bio: description }),
                ...(!existingUser.screen_name && { screen_name }),
              })
              .where(eq(schema.usersV2.email, existingUser.email!))
              .returning();
          }
        }
      }

      return true;
    },
    async jwt({ token, user, session, trigger }) {
      // console.log("[jwt]: token ", token);
      // console.log("[jwt]: user ", user);
      // console.log("[jwt]: session ", session);
      // console.log("[jwt]: trigger ", trigger);

      if (trigger === "update") {
        // console.log("[jwt]: token ", token);
        // console.log("[jwt]: user ", user);
        // console.log("[jwt]: session ", session);
        // console.log("[jwt]: trigger ", trigger);

        if (session?.wallet && session?.id) {
          let userToUpdate = await drizzleDb.query.usersV2.findFirst({
            where: (users, { eq }) => eq(users.id, session.id),
          });

          if (!userToUpdate) return token;

          const [updatedUser] = await drizzleDb
            .update(schema.usersV2)
            .set({
              wallet: session.wallet,
              isNewUser: false,
            })
            .where(eq(schema.usersV2.id, session.id))
            .returning();

          await appendAddress(session.wallet);

          token.user = updatedUser as unknown as SelectUser;
        }
      }

      if (user) {
        token.user = user as SelectUser;
      }

      return token;
    },
    session({ session, token, user }) {
      console.log("[session] session: ", session);
      console.log("[session] token: ", token);
      console.log("[session] user: ", user);
      return {
        ...session,
        user: {
          ...(token || session).user,
        },
      };
    },
  },
  events: {},
};

export const getServerAuthSession = () => getServerSession(authOptions);
