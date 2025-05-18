/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: unknown; output: unknown; }
};

export type Attributes2Type = {
  __typename?: 'Attributes2Type';
  content: Array<ContentType>;
  description?: Maybe<Scalars['String']['output']>;
  lastUpdate: Scalars['String']['output'];
  magnitude?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
};

export type Attributes3Type = {
  __typename?: 'Attributes3Type';
  color: Scalars['String']['output'];
  composite: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['JSON']['output']>;
  lastUpdate: Scalars['String']['output'];
  magnitude?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  totalPercentage: Scalars['Float']['output'];
  type?: Maybe<Scalars['String']['output']>;
  values: Array<ValueType>;
};

export type AttributesType = {
  __typename?: 'AttributesType';
  description: Scalars['String']['output'];
  lastUpdate: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CacheControlType = {
  __typename?: 'CacheControlType';
  cache: Scalars['String']['output'];
};

export type ContentType = {
  __typename?: 'ContentType';
  attributes: Attributes3Type;
  groupId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type DataType = {
  __typename?: 'DataType';
  attributes: AttributesType;
  id: Scalars['String']['output'];
  meta: MetaType;
  type: Scalars['String']['output'];
};

export type IncludedType = {
  __typename?: 'IncludedType';
  attributes: Attributes2Type;
  id: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type MetaType = {
  __typename?: 'MetaType';
  cacheControl: CacheControlType;
};

export type Query = {
  __typename?: 'Query';
  /** Obtiene balances energéticos dentro de un rango de fechas */
  energyBalancesByDateRange: ResponseType;
  /** Obtiene el último balance energético disponible */
  latestEnergyBalance: ResponseType;
};


export type QueryEnergyBalancesByDateRangeArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

/** Respuesta de datos energéticos */
export type ResponseType = {
  __typename?: 'ResponseType';
  /** Datos principales de la respuesta */
  data: DataType;
  /** Elementos incluidos en la respuesta */
  included: Array<IncludedType>;
};

export type ValueType = {
  __typename?: 'ValueType';
  datetime: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};
