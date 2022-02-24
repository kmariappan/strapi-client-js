import { stringify, parse } from 'qs';

export function generateQueryString(obj: object): string {
  return stringify(obj, { encodeValuesOnly: true });
}

export function generateQueryFromRawString(rawQuery: string): string {
  return stringify(parse(rawQuery), { encodeValuesOnly: true });
}

export const isBrowser = () => typeof window !== 'undefined';
