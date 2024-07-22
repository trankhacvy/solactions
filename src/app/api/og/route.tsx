import { env } from "@/env";
import { api } from "@/trpc/server";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ReactElement } from "react";

const sizes = {
  tiplink: {
    width: 600,
    height: 600,
  },
};

enum OgType {
  Tiplink = "tiplink",
}

const OG_ASSETS = {
  tiplinkBg:
    "https://ohgiavehhugheqqpoysy.supabase.co/storage/v1/object/public/3links/assets/tiplink.jpeg",
};

export const runtime = env.NODE_ENV === "development" ? "nodejs" : "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const type = searchParams.get("type") as OgType;

  const font = await getFont();

  if (type === OgType.Tiplink) {
    return tiplinkOgImageHandler(request, font);
  }

  return new ImageResponse(NotFoundImage, {
    ...sizes.tiplink,
    fonts: [
      {
        name: "Inter Medium",
        data: font,
      },
    ],
  });
}

async function getFont() {
  // let fontData;

  // if (env.NODE_ENV === "development") {
  //   fontData = await fetch(
  //     "https://euchmlalaurbsxwdhsix.supabase.co/storage/v1/object/public/3links/assets/SansPosterBold.ttf",
  //   ).then((res) => res.arrayBuffer());
  // } else {
  //   fontData = await fetch(
  //     new URL("@/styles/Satoshi-Bold.ttf", import.meta.url),
  //   ).then((res) => res.arrayBuffer());
  // }

  const fontData = await fetch(
    "https://euchmlalaurbsxwdhsix.supabase.co/storage/v1/object/public/3links/assets/SansPosterBold.ttf",
  ).then((res) => res.arrayBuffer());

  return fontData;
}

async function tiplinkOgImageHandler(
  request: NextRequest,
  font: Buffer | ArrayBuffer,
): Promise<ImageResponse> {
  const searchParams = request.nextUrl.searchParams;
  const tiplinkId = searchParams.get("id") as string;

  const tiplink = await api.tiplink.getById({ id: tiplinkId });

  if (!tiplink) {
    return new ImageResponse(NotFoundImage, {
      ...sizes.tiplink,
      fonts: [
        {
          name: "Inter Medium",
          data: font,
        },
      ],
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "column",
          flexWrap: "nowrap",
          backgroundColor: "white",
          fontFamily: "Inter Medium",
          backgroundImage: `url(${OG_ASSETS.tiplinkBg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2
          style={{
            fontSize: "64px",
            fontWeight: "extrabold",
            color: "black",
          }}
        >
          {tiplink.amount} {tiplink.token?.symbol}
        </h2>
      </div>
    ),
    {
      ...sizes.tiplink,
      fonts: [
        {
          name: "Inter Medium",
          data: font,
        },
      ],
    },
  );
}

const NotFoundImage = (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "flex-end",
      flexDirection: "column",
      flexWrap: "nowrap",
      backgroundColor: "white",
      fontFamily: "Inter Medium",
      backgroundImage: `url(${OG_ASSETS.tiplinkBg})`,
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
    }}
  >
    <h2
      style={{
        fontSize: "64px",
        fontWeight: "extrabold",
        color: "black",
      }}
    >
      Not Found
    </h2>
  </div>
) as ReactElement;
