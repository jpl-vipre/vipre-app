import { FC, CSSProperties } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import useStore, { FilterItem } from "../../utils/store";

interface SelectFilterProps {
  filter: FilterItem;
  style?: CSSProperties;
  className?: string;
}
const SelectFilter: FC<SelectFilterProps> = ({ filter, style, className }) => {
  const setFilter = useStore((state) => state.setFilter);
  return (
    <FormControl fullWidth style={{ marginBottom: "15px", marginTop: "5px", ...style }} className={className}>
      <InputLabel id={`${filter.label.replace(/ /g, "-").toLowerCase()}-select-label`}>{filter.label}</InputLabel>
      <Select
        variant="standard"
        style={{ textAlign: "left", paddingLeft: "5px" }}
        labelId={`${filter.label}-select-label`}
        id={`${filter.label}-select`}
        value={filter.value === undefined ? filter.defaultValue : filter.value}
        label={filter.label}
        onChange={(evt) => {
          setFilter({ ...filter, value: evt.target.value });
        }}
      >
        {filter.options!.map((option: any, i) => (
          <MenuItem value={option} key={`filter-${filter.id}-${option}-${i}`}>
            {option} {filter.units}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
