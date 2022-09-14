import { FC, useEffect, useMemo } from "react";
import { FormControl, FormLabel, Slider, Input } from "@mui/material";

import useStore, { FilterItem } from "../../utils/store";

import "../../scss/SliderRangeFilter.scss";

interface SliderRangeFilterProps {
  filter: FilterItem;
}

const SliderRangeFilter: FC<SliderRangeFilterProps> = ({ filter }) => {
  const setFilter = useStore((state) => state.setFilter);
  const relayVolumeScale = useStore(state => state.relayVolumeScale);

  useEffect(() => {
    if (filter.initial) {
      setFilter({ ...filter, value: filter.value.map((val: number) => val / relayVolumeScale), initial: false });
    }
  }, [filter, setFilter, relayVolumeScale])

  const scaleByRelayVolume = useMemo(() => filter.dataField === "entry.relay_volume", [filter]);
  const sliderValues = useMemo(() => {
    if (filter.value && filter.value.length > 0) {
      if (scaleByRelayVolume) {
        return filter.value.map((val: number) => val * relayVolumeScale);
      } else {
        return filter.value;
      }
    } else {
      return filter.defaultValue || [0, 0];
    }
  }, [filter, scaleByRelayVolume, relayVolumeScale]);

  return (
    <div style={{ marginBottom: "25px", textAlign: "left" }} className="slider-range">
      <FormLabel
        style={{ textAlign: "left", paddingLeft: "5px" }}
        id={`${filter.label.replace(/ /g, "-").toLowerCase()}-slider-label`}
      >
        {filter.label} {filter.units ? `(${filter.units})` : ""}
      </FormLabel>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <FormControl style={{ flex: 1, margin: "0 15px" }}>
          <Slider
            value={sliderValues}
            onChange={(evt, newValue) => {
              if (scaleByRelayVolume && Array.isArray(newValue)) {
                setFilter({ ...filter, value: newValue.map((val: number) => val / relayVolumeScale) });
              } else {
                setFilter({ ...filter, value: newValue });
              }
            }}
            valueLabelDisplay="auto"
            min={filter.min}
            max={filter.max}
            step={filter.step || 0.1}
            disableSwap
          />
        </FormControl>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl>
            <Input
              style={{ minWidth: "62px", maxWidth: "62px", textAlign: "center", marginTop: "-5px" }}
              value={sliderValues[0]}
              size="small"
              onChange={(evt: any) => {
                let endValue = filter.value ? filter.value[1] : filter.defaultValue[1];

                let targetValue = evt.target.value;
                if (!isNaN(targetValue) && scaleByRelayVolume) {
                  setFilter({ ...filter, value: [Number(targetValue) / relayVolumeScale, endValue] });
                } else {
                  setFilter({ ...filter, value: [evt.target.value, endValue] });
                }
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
          <FormControl>
            <Input
              style={{ minWidth: "62px", maxWidth: "62px", textAlign: "center", marginTop: "-5px" }}
              value={sliderValues[1]}
              size="small"
              onChange={(evt: any) => {
                let startValue = filter.value ? filter.value[0] : filter.defaultValue[0];
                let targetValue = evt.target.value;
                if (!isNaN(targetValue) && scaleByRelayVolume) {
                  setFilter({ ...filter, value: [startValue, Number(targetValue) / relayVolumeScale] });
                } else {
                  setFilter({ ...filter, value: [startValue, evt.target.value] });
                }
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
    </div>
  );
};

export default SliderRangeFilter;
