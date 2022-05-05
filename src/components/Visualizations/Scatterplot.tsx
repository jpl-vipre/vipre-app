import { FC, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";

import ColorScale from "./ColorScale";

import "../../scss/Scatterplot.scss";

const colors = scaleSequential(interpolateSpectral);

interface ScatterplotProps {
  id: string;
  data: any[];
  xField: string;
  xUnits?: string;
  yField: string;
  yUnits?: string;
  colorField?: string;
  colorUnits?: string;
}
const Scatterplot: FC<ScatterplotProps> = ({ data, xField, xUnits, yField, yUnits, colorField, colorUnits, id }) => {
  const [activeValues, setActiveValues] = useState<number[]>([]);
  const [hoverValue, setHoverValue] = useState<number>(-1);
  const [minSelected, setMinSelected] = useState<number>(-1);
  const [maxSelected, setMaxSelected] = useState<number>(-1);

  const [minBound, maxBound] = useMemo(() => {
    if (!colorField || !data.length) {
      return [0, 0];
    }
    const colorValues = data.map((entry) => entry[colorField]);
    return [Math.min(...colorValues), Math.max(...colorValues)];
  }, [data, colorField]);

  const normalizeValue = (value: number) => {
    return ((value - minBound) / (maxBound - minBound)) * 0.8 + 0.15;
  };

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", maxHeight: "calc(100% - 15px)", alignItems: "center" }}
      id={id}
    >
      <div style={{ width: "calc(100% - 50px)", height: "100%" }} className="scatterplot-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 10,
              right: 30,
              left: -5,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey={xField}
              name={xField}
              unit={xUnits || ""}
              domain={["auto", "auto"]}
              tickFormatter={(value) => value.toPrecision(2)}
              fill="#ffffff"
              style={{ fill: "#ffffff" }}
            />
            <YAxis
              type="number"
              dataKey={yField}
              name={yField}
              domain={["auto", "auto"]}
              tickFormatter={(value) => value.toPrecision(2)}
              unit={yUnits || ""}
              fill="#ffffff"
              style={{ fill: "#ffffff" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: any) => value.toExponential()} />
            <Scatter data={data} fill="#ffffff">
              {data.map((entry, index) => {
                let fill = "white";
                let isWithinThreshold = activeValues.includes(index);
                if (colorField && !isWithinThreshold && typeof entry[colorField] === "number") {
                  isWithinThreshold =
                    (hoverValue >= 0 && Math.abs(entry[colorField] - hoverValue) <= 0.05) ||
                    (minSelected >= 0 && entry[colorField] >= minSelected && entry[colorField] <= maxSelected);
                  fill = isWithinThreshold ? "white" : colors(normalizeValue(entry[colorField]));
                }

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    style={{ stroke: isWithinThreshold ? "white" : "", strokeWidth: isWithinThreshold ? 3 : 0 }}
                    onClick={() => {
                      if (colorField && activeValues.includes(index)) {
                        setActiveValues(activeValues.filter((value) => value !== index));
                      } else if (colorField) {
                        setActiveValues([...activeValues, index]);
                      }
                    }}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {colorField && (
        <ColorScale
          id={`${id}-color-scale`}
          minBound={minBound}
          maxBound={maxBound}
          units={colorUnits}
          interpolateColorValue={(value) => colors(normalizeValue(value))}
          setHoverValue={setHoverValue}
          minSelected={minSelected}
          setMinSelected={setMinSelected}
          maxSelected={maxSelected}
          setMaxSelected={setMaxSelected}
          activeValues={activeValues
            .filter((i) => colorField && data[i] && data[i][colorField] !== undefined)
            .map((i) => data[i][colorField])}
        />
      )}
    </div>
  );
};

export default Scatterplot;
