import { FC, useMemo, useState } from "react";

import { Tooltip } from "@mui/material";

import "../../scss/ColorScale.scss";

interface ColorScaleProps {
  id: string;
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
  id,
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
      return [-1, -1];
    }
    let selectedRange = [minSelected, maxSelected];

    let closestValues = [-1, -1].map((_, i) => {
      let closestValue = -1;
      Array.from(new Array(steps + 1)).forEach((_, j) => {
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
      <Tooltip title={`${minBound.toExponential()} ${units}`}>
        <span style={{ color: "#a1a1b5", fontSize: "10px", marginBottom: "5px", whiteSpace: "pre" }}>
          {`${minBound.toFixed(2)}`} {units}
        </span>
      </Tooltip>
      <div
        id={id}
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

          let hasValidMinMax = closestMinMax && closestMinMax.length === 2 && closestMinMax[0] !== -1 && value !== -1;
          let isWithinRange =
            hasValidMinMax &&
            typeof minSelected === "number" &&
            typeof maxSelected === "number" &&
            value >= minSelected &&
            value <= maxSelected;

          return (
            <Tooltip title={hoverText} placement="right" key={`${id}-${i}`}>
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
                onDoubleClick={() => {
                  setFirstSelectedValue(-1);
                  if (setMinSelected) setMinSelected(-1);
                  if (setMaxSelected) setMaxSelected(-1);
                  if (setHoverValue) setHoverValue(-1);
                }}
                className={`color-scale-bar${closestActiveValues[value] ? " active" : ""}`}
                style={{
                  flex: 1,
                  background: `${interpolateColorValue(value)}`,
                  borderTop: hasValidMinMax && value === closestMinMax[0] ? "2px solid white" : "none",
                  borderBottom: hasValidMinMax && value === closestMinMax[1] ? "2px solid white" : "none",
                  borderRight: isWithinRange ? "2px solid white" : "none",
                  borderLeft: isWithinRange ? "2px solid white" : "none",
                  marginLeft: isWithinRange ? "-2px" : 0,
                  marginRight: isWithinRange ? "-2px" : 0,
                  marginTop: hasValidMinMax && value === closestMinMax[0] ? "-2px" : 0,
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
      <Tooltip title={`${maxBound.toExponential()} ${units}`}>
        <span style={{ color: "#a1a1b5", fontSize: "10px", marginTop: "5px", whiteSpace: "pre" }}>
          {maxBound.toFixed(2)} {units}
        </span>
      </Tooltip>
    </div>
  );
};

export default ColorScale;
