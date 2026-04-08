export function storePath(shop) {
  const slug = shop.slug?.current;
  if (slug) return `/stores/${encodeURIComponent(slug)}`;
  if (shop._id) return `/stores/${encodeURIComponent(shop._id)}`;
  return "/";
}
