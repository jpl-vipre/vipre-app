/**
 * Copyright (c) 2021-2023 California Institute of Technology ("Caltech"). U.S.
 * Government sponsorship acknowledged.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of Caltech nor its operating division, the Jet Propulsion
 *   Laboratory, nor the names of its contributors may be used to endorse or
 *   promote products derived from this software without specific prior written
 *   permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import { FC, useState, useEffect } from "react";

import { useDebounce } from "usehooks-ts";

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
