import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db";

import { env } from "@/env";

const client = postgres(env.DATABASE_URL, { prepare: false });

export const drizzleDb = drizzle(client, { schema });
