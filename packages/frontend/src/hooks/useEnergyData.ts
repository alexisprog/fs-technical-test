import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchGraphQL } from "../utils/graphql-fetcher";
import {
  LATEST_ENERGY_BALANCE,
  ENERGY_BALANCES_BY_DATE_RANGE,
} from "../graphql/queries";
import { QueryResponse, QueryByDateResponse } from "../types/graphql";
import { config } from "../config/env";

/**
 * Hook para obtener el último balance energético
 */
export const useLatestEnergyBalance = (
  options?: Omit<
    UseQueryOptions<QueryResponse, Error, QueryResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["latestEnergyBalance"],
    queryFn: async (): Promise<QueryResponse> => {
      return fetchGraphQL<QueryResponse>(LATEST_ENERGY_BALANCE);
    },
    staleTime: config.cacheTime * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Hook para obtener los balances energéticos por rango de fechas
 */
export const useEnergyBalancesByDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = false,
  options?: Omit<
    UseQueryOptions<QueryByDateResponse, Error, QueryByDateResponse>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  return useQuery({
    queryKey: ["energyBalancesByDateRange", startDate, endDate],
    queryFn: async (): Promise<QueryByDateResponse> => {
      return fetchGraphQL<
        QueryByDateResponse,
        { startDate: string; endDate: string }
      >(ENERGY_BALANCES_BY_DATE_RANGE, { startDate, endDate });
    },
    enabled,
    staleTime: config.cacheTime * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};
