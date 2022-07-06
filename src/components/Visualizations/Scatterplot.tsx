import { FC, useEffect, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import MuiTooltip from "@mui/material/Tooltip";


import ColorScale, { colors } from "./ColorScale";

import "../../scss/Scatterplot.scss";
import useStore from "../../utils/store";

interface ScatterplotProps {
  id: string;
  data: any[];
  xField: string;
  xUnits?: string;
  yField: string;
  yUnits?: string;
  colorField?: string;
  colorUnits?: string;
  isTrajectorySelector: boolean;
}
const Scatterplot: FC<ScatterplotProps> = ({ data, xField, xUnits, yField, yUnits, colorField, colorUnits, id, isTrajectorySelector = false }) => {
  const [selectedActiveValues, setActiveValues] = useState<number[]>([]);
  const [hoverValue, setHoverValue] = useState<number>(-1);
  const [minSelected, setMinSelected] = useState<number>(-1);
  const [maxSelected, setMaxSelected] = useState<number>(-1);

  const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);
  const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
  const selectedTrajectory = useStore((state) => state.selectedTrajectory);

  const selectedTrajectoryIdx = useMemo(() => {
    if (!data || selectedTrajectory === null) return -1;
    return data.findIndex((d) => d.id === selectedTrajectory.id);
  }, [data, selectedTrajectory]);

  const activeValues = useMemo(() => {
    if (selectedTrajectoryIdx === -1) return selectedActiveValues;
    return [selectedTrajectoryIdx, ...selectedActiveValues];
  }, [selectedTrajectoryIdx, selectedActiveValues]);

  const [minBound, maxBound] = useMemo(() => {
    if (!colorField || !data || !data.length) {
      return [0, 0];
    }
    const colorValues = data.map((entry) => entry[colorField]);
    return [Math.min(...colorValues), Math.max(...colorValues)];
  }, [data, colorField]);

  // Convert data point into a bounded value so that a color can be associated with it
  const normalizeValue = (value: number) => {
    return ((value - minBound) / (maxBound - minBound)) * 0.8 + 0.15;
  };

  // Clear selected values when trajectory is removed
  useEffect(() => {
    if (!confirmedSelectedTrajectory && isTrajectorySelector) {
      setActiveValues([])
    }
  }, [confirmedSelectedTrajectory, isTrajectorySelector, setActiveValues]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string; }) => {
    if (active && payload && payload.length) {
      let fields = [[xField, xUnits], [yField, yUnits], [colorField, colorUnits]].filter(([field]) => field !== undefined)

      return (
        <div className="chart-tooltip">
          {fields.map(([field, units], i) => {
            let value: number = field && payload[0].payload && payload[0].payload[field] !== undefined ? payload[0].payload[field] : null;
            let displayValue: string = value !== null ? value.toExponential() : "";
            return (
              <p key={`chart-tooltip-${field}-${i}`} className="label">
                {field}: <b>{displayValue}{units ? ` ${units}` : ""}</b>
              </p>
            )
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", maxHeight: "calc(100% - 15px)", alignItems: "center" }}
      id={id}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
        <h4 style={{ margin: 0, color: "#a1a1b5", fontSize: "12px" }}>
          <MuiTooltip title={`X Axis: ${xField}`}>
            <b style={{ fontWeight: 900 }}>{xField} </b>
          </MuiTooltip>
          vs
          <MuiTooltip title={`Y Axis: ${yField}`}>
            <b style={{ fontWeight: 900 }}> {yField}</b>
          </MuiTooltip>
          {colorField && <MuiTooltip title={`Color Field: ${colorField}`}>
            <span> (<b style={{ fontWeight: 900 }}>{colorField}</b>)</span>
          </MuiTooltip>}
        </h4>
        <div style={{ width: "calc(100% - 15px)", height: "100%" }} className="scatterplot-container">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 10,
                right: 0,
                left: 10,
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
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: any) => value.toExponential()} content={<CustomTooltip />} />
              <Scatter data={(data || [])} fill="#ffffff">
                {(data || []).map((entry, index) => {
                  let fill = "white";
                  let isWithinThreshold = activeValues.includes(index);
                  let isSelectedTrajectory = index === selectedTrajectoryIdx;
                  if (colorField && !isWithinThreshold && typeof entry[colorField] === "number") {
                    isWithinThreshold =
                      (hoverValue >= 0 && Math.abs(entry[colorField] - hoverValue) <= 0.05) ||
                      (minSelected >= 0 && entry[colorField] >= minSelected && entry[colorField] <= maxSelected);
                    fill = isWithinThreshold ? "white" : colors(normalizeValue(entry[colorField]));
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelectedTrajectory ? "blue" : fill}
                      style={{ stroke: isWithinThreshold ? "white" : "", strokeWidth: isSelectedTrajectory ? 6 : isWithinThreshold ? 3 : 0 }}
                      onClick={() => {
                        if (colorField && activeValues.includes(index) && (!isTrajectorySelector || confirmedSelectedTrajectory)) {
                          setActiveValues(activeValues.filter((value) => value !== index));
                        } else if (colorField) {
                          if (isTrajectorySelector && !confirmedSelectedTrajectory) {
                            setSelectedTrajectory(entry);
                          } else if (!isTrajectorySelector || confirmedSelectedTrajectory) {
                            setActiveValues([...activeValues, index]);
                          }
                        }
                      }}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
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
