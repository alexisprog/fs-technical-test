import React from "react";
import DateRangeSearch from "../../../components/energy/DateRangeSearch";

interface SearchSectionProps {
  onSearch: (startDate: string, endDate: string) => void;
  onClear: () => void;
  isLoading: boolean;
  showClear: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onClear,
  isLoading,
  showClear,
}) => {
  return (
    <DateRangeSearch
      onSearch={onSearch}
      isLoading={isLoading}
      showClear={showClear}
      onClear={onClear}
    />
  );
};

export default SearchSection;
