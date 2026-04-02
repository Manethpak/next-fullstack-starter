import type { AppHono } from "@/server/main";
import { hc } from "hono/client";

function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.BASE_URL ?? "http://localhost:3000";
}

export const apiClient = hc<AppHono>(getApiBaseUrl());
