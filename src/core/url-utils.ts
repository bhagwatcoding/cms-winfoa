import { env } from '@/config/env';

/**
 * Returns the full base URL for a given subdomain.
 * @param subdomain The subdomain (e.g., "auth", "god"). If omitted or "www", returns the root domain.
 * @returns The full URL (e.g., "http://god.localhost:3000" or "https://god.winfoa.com")
 */
export function getBaseUrl(subdomain?: string) {
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
  const protocol = env.NODE_ENV === 'production' ? 'https' : 'http';

  if (!subdomain || subdomain === 'www' || subdomain === 'root') {
    return `${protocol}://${rootDomain}`;
  }

  return `${protocol}://${subdomain}.${rootDomain}`;
}
