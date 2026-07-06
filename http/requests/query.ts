export function toQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const value = search.toString();
  return value ? `?${value}` : "";
}

export function pathSegment(value: string) {
  return encodeURIComponent(value);
}
