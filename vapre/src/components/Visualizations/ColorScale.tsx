import { FC, useMemo, useState } from "react";

import { Tooltip } from "@mui/material";

import "../../scss/ColorScale.scss";

interface ColorScaleProps {
  minBound: number;
  maxBound: number;
  interpolateColorValue: (value: number) => string;
  units?: string;
  steps?: number;
  activeValues?: number[];
  setHoverValue?: (value: number) => void;
  minSelected?: number;
  setMinSelected?: (value: number) => void;
  maxSelected?: number;
  setMaxSelected?: (value: number) => void;
}
const ColorScale: FC<ColorScaleProps> = ({
  minBound,
  maxBound,
  interpolateColorValue,
  units,
  steps = 100,
  activeValues,
  setHoverValue,
  minSelected,
  setMinSelected,
  maxSelected,
  setMaxSelected,
}) => {
  const [firstSelectedValue, setFirstSelectedValue] = useState<number>(-1);
  const closestMinMax = useMemo(() => {
    if (minSelected === undefined || maxSelected === undefined || minSelected === -1 || maxSelected === -1) {
      return null;
    }
    let selectedRange = [minSelected, maxSelected];
    let closestValues = [-1, -1].map((_, i) => {
      let closestValue = -1;
      Array.from(new Array(steps)).forEach((_, j) => {
        let rangeValue = minBound + (j / steps) * (maxBound - minBound);
        if (
          closestValue === -1 ||
          Math.abs(selectedRange[i] - rangeValue) < Math.abs(selectedRange[i] - closestValue)
        ) {
          closestValue = rangeValue;
        }
      });
      return closestValue;
    });
    return closestValues;
  }, [minSelected, maxSelected, steps, minBound, maxBound]);
  const closestActiveValues = useMemo(() => {
    if (activeValues === undefined) {
      return {};
    }

    let valueMap: Record<number, number[]> = {};
    activeValues.forEach((activeValue) => {
      let closestValue = -1;
      Array.from(new Array(steps)).forEach((_, i) => {
        let rangeValue = minBound + (i / steps) * (maxBound - minBound);
        if (closestValue === -1 || Math.abs(activeValue - rangeValue) < Math.abs(activeValue - closestValue)) {
          closestValue = rangeValue;
        }
      });
      valueMap[closestValue] =
        valueMap[closestValue] && valueMap[closestValue].length > 0
          ? [...valueMap[closestValue], activeValue]
          : [activeValue];
    });

    return valueMap;
  }, [activeValues, steps, maxBound, minBound]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "50px" }} className="color-scale">
      <span style={{ color: "#a1a1b5", fontSize: "10px", marginBottom: "5px", whiteSpace: "pre" }}>
        {minBound} {units}
      </span>
      <div
        style={{
          height: "90%",
          minWidth: "25px",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseLeave={() => setFirstSelectedValue(-1)}
      >
        {Array.from(new Array(steps + 1)).map((_, i) => {
          let value = minBound + (i / steps) * (maxBound - minBound);
          let hoverText = closestActiveValues[value]
            ? closestActiveValues[value].join(` ${units || "units"}, `) + ` ${units || "units"}`
            : `${Math.round(value * 100) / 100} ${units || "units"}`;

          let isWithinRange =
            typeof minSelected === "number" &&
            typeof maxSelected === "number" &&
            value >= minSelected &&
            value <= maxSelected;

          return (
            <Tooltip title={hoverText} placement="right">
              <div
                onMouseEnter={() => setHoverValue && setHoverValue(value)}
                onMouseLeave={() => setHoverValue && setHoverValue(-1)}
                onMouseDown={(evt) => {
                  evt.preventDefault();
                  setFirstSelectedValue(value);
                  if (setMinSelected) setMinSelected(value);
                  if (setMaxSelected) setMaxSelected(value);
                }}
                onMouseOver={(evt) => {
                  if (firstSelectedValue > -1) {
                    let minValue = Math.min(firstSelectedValue, value);
                    let maxValue = Math.max(firstSelectedValue, value);
                    if (setMinSelected) setMinSelected(minValue);
                    if (setMaxSelected) setMaxSelected(maxValue);
                  }
                }}
                onMouseUp={() => {
                  let minValue = Math.min(firstSelectedValue, value);
                  let maxValue = Math.max(firstSelectedValue, value);
                  setFirstSelectedValue(-1);
                  if (setMinSelected) setMinSelected(minValue);
                  if (setMaxSelected) setMaxSelected(maxValue);
                }}
                className={`color-scale-bar${closestActiveValues[value] ? " active" : ""}`}
                style={{
                  flex: 1,
                  background: `${interpolateColorValue(value)}`,
                  borderTop: closestMinMax && value === closestMinMax[0] ? "2px solid white" : "none",
                  borderBottom: closestMinMax && value === closestMinMax[1] ? "2px solid white" : "none",
                  borderRight: isWithinRange ? "2px solid white" : "none",
                  borderLeft: isWithinRange ? "2px solid white" : "none",
                  margin: isWithinRange ? "0 -2px" : 0,
                  marginTop: closestMinMax && value === closestMinMax[0] ? "-2px" : 0,
                  // marginBottom: value === closestMinMax[1] ? "-2px" : 0,
                  outlineWidth: !isWithinRange
                    ? closestActiveValues[value]
                      ? `${closestActiveValues[value].length + 1}px`
                      : "2px"
                    : 0,
                }}
              />
            </Tooltip>
          );
        })}
      </div>
      <span style={{ color: "#a1a1b5", fontSize: "10px", marginTop: "5px", whiteSpace: "pre" }}>
        {maxBound} {units}
      </span>
    </div>
  );
};

export default ColorScale;
