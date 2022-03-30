import { FC, useMemo } from "react";

import { Tooltip } from "@mui/material";

import "../../scss/ColorScale.scss";

interface ColorScaleProps {
  minBound: number;
  maxBound: number;
  interpolateColorValue: (value: number) => string;
  units?: string;
  steps?: number;
  activeValues?: number[];
}
const ColorScale: FC<ColorScaleProps> = ({
  minBound,
  maxBound,
  interpolateColorValue,
  units,
  steps = 100,
  activeValues,
}) => {
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
        {maxBound} {units}
      </span>
      <div
        style={{
          height: "90%",
          minWidth: "25px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.from(new Array(steps)).map((_, i) => {
          let value = minBound + (i / steps) * (maxBound - minBound);
          let hoverText = closestActiveValues[value]
            ? closestActiveValues[value].join(` ${units || "units"}, `) + ` ${units || "units"}`
            : `${Math.round(value * 100) / 100} ${units || "units"}`;
          return (
            <Tooltip title={hoverText}>
              <div
                className={`color-scale-bar${closestActiveValues[value] ? " active" : ""}`}
                style={{
                  flex: 1,
                  background: `${interpolateColorValue(value)}`,
                  outlineWidth: closestActiveValues[value] ? `${closestActiveValues[value].length + 1}px` : "2px",
                }}
              />
            </Tooltip>
          );
        })}
      </div>
      <span style={{ color: "#a1a1b5", fontSize: "10px", marginTop: "5px", whiteSpace: "pre" }}>
        {minBound} {units}
      </span>
    </div>
  );
};

export default ColorScale;
