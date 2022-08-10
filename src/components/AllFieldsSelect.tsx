import { FC, useMemo } from "react";
import { FormControl, InputLabel, MenuItem, Select, ListSubheader } from "@mui/material";
import useStore from "../utils/store";

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
const AllFieldsSelect: FC<AllFieldsSelectProps> = ({ value, label, onChange, options, disabled, source, useFilterFields = true, clearable = false, style = {} }) => {
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
    <FormControl fullWidth style={{ margin: "5px", ...style }} disabled={disabled}>
      <InputLabel id={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}>{label}</InputLabel>
      <Select
        variant="standard"
        style={{ textAlign: "left", paddingLeft: "5px" }}
        labelId={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}
        value={value && (trajectoryOptions.includes(value) || entryOptions.includes(value)) ? value : ""}
        label={label}
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
      </Select>
    </FormControl>
  );
};

export default AllFieldsSelect;
