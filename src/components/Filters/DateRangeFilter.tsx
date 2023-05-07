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
      ...(filter.defaultValue && filter.defaultValue.length && filter.defaultValue.map((defaultDate: Date) => dateToSecondsSince2000(defaultDate))),
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
