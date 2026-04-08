/** Pull a useful message from @sanity/client errors for UI + debugging. */
export function sanityErrorMessage(err) {
  if (!err) return "Unknown error.";

  if (typeof err.message === "string" && err.message.length > 0) {
    const m = err.message;
    // Sanity sets this message + manage URL when the browser origin is not allowed
    if (err.name === "CorsOriginError" || /not allowed to connect to the Live Content API/i.test(m)) {
      return m;
    }
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(m)) {
      return `${m} In https://www.sanity.io/manage → your project → API → CORS origins, add http://localhost:5173 (and save).`;
    }
    if (/unauthorized|session not found/i.test(m)) {
      return `${m} Create a new token on this project: Manage → project ${import.meta.env.VITE_SANITY_PROJECT_ID || ""} → API → Tokens → Add API token → role Editor (not Viewer). Paste the full sk… string on one line in .env as VITE_SANITY_API_WRITE_TOKEN, then restart npm run dev.`;
    }
    return m;
  }

  if (err.responseBody && typeof err.responseBody === "string") {
    return err.responseBody.slice(0, 500);
  }

  return String(err);
}
