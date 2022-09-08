import { FC, useState, useEffect } from "react";

import { useDebounce, useEffectOnce } from "usehooks-ts";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import useStore, { FilterItem } from "../utils/store";
import SelectFilter from "./Filters/SelectFilter";
import MultiSelectFilter from "./Filters/MultiSelectFilter";
import DateRangeFilter from "./Filters/DateRangeFilter";
import SliderRangeFilter from "./Filters/SliderRangeFilter";

import EditFiltersDialog from "./EditFiltersDialog";

import "../scss/FilterList.scss";

const FilterComponent: FC<{ filter: FilterItem }> = ({ filter }) => {
  const key = `filter-${filter.id}`;
  switch (filter.type) {
    case "select":
      return <SelectFilter filter={filter} key={key} />;
    case "multi-select":
      return <MultiSelectFilter filter={filter} key={key} />;
    case "date-range":
      return <DateRangeFilter filter={filter} key={key} />;
    case "slider-range":
      return <SliderRangeFilter filter={filter} key={key} />;
    default:
      return null;
  }
}

const FilterList: FC = () => {
  const filterList = useStore((state) => state.filterList);
  const searchTrajectories = useStore((state) => state.searchTrajectories);
  const filtersInitialized = useStore(state => state.filtersInitialized);
  const fetchEntries = useStore((state) => state.fetchEntries)
  const [openEditFilters, setOpenEditFilters] = useState(false);

  const debouncedFilterList = useDebounce(filterList, 1000);

  useEffect(() => {
    if (debouncedFilterList.length > 0 && filtersInitialized) {
      searchTrajectories();
    }
  }, [searchTrajectories, fetchEntries, debouncedFilterList, filtersInitialized]);
  return (
    <div className="filter-container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "15px",
        }}
      >
        <IconButton style={{ position: "absolute", left: "5px" }} onClick={() => setOpenEditFilters(true)}>
          <EditIcon />
        </IconButton>
        <h5>Filters</h5>
      </div>
      <div className="filter-area" style={{ padding: "10px", display: "flex", flexDirection: "column", overflow: "scroll" }}>
        <h5 style={{ width: "100%", textAlign: "left", marginBottom: "5px", paddingBottom: "2px", borderBottom: "1px solid rgba(255, 255, 255, 0.7)", color: "rgba(255, 255, 255, 0.7)" }}>Trajectory Filters</h5>
        {filterList
          .filter((filter) => !filter.hidden && filter.dataField.startsWith("trajectory"))
          .map((filter, i) => <FilterComponent filter={filter} key={`filter-component-${filter.id}-${i}`} />)}
        <h5 style={{ width: "100%", textAlign: "left", marginBottom: "5px", paddingBottom: "2px", borderBottom: "1px solid rgba(255, 255, 255, 0.7)", color: "rgba(255, 255, 255, 0.7)" }}>Entry Filters</h5>
        {filterList
          .filter((filter) => !filter.hidden && filter.dataField.startsWith("entry"))
          .map((filter, i) => <FilterComponent filter={filter} key={`filter-component-${filter.id}-${i}`} />)}
      </div>
      <EditFiltersDialog open={openEditFilters} setOpen={setOpenEditFilters} />
    </div>
  );
};

export default FilterList;
