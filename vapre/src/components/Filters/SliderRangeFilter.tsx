import { FC } from "react";
import { FormControl, FormLabel, Slider, Input } from "@mui/material";

import useStore, { FilterItem } from "../../utils/store";

import "../../scss/SliderRangeFilter.scss";

interface SliderRangeFilterProps {
  filter: FilterItem;
}

const SliderRangeFilter: FC<SliderRangeFilterProps> = ({ filter }) => {
  const setFilter = useStore((state) => state.setFilter);

  return (
    <div style={{ marginBottom: "15px", textAlign: "left" }} className="slider-range">
      <FormLabel style={{ textAlign: "left", paddingLeft: "5px" }} id={`${filter.label}-slider-label`}>
        {filter.label} {filter.units ? `(${filter.units})` : ""}
      </FormLabel>
      <div style={{ display: "flex" }}>
        <FormControl>
          <Input
            style={{ minWidth: "62px", textAlign: "center", marginRight: "10px" }}
            value={filter.value ? filter.value[0] : filter.defaultValue[0]}
            size="small"
            onChange={(evt: any) => {
              let endValue = filter.value ? filter.value[1] : filter.defaultValue[1];
              setFilter({ ...filter, value: [evt.target.value, endValue] });
            }}
            error={filter.value && (filter.value[0] < filter.min! || filter.value[0] > filter.value[1])}
            onBlur={() => {
              let endValue = filter.value ? filter.value[1] : filter.defaultValue[1];
              if (filter.value[0] < filter.min!) {
                setFilter({ ...filter, value: [filter.min!, endValue] });
              } else if (filter.value[0] > filter.max! || filter.value[1] > endValue) {
                setFilter({ ...filter, value: [Math.min(endValue, filter.max!), endValue] });
              }
            }}
            inputProps={{
              step: filter.step || 1,
              min: filter.min,
              max: Math.min(filter.value ? filter.value[1] : filter.defaultValue[1], filter.max!),
              type: "number",
              style: { textAlign: "center" },
            }}
          />
        </FormControl>
        <FormControl style={{ flex: 1 }}>
          <Slider
            value={filter.value ? filter.value : filter.defaultValue}
            onChange={(evt, newValue) => {
              setFilter({ ...filter, value: newValue });
            }}
            valueLabelDisplay="auto"
            min={filter.min}
            max={filter.max}
            step={filter.step || 1}
            disableSwap
          />
        </FormControl>
        <FormControl>
          <Input
            style={{ minWidth: "62px", textAlign: "center", marginLeft: "10px" }}
            value={filter.value ? filter.value[1] : filter.defaultValue[1]}
            size="small"
            onChange={(evt: any) => {
              let startValue = filter.value ? filter.value[0] : filter.defaultValue[0];
              setFilter({ ...filter, value: [startValue, evt.target.value] });
            }}
            error={filter.value && (filter.value[1] > filter.max! || filter.value[1] < filter.value[0])}
            onBlur={() => {
              let startValue = filter.value ? filter.value[0] : filter.defaultValue[0];
              if (filter.value[1] < filter.min! || filter.value[1] < startValue) {
                setFilter({ ...filter, value: [startValue, Math.max(startValue, filter.min!)] });
              } else if (filter.value[1] > filter.max!) {
                setFilter({ ...filter, value: [startValue, filter.max!] });
              }
            }}
            inputProps={{
              step: filter.step || 1,
              min: Math.max(filter.value ? filter.value[0] : filter.defaultValue[0], filter.min!),
              max: filter.max,
              type: "number",
              style: { textAlign: "center" },
            }}
          />
        </FormControl>
      </div>
    </div>
  );
};

export default SliderRangeFilter;
