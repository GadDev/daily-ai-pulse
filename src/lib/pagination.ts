export const CATEGORY_PAGE_SIZE = 12;
export type ArchiveOrder = 'latest' | 'oldest';
export function pageCount(total: number) {
  return Math.max(1, Math.ceil(total / CATEGORY_PAGE_SIZE));
}
export function archivePath(
  base: string,
  category: string,
  locale: 'en' | 'fr',
  page = 1,
  order: ArchiveOrder = 'latest',
) {
  return `${base}${locale === 'fr' ? 'fr/' : ''}${category}/${order === 'oldest' ? 'oldest/' : ''}${page > 1 ? `${page}/` : ''}`;
}
export function archivePages(total: number) {
  return (['latest', 'oldest'] as const).flatMap((order) =>
    Array.from({ length: pageCount(total) }, (_, i) => ({
      params: {
        page:
          `${order === 'oldest' ? 'oldest/' : ''}${i ? i + 1 : ''}`.replace(/\/$/, '') || undefined,
      },
      props: { currentPage: i + 1, order },
    })),
  );
}
export function sortArchive<T extends { id: string; data: { date: Date } }>(
  stories: T[],
  order: ArchiveOrder,
) {
  const latest = [...stories].sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return order === 'oldest' ? latest.reverse() : latest;
}
export function pageNumbers(current: number, total: number): (number | 'gap')[] {
  const pages = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((n) => n > 0 && n <= total)
    .sort((a, b) => a - b);
  return pages.flatMap((n, i) => (i && n - pages[i - 1] > 1 ? ['gap', n] : [n])) as (
    number | 'gap'
  )[];
}
