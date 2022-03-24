import { FC, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { scaleOrdinal, scaleSequential } from "d3-scale";
import { schemeCategory10, interpolateRdBu } from "d3-scale-chromatic";

import "../../scss/Scatterplot.scss";

// const colors = scaleOrdinal(schemeCategory10).range();
const colors = scaleSequential(interpolateRdBu);

interface ScatterplotProps {
  data: any[];
  xField: string;
  yField: string;
  colorField?: string;
}
const Scatterplot: FC<ScatterplotProps> = ({ data, xField, yField, colorField }) => {
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
              left: -15,
            }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey={xField} name={xField} unit="cm" fill="#ffffff" style={{ fill: "#ffffff" }} />
            <YAxis type="number" dataKey={yField} name={yField} unit="kg" fill="#ffffff" style={{ fill: "#ffffff" }} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#ffffff">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorField && entry[colorField] ? colors(normalizeValue(entry[colorField])) : "white"}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {colorField && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <span style={{ color: "#a1a1b5" }}>{maxBound}</span>
          <div
            style={{
              height: "90%",
              width: "25px",
              background: `linear-gradient(${colors(normalizeValue(maxBound))}, ${colors(normalizeValue(minBound))})`,
            }}
          />
          <span style={{ color: "#a1a1b5" }}>{minBound}</span>
        </div>
      )}
    </div>
  );
};

export default Scatterplot;
