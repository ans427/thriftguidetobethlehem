import { useCallback, useEffect, useMemo, useState } from "react";
import { addLocalComment, getLocalComments } from "../lib/localComments";
import { sanityErrorMessage } from "../lib/sanityErrorMessage";
import { sanityClient, sanityWriteClient } from "../lib/sanity";

const commentsQuery = `*[_type == "storeComment" && references($storeId)] | order(_createdAt desc) {
  _id,
  authorName,
  body,
  "photoUrl": photo.asset->url,
  _createdAt
}`;

function normalizeSanityComments(docs) {
  if (!docs?.length) return [];
  return docs.map((c) => ({
    id: c._id,
    authorName: c.authorName?.trim() || "Anonymous",
    body: c.body || "",
    photoUrl: c.photoUrl || "",
    createdAt: c._createdAt,
    source: "sanity"
  }));
}

function normalizeLocalComments(list) {
  if (!list?.length) return [];
  return list.map((c) => ({
    id: c.id,
    authorName: c.authorName || "Anonymous",
    body: c.body || "",
    photoUrl: c.photoUrl || "",
    createdAt: c.createdAt,
    source: "local"
  }));
}

function mergeComments(sanityList, localList) {
  return [...sanityList, ...localList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

async function postCommentViaServer({ storeId, authorName, body, photoDataUrl, photoFilename }) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storeId, authorName, body, photoDataUrl, photoFilename })
  });

  if (!response.ok) {
    let errorText = "Failed to save comment via server API.";
    try {
      const payload = await response.json();
      if (payload?.error) errorText = payload.error;
    } catch {
      // Keep default fallback message
    }
    throw new Error(errorText);
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read selected image file."));
    reader.readAsDataURL(file);
  });
}

export default function StoreComments({ storeId, storeName }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [postedNotice, setPostedNotice] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [mode, setMode] = useState("local");

  const canPostToSanity = Boolean(sanityWriteClient);
  const canUseServerApi =
    typeof window !== "undefined" &&
    (window.location.hostname !== "localhost" || window.location.port !== "5173");

  const loadComments = useCallback(async () => {
    if (!storeId) return;
    if (sanityClient) setLoading(true);
    try {
      let remote = [];
      if (sanityClient) {
        try {
          const docs = await sanityClient.fetch(commentsQuery, { storeId });
          remote = normalizeSanityComments(docs);
        } catch (e) {
          console.error(e);
        }
      }
      const local = normalizeLocalComments(getLocalComments(storeId));
      setComments(mergeComments(remote, local));
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (!postedNotice) return undefined;
    const timer = setTimeout(() => setPostedNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [postedNotice]);

  const hint = useMemo(() => {
    if (canPostToSanity || mode === "server") {
      return "Comments are saved to your Sanity project.";
    }
    return "";
  }, [canPostToSanity, mode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setPostedNotice("");

    const trimmed = body.trim();
    if (trimmed.length < 2) {
      setFormError("Please write a little more (at least 2 characters).");
      return;
    }
    if (trimmed.length > 2000) {
      setFormError("Comment is too long (max 2000 characters).");
      return;
    }

    const submittedName = authorName.trim() || "Anonymous";
    const submittedPhotoUrl = photoPreviewUrl;
    const submittedPhotoFile = photoFile;
    const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimisticComment = {
      id: optimisticId,
      authorName: submittedName,
      body: trimmed,
      ...(submittedPhotoUrl ? { photoUrl: submittedPhotoUrl } : {}),
      createdAt: new Date().toISOString(),
      source: "local"
    };

    // Show immediate feedback so users see their comment instantly.
    setComments((prev) => [optimisticComment, ...prev]);
    setAuthorName("");
    setBody("");
    setPhotoFile(null);
    setPhotoPreviewUrl("");
    setSubmitting(true);

    try {
      if (sanityWriteClient && !submittedPhotoUrl) {
        const doc = {
          _type: "storeComment",
          store: { _type: "reference", _ref: storeId },
          body: trimmed
        };
        const name = submittedName === "Anonymous" ? "" : submittedName;
        if (name) doc.authorName = name;

        await sanityWriteClient.create(doc);
        setMode("sanity-client");
        await loadComments();
      } else if (canUseServerApi) {
        const photoDataUrl = submittedPhotoFile
          ? await readFileAsDataUrl(submittedPhotoFile)
          : "";
        await postCommentViaServer({
          storeId,
          authorName: submittedName,
          body: trimmed,
          photoDataUrl,
          photoFilename: submittedPhotoFile?.name || ""
        });
        setMode("server");
        await loadComments();
      } else {
        addLocalComment(storeId, {
          authorName: submittedName,
          body: trimmed,
          photoUrl: submittedPhotoUrl
        });
        setMode("local");
        await loadComments();
      }
      setPostedNotice("Comment posted.");
    } catch (err) {
      console.error(err);
      setComments((prev) => prev.filter((c) => c.id !== optimisticId));
      setAuthorName(submittedName === "Anonymous" ? "" : submittedName);
      setBody(trimmed);
      setPhotoFile(submittedPhotoFile || null);
      setPhotoPreviewUrl(submittedPhotoUrl || "");
      if (canUseServerApi) {
        setFormError(`Could not save that comment. ${sanityErrorMessage(err)}`);
      } else {
        addLocalComment(storeId, {
          authorName: submittedName,
          body: trimmed,
          photoUrl: submittedPhotoUrl
        });
        setMode("local");
        await loadComments();
        setAuthorName("");
        setBody("");
        setPhotoFile(null);
        setPhotoPreviewUrl("");
        setPostedNotice("Comment posted on this browser.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const headingId = `comments-heading-${storeId?.replace(/[^a-z0-9-]/gi, "") || "store"}`;

  return (
    <section className="card store-comments" aria-labelledby={headingId}>
      <h2 id={headingId}>Visitor comments{storeName ? ` · ${storeName}` : ""}</h2>
      {hint && <p className="section-hint comments-hint">{hint}</p>}

      {loading && <p className="muted">Loading comments…</p>}

      {!loading && comments.length === 0 && (
        <p className="muted">No comments yet. Be the first to share a tip or review.</p>
      )}

      {comments.length > 0 && (
        <ul className="comments-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-meta">
                <span className="comment-author">{c.authorName}</span>
                <time className="comment-date" dateTime={c.createdAt}>
                  {new Date(c.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </time>
              </div>
              <p className="comment-body">{c.body}</p>
              {c.photoUrl && (
                <img
                  src={c.photoUrl}
                  alt={`Shared by ${c.authorName}`}
                  className="comment-photo"
                  loading="lazy"
                />
              )}
              {c.source === "local" && mode === "local" && (
                <span className="comment-badge">This device</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit} noValidate>
        <h3 className="subheading">Add a comment</h3>
        <div className="comment-fields">
          <label className="comment-label">
            Name <span className="optional">(optional)</span>
            <input
              type="text"
              name="authorName"
              maxLength={80}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Alex"
              autoComplete="nickname"
            />
          </label>
          <label className="comment-label">
            Comment
            <textarea
              name="body"
              required
              rows={4}
              maxLength={2000}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Parking tips, best days to visit, sizing, what to look for…"
            />
          </label>
          <label className="comment-label">
            Photo of your find <span className="optional">(optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setPhotoFile(null);
                  setPhotoPreviewUrl("");
                  return;
                }
                if (file.size > 6 * 1024 * 1024) {
                  setFormError("Photo is too large. Please choose an image under 6MB.");
                  e.target.value = "";
                  return;
                }
                try {
                  const preview = await readFileAsDataUrl(file);
                  setPhotoFile(file);
                  setPhotoPreviewUrl(preview);
                } catch (previewErr) {
                  console.error(previewErr);
                  setFormError("Could not preview that image. Try another file.");
                }
              }}
            />
          </label>
          {photoPreviewUrl && (
            <div className="comment-photo-preview-wrap">
              <img src={photoPreviewUrl} alt="Selected upload preview" className="comment-photo-preview" />
              <button
                type="button"
                className="hero-btn hero-btn--ghost"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreviewUrl("");
                }}
              >
                Remove photo
              </button>
            </div>
          )}
        </div>
        {formError && (
          <p className="status-note warning" role="alert">
            {formError}
          </p>
        )}
        {postedNotice && (
          <p className="status-note success" role="status">
            {postedNotice}
          </p>
        )}
        <button type="submit" className="comment-submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>
    </section>
  );
}
