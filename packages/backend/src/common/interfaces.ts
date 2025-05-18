export interface Response {
  data: Data;
  included: Included[];
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
  meta: Meta;
}

export interface Attributes {
  title: string;
  "last-update": string;
  description: string;
}

export interface Meta {
  "cache-control": CacheControl;
}

export interface CacheControl {
  cache: string;
}

export interface Included {
  type: string;
  id: string;
  attributes: Attributes2;
}

export interface Attributes2 {
  title: string;
  "last-update": string;
  description?: string;
  magnitude: any;
  content: Content[];
}

export interface Content {
  type: string;
  id: string;
  groupId: string;
  attributes: Attributes3;
}

export interface Attributes3 {
  title: string;
  description?: string;
  color: string;
  icon: any;
  type?: string;
  magnitude: any;
  composite: boolean;
  "last-update": string;
  values: Value[];
  total: number;
  "total-percentage": number;
}

export interface Value {
  value: number;
  percentage: number;
  datetime: string;
}
