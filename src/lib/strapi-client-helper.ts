import { InferedTypeFromArray, PopulateArrayOptionType, StrapiApiError, StrapiApiResponse } from './types/base';
import { CrudFilter, CrudSorting, RealationFilterType } from './types/crud';
import { parse, stringify } from 'qs';
import { generateQueryString } from './helpers';

export abstract class StrapiClientHelper<T> {
  protected url: string;

  constructor(url: string) {
    this.url = url;
  }

  private _normalizeData(data: any): any {
    const isObject = (data: any) => Object.prototype.toString.call(data) === '[object Object]';

    const flatten = (data: any) => {
      if (!data.attributes) return data;

      return {
        id: data.id,
        ...data.attributes,
      };
    };

    if (Array.isArray(data)) {
      return data.map(item => this._normalizeData(item));
    }

    if (isObject(data)) {
      if (Array.isArray(data.data)) {
        data = [...data.data];
      } else if (isObject(data.data)) {
        data = flatten({ ...data.data });
      } else if (data.data === null) {
        data = null;
      } else {
        data = flatten(data);
      }

      for (const key in data) {
        data[key] = this._normalizeData(data[key]);
      }

      return data;
    }

    return data;
  }

  protected _returnDataHandler(data: StrapiApiResponse<T>): StrapiApiResponse<T> {
    const response: StrapiApiResponse<T> = {
      data: this._normalizeData(data.data) as T,
      meta: data.meta,
      error: data.error,
    };
    return response;
  }

  protected _returnErrorHandler(err: any): StrapiApiResponse<T> {
    let error: StrapiApiError = {
      status: null,
      message: null,
      details: null,
      name: null,
    };

    if (err.code === 'ENOTFOUND' || err.syscall === 'getaddrinfo') {
      error.status = err.code;
      error.message = `The given url ${err.config.baseURL} is incorrect or invalid `;
      error.name = err.syscall;
    } else {
      if (!err.response.data.error) {
        error.status = err.response.status as number;
        error.message = err.response.statusText;
        error.name = err.response.data;
      } else {
        error = err.response.data.error as StrapiApiError;
      }
    }

    const response: StrapiApiResponse<T> = {
      data: null,
      error,
    };
    return response;
  }

  protected _generateFilter({ field, operator, value }: CrudFilter<InferedTypeFromArray<T>>): string {
    let rawQuery = '';
    if (Array.isArray(value)) {
      value.map((val: string) => {
        rawQuery += `&filters[${field}][$${operator}]=${val}`;
      });
    } else {
      rawQuery += `&filters[${field}][$${operator}]=${value}`;
    }
    const parsedQuery = parse(rawQuery);
    return this._handleUrl(generateQueryString(parsedQuery));
  }

  protected _genrateRelationsFilter(options: RealationFilterType[]) {
    let rawQuery = '';

    options.map((option, index) => {
      const { path: fields, operator, value } = option;
      rawQuery += index === 0 ? `filters[$and][${index}]` : `&filters[$and][${index}]`;
      if (Array.isArray(fields)) {
        fields.map((val: string) => {
          rawQuery += `[${val}]`;
        });
      }
      rawQuery += `[$${operator}]=${value}`;
    });
    const parsedQuery = parse(rawQuery);

    return this._handleUrl(generateQueryString(parsedQuery));
  }

  protected _generateSort<T>(_sort: CrudSorting<T>): string {
    const sort: string[] = [];
    _sort.map(item => {
      if (item.order) {
        sort.push(`${item.field}:${item.order}`);
      } else {
        sort.push(`${item.field}`);
      }
    });
    return this._handleUrl(generateQueryString({ sort }));
  }

  protected _handleUrl(query: string): string {
    const lastChar = this.url.charAt(this.url.length - 1);
    const hasQuerySymbol = this.url.includes('?');
    if (!hasQuerySymbol && lastChar !== '&') {
      return `${this.url}?${query}`;
    } else {
      return `${this.url}&${query}`;
    }
  }

  protected _generatePopulateQuery(populateArrayOptions: PopulateArrayOptionType[]): string {
    let baseContents = '';
    let manipulatedUrl = '';

    populateArrayOptions.forEach((p, index) => {
      const result = this._generatePopulateString(p, index, baseContents);
      baseContents += result.base;
      manipulatedUrl += result.url;
    });

    return this._handleUrl(stringify(parse(manipulatedUrl)));
  }

  private _generatePopulateString(
    data: PopulateArrayOptionType,
    index: number,
    baseContents: string
  ): { url: string; base: string } {
    let url = '';
    let base = '';

    if (index === 0) {
      if (data.selectFields) {
        data.selectFields.map(field => {
          url += `&populate[${data.relation}][fields]=${field}`;
        });
        base += `populate[${data.relation}]`;
      }
    } else {
      if (data.selectFields) {
        data.selectFields.map(field => {
          url += `&${baseContents}[populate][${data.relation}][fields]=${field}`;
        });
        base += `[populate][${data.relation}]`;
      }
    }

    return { url, base };
  }
}
