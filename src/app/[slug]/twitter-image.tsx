import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const runtime = process.env.VERCEL ? "edge" : "node";

export const alt = "SolActions";

export const size = {
  width: 800,
  height: 418,
};

export const contentType = "image/png";

type Props = {
  params: {
    slug: string;
  };
};

export default async function Image({ params }: Props) {
  const { slug } = params;

  const user = await api.user.getBySlug({ slug });

  if (!user) {
    notFound();
  }

  const fontData = await fetch(
    "https://euchmlalaurbsxwdhsix.supabase.co/storage/v1/object/public/3links/assets/SansPosterBold.ttf",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "nowrap",
          backgroundColor: "white",
          fontFamily: "SansPosterBold",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            flex: "1",
            padding: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            SolActions
          </h2>
          <p
            style={{
              fontSize: "18px",
              marginBottom: "40px",
            }}
          >
            No-Code Actions on Solana
          </p>

          <p
            style={{
              fontSize: "14px",
              marginTop: "20px",
            }}
          >
            Install Phantom, Backpack, or Solflare wallet to see the action on
            Twitter
          </p>
        </div>

        <div
          style={{
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div tw="flex w-full max-w-sm flex-1 flex-col overflow-hidden bg-white shadow-md">
            <div tw="flex justify-center overflow-hidden rounded-lg p-4">
              <div tw="apsect-square flex w-full items-center justify-center rounded-lg bg-gray-100">
                <img
                  src={user.avatar ?? ""}
                  alt={user.name ?? ""}
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
            </div>

            <div tw="flex flex-col items-start justify-start gap-0 px-4">
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  fontSize: "24px",
                  textAlign: "left",
                }}
              >
                {user.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      emoji: "twemoji",
      fonts: [
        {
          name: "SansPosterBold",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
