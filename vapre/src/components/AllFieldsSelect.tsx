import { FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface AllFieldsSelectProps {
  value?: string;
  label: string;
  onChange?: (value: string) => void;
  options?: string[];
}
const AllFieldsSelect: FC<AllFieldsSelectProps> = ({ value, label, onChange, options }) => {
  if (options === undefined) {
    options = ["a", "b", "c"];
  }

  return (
    <FormControl fullWidth style={{ margin: "5px" }}>
      <InputLabel id={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}>{label}</InputLabel>
      {/* TODO: Convert to Autocomplete with full list of fields */}
      <Select
        variant="standard"
        style={{ textAlign: "left", paddingLeft: "5px" }}
        labelId={`${label.replace(/ /g, "-").toLowerCase()}-graph-type-label`}
        value={value || ""}
        label={label}
        onChange={(evt: any) => {
          if (onChange) onChange(evt.target.value as string);
        }}
      >
        {options.map((option: any) => {
          return <MenuItem value={option}>{option}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default AllFieldsSelect;
