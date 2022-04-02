import { FC, useMemo } from "react";
import { FormControl, InputLabel, MenuItem, Select, ListSubheader } from "@mui/material";
import useStore from "../utils/store";

interface AllFieldsSelectProps {
  value?: string;
  label: string;
  onChange?: (value: string) => void;
  options?: string[];
}
const AllFieldsSelect: FC<AllFieldsSelectProps> = ({ value, label, onChange, options }) => {
  const entryFields = useStore((state) => state.entryFields);
  const trajectoryFields = useStore((state) => state.trajectoryFields);

  const trajectoryOptions = useMemo(() => {
    if (options && Array.isArray(options)) {
      return options;
    }

    return trajectoryFields.map((field) => field.field_name);
  }, [options, trajectoryFields]);

  const entryOptions = useMemo(() => {
    return entryFields.map((field) => field.field_name);
  }, [entryFields]);

  return (
    <FormControl fullWidth style={{ margin: "5px" }}>
      <InputLabel id={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}>{label}</InputLabel>
      {/* TODO: Convert to Autocomplete with full list of fields */}
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
        {!options && <ListSubheader>Trajectory Fields</ListSubheader>}
        {trajectoryOptions.map((option: any) => (
          <MenuItem value={option}>{option}</MenuItem>
        ))}
        {!options && (
          <>
            <ListSubheader>Entry Fields</ListSubheader>
            {entryOptions.map((option: any) => (
              <MenuItem value={option}>{option}</MenuItem>
            ))}
          </>
        )}
      </Select>
    </FormControl>
  );
};

export default AllFieldsSelect;
