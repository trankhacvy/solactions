import { ImageResponse } from "next/og";

const size = {
  width: 1200,
  height: 630,
};

export async function GET() {
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
                  src="https://api.multiavatar.com/5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr.png"
                  alt="Vincenzo"
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
                Vincenzo
              </p>
              <p
                style={{
                  fontSize: "24px",
                  textAlign: "left",
                }}
              >
                Make love not war
              </p>
            </div>
          </div>
        </div>

        {/* <div className="flex w-full max-w-sm flex-1 flex-col overflow-hidden bg-white shadow-md">
          <div className="flex justify-center overflow-hidden rounded-lg p-4">
            <div className="apsect-square flex w-full items-center justify-center rounded-lg bg-gray-100">
              <img
                src="https://api.multiavatar.com/5AHKzmDcjeAAnafTivi5u7dWYw3jUQh2VBRDzSd9ztVr.png"
                alt="Vincenzo"
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-start justify-start gap-0 px-4">
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              Vincenzo
            </p>
            <p
              style={{
                fontSize: "24px",
                textAlign: "left",
              }}
            >
              Make love not war
            </p>
          </div>
        </div> */}
      </div>
    ),
    {
      ...size,
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
