import { StrapiClient } from './lib/strapi-client';
import { StrapiClientOptions } from './lib/types/base';

const defaultOptions: StrapiClientOptions = {
  url: '',
  normalizeData: true,
};

/**
 * Strapi Client Options Object
 *
 * @param url Strapi application url
 *
 * @param apiToken Authorized Api Token
 *
 * @param normalizeData Disables Unified response format. default - true
 *
 * @param headers custom headers
 *
 * @param debug Query log on development. default - false
 *
 * @param persistSession Using browser localstorage to save the current session. default- flase
 *
 */
const createClient = (options: StrapiClientOptions): StrapiClient => {
  return new StrapiClient({ ...defaultOptions, ...options });
};

export { createClient, StrapiClient };
export type {
  StrapiUnifiedResponse,
  StrapiTimestamp,
  StrapiPopulatedResponse,
  StrapiClientOptions,
} from './lib/types/base';
export type { SignInCredentials, SignUpCredentials } from './lib/types/auth';
export type { StrapiImage } from './lib/types/image';
export * from './lib/strapi-query-builder'
export * from './lib/strapi-filter-builder'
