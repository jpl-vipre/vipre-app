import { FC, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { scaleOrdinal, scaleSequential } from "d3-scale";
import { schemeCategory10, interpolateSpectral } from "d3-scale-chromatic";

import ColorScale from "./ColorScale";

import "../../scss/Scatterplot.scss";

// const colors = scaleOrdinal(schemeCategory10).range();
const colors = scaleSequential(interpolateSpectral);

interface ScatterplotProps {
  data: any[];
  xField: string;
  xUnits?: string;
  yField: string;
  yUnits?: string;
  colorField?: string;
  colorUnits?: string;
}
const Scatterplot: FC<ScatterplotProps> = ({ data, xField, xUnits, yField, yUnits, colorField, colorUnits }) => {
  const [activeValues, setActiveValues] = useState<number[]>([]);

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
    >
      <div style={{ width: "100%", height: "100%", flex: 1 }} className="scatterplot-container">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 10,
              right: 30,
              // bottom: 20,
              left: -5,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey={xField}
              name={xField}
              unit={xUnits || ""}
              fill="#ffffff"
              style={{ fill: "#ffffff" }}
            />
            <YAxis
              type="number"
              dataKey={yField}
              name={yField}
              unit={yUnits || ""}
              fill="#ffffff"
              style={{ fill: "#ffffff" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#ffffff">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorField && entry[colorField] ? colors(normalizeValue(entry[colorField])) : "white"}
                  onClick={() => {
                    if (colorField && activeValues.includes(index)) {
                      setActiveValues(activeValues.filter((value) => value !== index));
                    } else if (colorField) {
                      setActiveValues([...activeValues, index]);
                    }
                  }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {colorField && (
        <ColorScale
          minBound={minBound}
          maxBound={maxBound}
          units={colorUnits}
          interpolateColorValue={(value) => colors(normalizeValue(value))}
          activeValues={activeValues
            .filter((i) => colorField && data[i] && data[i][colorField] !== undefined)
            .map((i) => data[i][colorField])}
        />
      )}
    </div>
  );
};

export default Scatterplot;
