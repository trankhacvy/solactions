import { SigninMessage } from "@/lib/signin-message";

import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { drizzleDb } from "./db";
import * as schema from "@/db/schema";
import { generatePublicId } from "@/utils/nano-id";
import { SelectUser } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
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

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user) {
        token.user = user as SelectUser;
      }

      return token;
    },

    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...(token.user ?? {}),
        },
      };
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
