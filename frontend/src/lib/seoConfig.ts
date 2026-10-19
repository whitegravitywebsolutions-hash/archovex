/**
 * SEO Crawling & Indexing Configuration
 * Currently set to block crawling and indexing across all pages (noindex, nofollow).
 * When ready to enable crawling, set BLOCK_CRAWLERS = false.
 */
export const BLOCK_CRAWLERS = true;

export const DEFAULT_ROBOTS = BLOCK_CRAWLERS ? 'noindex, nofollow' : 'index, follow';

export function getRobotsDirective(seoRobots?: string | null): string {
  if (BLOCK_CRAWLERS) {
    return 'noindex, nofollow';
  }
  return seoRobots || 'index, follow';
}
