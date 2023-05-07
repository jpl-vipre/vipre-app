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
import { FormControl, InputLabel, MenuItem, Select, ListSubheader } from "@mui/material";
import useStore from "../utils/store";

const DATA_RATE_OPTIONS = ["time", "data_rate"];

interface AllFieldsSelectProps {
  value?: string;
  label: string;
  onChange?: (value: string) => void;
  options?: string[];
  disabled?: boolean;
  source?: string;
  useFilterFields?: boolean;
  clearable?: boolean;
  style?: any;
}
const AllFieldsSelect: FC<AllFieldsSelectProps> = ({ value, label, onChange, options, source = null, disabled = false, useFilterFields = true, clearable = false, style = {} }) => {
  const entryFields = useStore((state) => state.entryFields);
  const entryFilters = useStore((state) => state.entryFilters);
  const trajectoryFields = useStore((state) => state.trajectoryFields);
  const trajectoryFilters = useStore((state) => state.trajectoryFilters);

  const trajectoryOptions = useMemo(() => {
    if (options && Array.isArray(options)) {
      return options;
    }
    if (useFilterFields) {
      return trajectoryFilters.map((field) => field.field_name.startsWith("trajectory") ? field.field_name : `trajectory.${field.field_name}`);
    } else {
      return trajectoryFields.map((field) => field.startsWith("trajectory") ? field : `trajectory.${field}`);
    }
  }, [options, trajectoryFields, trajectoryFilters, useFilterFields]);

  const entryOptions = useMemo(() => {
    if (useFilterFields) {
      return entryFilters.map((field) => field.field_name.startsWith("entry") ? field.field_name : `entry.${field.field_name}`);
    } else {
      return entryFields.map((field) => field.startsWith("entry") ? field : `entry.${field}`);
    }
  }, [entryFields, useFilterFields, entryFilters]);

  return (
    <FormControl fullWidth style={{ margin: "5px", ...style }} disabled={disabled || false}>
      <InputLabel id={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}>{label}</InputLabel>
      <Select
        variant="standard"
        style={{ textAlign: "left", paddingLeft: "5px" }}
        labelId={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}
        value={value && (trajectoryOptions.includes(value) || entryOptions.includes(value) || DATA_RATE_OPTIONS.includes(value)) ? value : ""}
        placeholder={label}
        onChange={(evt: any) => {
          if (onChange) onChange(evt.target.value as string);
        }}
      >
        {clearable && <MenuItem value={""}>
          Clear
        </MenuItem>}
        {!options && (!source || source === "trajectories") && <ListSubheader>Trajectory Fields</ListSubheader>}
        {(options || (!source || source === "trajectories")) && trajectoryOptions.map((option: any, i: number) => (
          <MenuItem value={option} key={`traj-${label}-${option}-${i}`}>
            {option.replace(/^trajectory./, "")}
          </MenuItem>
        ))}
        {!options && (!source || source === "entries") && <ListSubheader>Entry Fields</ListSubheader>}
        {!options && (!source || source === "entries") &&
          entryOptions.map((option: any, i: number) => (
            <MenuItem key={`entry-${label}-${option}-${i}`} value={option}>
              {option.replace(/^entry./, "")}
            </MenuItem>
          ))}
        {!options && (source === "dataRates") &&
          DATA_RATE_OPTIONS.map((option: any, i: number) => (
            <MenuItem key={`entry-${label}-${option}-${i}`} value={option}>
              {option.replace(/^entry./, "")}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default AllFieldsSelect;
