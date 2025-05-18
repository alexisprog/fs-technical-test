import { IncludedItem } from "../../../types/graphql";

/**
 * Determina si un elemento es un grupo principal
 */
export const isMainGroup = (item: IncludedItem): boolean => {
  return !!item.attributes.content && Array.isArray(item.attributes.content);
};

/**
 * Determina si un elemento es un total de grupo (composite)
 */
export const isGroupTotal = (item: any): boolean => {
  return item && item.attributes && item.attributes.composite === true;
};
