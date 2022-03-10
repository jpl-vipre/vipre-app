import { FC } from "react";
import { FormControl, TextField, FormLabel } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import useStore, { FilterItem } from "../../utils/store";

import "../../scss/DateRangeFilter.scss";

interface DateRangeFilterProps {
  filter: FilterItem;
}

const DateRangeFilter: FC<DateRangeFilterProps> = ({ filter }) => {
  const setFilter = useStore((state) => state.setFilter);
  return (
    <FormControl fullWidth style={{ marginBottom: "15px" }} className="date-range-filter">
      <FormLabel
        style={{ textAlign: "left", paddingLeft: "5px", marginBottom: "5px" }}
        id={`${filter.label.replace(/ /g, "-").toLowerCase()}-date-range-label`}
      >
        {filter.label}
      </FormLabel>
      <div style={{ display: "flex" }} className="date-selectors">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={filter.value ? filter.value[0] : filter.defaultValue[0]}
            onChange={(newValue: any) => {
              let endValue = filter.value ? filter.value[1] : filter.defaultValue[1];
              setFilter({ ...filter, value: [newValue, endValue] });
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={filter.value ? filter.value[1] : filter.defaultValue[1]}
            onChange={(newValue: any) => {
              let startValue = filter.value ? filter.value[0] : filter.defaultValue[0];
              setFilter({ ...filter, value: [startValue, newValue] });
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </FormControl>
  );
};

export default DateRangeFilter;
