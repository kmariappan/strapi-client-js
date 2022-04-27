import { AxiosInstance } from 'axios';
import { generateQueryString } from './helpers';
import { StrapiClientHelper } from './strapi-client-helper';
import { StrapiFilterBuilder } from './strapi-filter-builder';
import { StrapiApiResponse } from './types/base';

type PostValuesType<T> = {
  data: T;
};
export class StrapiQueryBuilder<T> extends StrapiClientHelper<T> {
  private httpClient: AxiosInstance;
  private isNotUserContent: boolean;
  protected normalizData: boolean;
  private debug: boolean;
  constructor(
    url: string,
    axiosInstance: AxiosInstance,
    isNotUserContent: boolean,
    normalizeData: boolean,
    debug: boolean
  ) {
    super(url);
    this.debug = debug;
    this.normalizData = normalizeData;
    this.url = `${url}`;
    this.isNotUserContent = isNotUserContent;
    this.httpClient = axiosInstance;
  }

  /**
   *
   * @param fields Array of string to select the fields.
   * @returns collection of requested contents.
   */

  select(fields?: Array<keyof T>): StrapiFilterBuilder<T[]> {
    if (fields) {
      const query = {
        fields,
      };
      const queryString = generateQueryString(query);
      this.url = `${this.url}?${queryString}`;
    }

    return new StrapiFilterBuilder<T[]>(
      this.url,
      this.httpClient,
      this.normalizData,
      this.debug,
      this.isNotUserContent
    );
  }

  /**
   *
   * @param ids Array of string or number values to select many records.
   * @returns selected contents.
   */
  selectManyByID(ids: string[] | number[]): StrapiFilterBuilder<T[]> {
    if (ids) {
      const query = ids?.map((item: string | number) => `filters[id][$in]=${item}`).join('&');

      this.url = `${this.url}?${query}`;
    }

    return new StrapiFilterBuilder<T[]>(
      this.url,
      this.httpClient,
      this.normalizData,
      this.debug,
      this.isNotUserContent
    );
  }

  /**
   *
   * @param values The values to create a new record.
   * @returns By default the new record is returned.
   */
  async create(values: T): Promise<StrapiApiResponse<T>> {
    return new Promise<StrapiApiResponse<T>>((resolve) => {
      this.httpClient
        .post<StrapiApiResponse<T>>(this.url, this._handleValues(values))
        .then((res) => {
          resolve(this.normalizData ? this._returnDataHandler(res.data) : res.data);
        })
        .catch((err) => {
          if (err) {
            resolve(this._returnErrorHandler(err));
          }
        });
    });
  }

  /**
   *
   * @param values objects of values to create many records.
   * @returns return boolean value if the process on success
   */
  async createMany(values: T[]): Promise<{ success: true }> {
    await Promise.all(
      values.map(async (value): Promise<StrapiApiResponse<T>> => {
        const { data } = await this.httpClient.post<StrapiApiResponse<T>>(this.url, this._handleValues(value));
        return Promise.resolve(data);
      })
    ).catch((error) => {
      if (error) {
        this._returnErrorHandler(error);
      }
    });
    return Promise.resolve({
      success: true,
    });
  }

  /**
   *
   * @param values The values to update an existing record.
   * @returns By default the new record is returned.
   */
  async update(id: string | number, values: Partial<T>): Promise<StrapiApiResponse<T>> {
    const url = `${this.url}/${id}`;
    return new Promise<StrapiApiResponse<T>>((resolve) => {
      this.httpClient
        .put<StrapiApiResponse<T>>(url, this._handleValues(values))
        .then((res) => {
          resolve(this.normalizData ? this._returnDataHandler(res.data) : res.data);
        })
        .catch((err) => {
          if (err) {
            resolve(this._returnErrorHandler(err));
          }
        });
    });
  }

  /**
   *
   * @param values objects of values to update many records.
   * @returns return boolean value if the process on success
   */
  async updateMany(values: { id: string | number; variables: Partial<T> }[]): Promise<{ success: true }> {
    await Promise.all(
      values.map(async (value): Promise<StrapiApiResponse<T>> => {
        const url = `${this.url}/${value.id}`;

        const { data } = await this.httpClient.put<StrapiApiResponse<T>>(url, this._handleValues(value.variables));
        return Promise.resolve(data);
      })
    ).catch((error) => {
      if (error) {
        this._returnErrorHandler(error);
      }
    });
    return Promise.resolve({
      success: true,
    });
  }

  /**
   *
   * @param value The value to delete an record.
   * @returns By default the deleted record is returned.
   */
  async deleteOne(id: string | number): Promise<StrapiApiResponse<T>> {
    const url = `${this.url}/${id}`;
    return new Promise<StrapiApiResponse<T>>((resolve) => {
      this.httpClient
        .delete<StrapiApiResponse<T>>(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          if (err) {
            resolve(this._returnErrorHandler(err));
          }
        });
    });
  }

  /**
   *
   * @param values Array of string or number values to delete many records.
   * @returns return boolean value if the process on success
   */
  async deleteMany(ids: string[] | number[]): Promise<{ success: true }> {
    await Promise.all(
      ids.map(async (id) => {
        const { data } = await this.httpClient.delete(`${this.url}/${id}`);
        return data;
      })
    ).catch((err) => {
      if (err) {
        return this._returnErrorHandler(err);
      }
    });

    return Promise.resolve({
      success: true,
    });
  }

  private _handleValues(values: Partial<T>): Partial<T> | PostValuesType<Partial<T>> {
    if (this.isNotUserContent) {
      const dataValues: PostValuesType<Partial<T>> = {
        data: values,
      };
      return dataValues;
    } else {
      return values;
    }
  }
}
