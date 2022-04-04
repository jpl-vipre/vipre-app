import { FC, useMemo } from "react";
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

  const dateToSecondsSince2000 = (date: Date): number => {
    let baseSeconds = new Date("2000-01-01T00:00:00.000Z").getTime() / 1000;
    if (typeof date !== "object" || isNaN(Number(date))) {
      return baseSeconds;
    }
    return Math.round(date.getTime() / 1000 - baseSeconds);
  };

  const secondsSince2000ToDate = (seconds: number): Date => {
    let safeSeconds = typeof seconds === "number" ? seconds || 0 : 0;
    return new Date(safeSeconds * 1000 + new Date("2000-01-01T00:00:00.000Z").getTime());
  };

  const [startDateSeconds, endDateSeconds] = useMemo(
    () => [
      ...filter.defaultValue.map((defaultDate: Date) => dateToSecondsSince2000(defaultDate)),
      ...(filter.value || []),
    ],
    [filter]
  );
  const startDate = useMemo(() => secondsSince2000ToDate(startDateSeconds), [startDateSeconds]);
  const endDate = useMemo(() => secondsSince2000ToDate(endDateSeconds), [endDateSeconds]);

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
            value={startDate}
            onChange={(newValue: any) => {
              setFilter({ ...filter, value: [dateToSecondsSince2000(newValue), endDateSeconds] });
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: any) => {
              setFilter({ ...filter, value: [startDateSeconds, dateToSecondsSince2000(newValue)] });
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
    </FormControl>
  );
};

export default DateRangeFilter;
