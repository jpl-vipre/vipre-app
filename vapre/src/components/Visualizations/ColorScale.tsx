import { FC } from "react";

import { Tooltip } from "@mui/material";

import "../../scss/ColorScale.scss";

interface ColorScaleProps {
  minBound: number;
  maxBound: number;
  interpolateColorValue: (value: number) => string;
  units?: string;
  steps?: number;
}
const ColorScale: FC<ColorScaleProps> = ({ minBound, maxBound, interpolateColorValue, units, steps = 100 }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} className="color-scale">
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
          return (
            <Tooltip title={`${Math.round(value * 100) / 100} ${units || "units"}`}>
              <div
                className="color-scale-bar"
                style={{
                  flex: 1,
                  background: `${interpolateColorValue(value)}`,
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
