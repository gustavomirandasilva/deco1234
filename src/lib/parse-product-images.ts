/** `Product.images` é JSON em texto (ex.: `["https://..."]`). */
export function parseProductImages(raw: string | null | undefined): string[] {
  if (raw == null || String(raw).trim() === "") return [];
  try {
    const v = JSON.parse(String(raw)) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}
