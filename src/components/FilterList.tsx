import { FC, useState, useEffect } from "react";

import { useDebounce } from "usehooks-ts";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

import useStore from "../utils/store";
import SelectFilter from "./Filters/SelectFilter";
import MultiSelectFilter from "./Filters/MultiSelectFilter";
import DateRangeFilter from "./Filters/DateRangeFilter";
import SliderRangeFilter from "./Filters/SliderRangeFilter";

import EditFiltersDialog from "./EditFiltersDialog";

import "../scss/FilterList.scss";

const FilterList: FC = () => {
  const filterList = useStore((state) => state.filterList);
  const searchTrajectories = useStore((state) => state.searchTrajectories);
  const fetchEntries = useStore((state) => state.fetchEntries)
  const [openEditFilters, setOpenEditFilters] = useState(false);

  const debouncedFilterList = useDebounce(filterList, 1000);

  useEffect(() => {
    if (debouncedFilterList.filter(filterItem => filterItem.dataField.startsWith("trajectory")).length > 0) {
      searchTrajectories();
    }

    if (debouncedFilterList.filter(filterItem => filterItem.dataField.startsWith("entry")).length > 0) {
      fetchEntries();
    }
  }, [searchTrajectories, fetchEntries, debouncedFilterList]);

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
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", overflow: "scroll" }}>
        {filterList
          .filter((filter) => !filter.hidden)
          .map((filter, i) => {
            const key = `filter-${filter.id}-${i}`;
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
          })}
      </div>
      <EditFiltersDialog open={openEditFilters} setOpen={setOpenEditFilters} />
    </div>
  );
};

export default FilterList;
