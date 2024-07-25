import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/tiplink/*",
        apiPath: "/api/tiplink/*",
      },
      // {
      //   pathPattern: "/nft-dispenser/*",
      //   apiPath: "/api/nft-dispenser/*",
      // },
      {
        pathPattern: "/*",
        apiPath: "/api/profile/*",
      },
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;
