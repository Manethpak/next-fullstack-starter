import { AppHono, baseUrl } from "@/server/main";
import { hc } from "hono/client";

export const apiClient = hc<AppHono>(baseUrl);
