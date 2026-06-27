import { unstable_cache } from "next/cache";

import { CATALOG_REVALIDATE_SECONDS } from "./config";

async function requestClientUserId(): Promise<string> {
  const { fetchClientUserIdUncached } = await import("./client");
  try {
    return await fetchClientUserIdUncached();
  } catch (error) {
    console.error("AdvantShop client session init failed:", error);
    throw error;
  }
}

export const getCachedClientUserId = unstable_cache(
  requestClientUserId,
  ["advantshop-client-user-id"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["advantshop-session"] }
);
