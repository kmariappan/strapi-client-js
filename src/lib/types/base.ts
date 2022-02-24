export interface StrapiApiError {
  message: string | null;
  status: number | null;
  name: string | null;
  details: any | null;
}

export type StrapiClientOptions = {
  url: string;
  debug?: boolean;
  normalizeData?: boolean;
  apiToken?: string;
  headers?: { [key: string]: string };
  persistSession?: boolean;
  localStorage?: SupportedStorage;
};

type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type PopulateArrayOptionType = {
  relation: string;
  selectFields?: string[];
};

export type Meta = {
  pagination: StrapiPagination;
};

export type StrapiApiResponse<T> = {
  data: T | null;
  error?: StrapiApiError;
  meta?: Meta;
};

export enum PublicationState {
  LIVE = 'live',
  PREVIEW = 'preview',
}

export type StrapiUnifiedResponse<T> = {
  id: number | string;
  attributes: T;
};

export type InferedTypeFromArray<T> = T extends Array<infer U> ? U : T;

export type StrapiPopulatedResponse<T> = {
  data: T extends Array<infer U> ? Array<StrapiUnifiedResponse<U>> : StrapiUnifiedResponse<T>;
};

export type StrapiTimestamp = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiLocalization = {
  locale: string;
  localizations?: Array<any>;
};

// Persist Token in LocalStorage
type AnyFunction = (...args: any[]) => any;
type MaybePromisify<T> = T | Promise<T>;

type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>> : T[K];
};

export type SupportedStorage = PromisifyMethods<Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>>;
