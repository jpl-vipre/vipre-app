import { FC } from "react";

import useStore from "../utils/store";
import SelectFilter from "./Filters/SelectFilter";
import MultiSelectFilter from "./Filters/MultiSelectFilter";
import DateRangeFilter from "./Filters/DateRangeFilter";
import SliderRangeFilter from "./Filters/SliderRangeFilter";

import "../scss/FilterList.scss";

const FilterList: FC = () => {
  const filterList = useStore((state) => state.filterList);

  return (
    <div className="filter-container">
      <h5>Filters</h5>
      <div style={{ padding: "10px", display: "flex", flexDirection: "column" }}>
        {filterList
          .filter((filter) => !filter.hidden)
          .map((filter) => {
            switch (filter.type) {
              case "select":
                return <SelectFilter filter={filter} />;
              case "multi-select":
                return <MultiSelectFilter filter={filter} />;
              case "date-range":
                return <DateRangeFilter filter={filter} />;
              case "slider-range":
                return <SliderRangeFilter filter={filter} />;
              default:
                return null;
            }
          })}
      </div>
    </div>
  );
};

export default FilterList;
