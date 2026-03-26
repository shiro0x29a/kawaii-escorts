/**
 * Преобразует относительный путь к изображению в полный URL
 */
export function getAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `/api${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Разбивает массив на страницы
 */
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}
