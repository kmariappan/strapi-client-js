export type CrudOperators =
  | 'eq'
  | 'ne'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'notContains'
  | 'containsi'
  | 'notContainsi'
  | 'between'
  | 'null'
  | 'notNull'
  | 'startsWith'
  | 'endsWith';

export type RelationalFilterOperators =
  | 'eq'
  | 'ne'
  | 'lt'
  | 'gt'
  | 'lte'
  | 'gte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith';

export type CrudFilter<T> = {
  field: keyof T;
  operator: CrudOperators;
  value: any;
};
export type CrudSort<T = any> = {
  field: keyof T;
  order?: 'asc' | 'desc';
};

export type RealationFilterType = {
  path: Array<string>;
  operator: RelationalFilterOperators;
  value: any;
};

export declare type CrudSorting<T = any> = CrudSort<T>[];

export type CrudFilters<T> = Array<CrudFilter<T>>;
