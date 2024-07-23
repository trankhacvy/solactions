import { api } from "@/trpc/server";
import {
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
} from "@solana/actions";

type Params = {
    slug: string;
};


export const GET = async (req: Request, context: { params: Params }) => {

    return Response.json("Hello", {
        headers: ACTIONS_CORS_HEADERS,
    });
}

export const OPTIONS = GET;

export const POST = async (req: Request, context: { params: Params }) => {

}