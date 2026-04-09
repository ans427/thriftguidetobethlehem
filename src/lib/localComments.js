const STORAGE_KEY = "thrift-guide-store-comments-v1";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLocalComments(storeId) {
  if (!storeId) return [];
  const all = readAll();
  return Array.isArray(all[storeId]) ? all[storeId] : [];
}

export function addLocalComment(storeId, { authorName, body, photoUrl }) {
  if (!storeId) return [];
  const all = readAll();
  const list = Array.isArray(all[storeId]) ? [...all[storeId]] : [];
  const entry = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorName: authorName?.trim() || "Anonymous",
    body: body.trim(),
    ...(photoUrl ? { photoUrl } : {}),
    createdAt: new Date().toISOString(),
    source: "local"
  };
  list.push(entry);
  all[storeId] = list;
  writeAll(all);
  return list;
}
