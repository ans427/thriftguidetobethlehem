import { createClient } from "@sanity/client";

const projectId = (process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "").trim();
const dataset = (process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production").trim();
const apiVersion = (process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || "2025-01-01").trim();
const writeToken = (process.env.SANITY_WRITE_TOKEN || process.env.VITE_SANITY_API_WRITE_TOKEN || "").trim();

const client =
  projectId && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: writeToken,
        useCdn: false
      })
    : null;

function parseDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || "");
  if (!match) return null;
  const [, mimeType, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  return { mimeType, buffer };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!client) {
    const missing = [];
    if (!projectId) missing.push("SANITY_PROJECT_ID (or VITE_SANITY_PROJECT_ID)");
    if (!writeToken) missing.push("SANITY_WRITE_TOKEN (or VITE_SANITY_API_WRITE_TOKEN)");
    return res.status(500).json({
      error: `Server comment API is not configured. Missing: ${missing.join(", ")}.`
    });
  }

  const { storeId, authorName, body, photoDataUrl, photoFilename } = req.body || {};
  const text = typeof body === "string" ? body.trim() : "";
  const name = typeof authorName === "string" ? authorName.trim() : "";

  if (!storeId || typeof storeId !== "string") {
    return res.status(400).json({ error: "storeId is required." });
  }
  if (text.length < 2 || text.length > 2000) {
    return res.status(400).json({ error: "Comment must be between 2 and 2000 characters." });
  }

  try {
    const doc = {
      _type: "storeComment",
      store: { _type: "reference", _ref: storeId },
      body: text
    };
    if (name) doc.authorName = name.slice(0, 80);
    if (photoDataUrl) {
      const parsed = parseDataUrl(photoDataUrl);
      if (!parsed) {
        return res.status(400).json({ error: "Photo must be a valid image data URL." });
      }
      if (parsed.buffer.length > 6 * 1024 * 1024) {
        return res.status(400).json({ error: "Photo is too large. Please keep it under 6MB." });
      }

      const sanitizedName =
        typeof photoFilename === "string" && photoFilename.trim()
          ? photoFilename.trim().replace(/[^a-zA-Z0-9._-]/g, "_")
          : `comment-photo-${Date.now()}.jpg`;

      const asset = await client.assets.upload("image", parsed.buffer, {
        filename: sanitizedName,
        contentType: parsed.mimeType
      });
      doc.photo = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id }
      };
    }

    const created = await client.create(doc);
    return res.status(201).json({
      ok: true,
      id: created?._id || null
    });
  } catch (error) {
    const message = error?.message || "Failed to create comment.";
    return res.status(error?.statusCode || 500).json({ error: message });
  }
}
