import { env } from './env';
import { SUBDOMAIN_CONFIG } from './subdomains';

const ROOT_DOMAIN = env.NEXT_PUBLIC_ROOT_DOMAIN;
const IS_PROD = env.NODE_ENV === 'production';

export const SITE = {
  NAME: 'Winfoa',
  DESCRIPTION: 'Modern Multi-Tenant Education Portal',
  VERSION: '1.0.0',
  // Dynamic URL construction
  URL: IS_PROD ? `https://${ROOT_DOMAIN}` : `http://${ROOT_DOMAIN}`,
} as const;

export const TENANCY = {
  ENABLED: true,
  ROOT_DOMAIN: ROOT_DOMAIN,

  // 1. Cookie Domain Strategy:
  // In Prod: ".winfoa.com" (allows sharing session across subdomains)
  // In Dev: undefined (localhost handles cookies differently)
  COOKIE_DOMAIN: IS_PROD ? `.${ROOT_DOMAIN}` : undefined,

  // 2. Reserved Subdomains:
  // Tenants cannot register these subdomains
  RESERVED_SUBDOMAINS: SUBDOMAIN_CONFIG.TYPES,
} as const;
