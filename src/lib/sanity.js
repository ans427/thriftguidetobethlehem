import { createClient } from "@sanity/client";

const projectId = (import.meta.env.VITE_SANITY_PROJECT_ID || "").trim();
const dataset = (import.meta.env.VITE_SANITY_DATASET || "production").trim();
const apiVersion = (import.meta.env.VITE_SANITY_API_VERSION || "2025-01-01").trim();
const readToken = (import.meta.env.VITE_SANITY_API_READ_TOKEN || "").trim();
const writeToken = (import.meta.env.VITE_SANITY_API_WRITE_TOKEN || "").trim();

export const hasSanityEnv = Boolean(projectId);

export const sanityClient = hasSanityEnv
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Private datasets need a read token; CDN + token is not recommended.
      useCdn: !readToken,
      ...(readToken ? { token: readToken } : {})
    })
  : null;

/** Only set for posting comments from the browser; use a token with minimal rights. */
export const sanityWriteClient =
  hasSanityEnv && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: writeToken,
        useCdn: false
      })
    : null;

if (import.meta.env.DEV && writeToken) {
  const okPrefix = writeToken.startsWith("sk");
  if (!okPrefix || writeToken.length < 80) {
    console.warn(
      "[Sanity] VITE_SANITY_API_WRITE_TOKEN should be a project API token starting with sk and copied in full from Manage → API → Tokens."
    );
  } else {
    console.info(`[Sanity] Write token loaded (${writeToken.length} chars).`);
  }
}
