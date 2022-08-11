import { FC, useEffect, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import MuiTooltip from "@mui/material/Tooltip";
import constants from "../../utils/constants";

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
  const [selectedEntries, setSelectedEntries] = useStore(state => [state.selectedEntries, state.setSelectedEntries]);

  useEffect(() => {
    if (!isTrajectorySelector) {
      let newActiveValues: number[] = [];
      selectedEntries.forEach((entry) => {
        selectedActiveValues.forEach(i => {
          if (entry.id === data[i].id) {
            newActiveValues.push(i);
          }
        })
      });

      if (newActiveValues.length !== selectedActiveValues.length) {
        setActiveValues(newActiveValues);
      }
    }
  }, [selectedEntries, selectedActiveValues, data, isTrajectorySelector])

  const selectedTrajectoryIdx = useMemo(() => {
    if (!data || selectedTrajectory === null || !isTrajectorySelector) return -1;
    return data.findIndex((d) => d.id === selectedTrajectory.id);
  }, [data, selectedTrajectory, isTrajectorySelector]);

  const activeValues = useMemo(() => {
    if (selectedTrajectoryIdx === -1) return selectedActiveValues;
    return [selectedTrajectoryIdx, ...selectedActiveValues];
  }, [selectedTrajectoryIdx, selectedActiveValues]);

  const [minBound, maxBound, steps] = useMemo(() => {
    if (!colorField || !data || !data.length) {
      return [0, 0, 1];
    }
    const colorValues = data.map((entry) => entry[colorField]);
    let min = Math.min(...colorValues);
    let max = Math.max(...colorValues);
    let steps = Math.ceil(Math.max(Math.min((max - min) / 0.01, 100), 1));

    return [min, max, steps];
  }, [data, colorField]);

  // Convert data point into a bounded value so that a color can be associated with it
  const normalizeValue = (value: number) => {
    if (maxBound <= minBound) {
      return 0.15;
    }
    else {
      return ((value - minBound) / (maxBound - minBound)) * 0.8 + 0.15;
    }
  };

  // Clear selected values when trajectory is removed
  useEffect(() => {
    setActiveValues([]);
  }, [confirmedSelectedTrajectory, setActiveValues]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string; }) => {
    if (active && payload && payload.length) {
      let fields = [[xField, xUnits], [yField, yUnits], [colorField, colorUnits]].filter(([field]) => !!field);
      let otherFields: [string, string][] = [];
      if (payload && payload[0]?.payload) {
        otherFields = Object.entries(payload[0].payload || {}).filter(([field, value]) => ![xField, yField, colorField].includes(field) && typeof value !== "object").map(([field]) => ([field, ""]))
      }

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
          <div className="tooltip-split"></div>
          {otherFields.map(([field, units], i) => {
            let value: number = field && payload[0].payload && payload[0].payload[field] !== undefined ? payload[0].payload[field] : null;
            let displayValue: string = value !== null && typeof value === "number" ? value.toExponential() : "";
            return (
              <p key={`chart-tooltip-other-${field}-${i}`} className="label">
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
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative" }}>
        <h4 style={{ margin: 0, color: "#a1a1b5", fontSize: "12px", position: "absolute", top: -5 }}>{isTrajectorySelector ? "Trajectory" : "Entry"}</h4>
        <h4 style={{ margin: 0, color: "white", fontSize: "12px" }}>
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
                {((confirmedSelectedTrajectory || isTrajectorySelector) && data ? data : []).map((entry, index) => {
                  let fill = "white";
                  let stroke = "white";
                  let isWithinThreshold = activeValues.includes(index);

                  let selectedEntryIndex = selectedEntries.findIndex((selectedEntry) => selectedEntry.id === entry.id);
                  let isSelectedEntry = !isTrajectorySelector && selectedEntryIndex >= 0;
                  if (isSelectedEntry) {
                    fill = "black";
                    stroke = constants.TRAJECTORY_COLORS[selectedEntryIndex % constants.TRAJECTORY_COLORS.length];
                  }

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
                      style={{ stroke: isWithinThreshold || isSelectedEntry || isSelectedTrajectory ? stroke : "", strokeWidth: isSelectedEntry || isSelectedTrajectory ? 6 : isWithinThreshold ? 3 : 0 }}
                      onClick={() => {
                        if (activeValues.includes(index) && (!isTrajectorySelector || confirmedSelectedTrajectory)) {
                          setActiveValues(activeValues.filter((value) => value !== index));
                          setSelectedEntries(selectedEntries.filter(selectedEntry => selectedEntry.id !== data[index].id));
                        } else {
                          if (isTrajectorySelector && !confirmedSelectedTrajectory) {
                            setSelectedTrajectory(entry, true);
                          } else if (!isTrajectorySelector && confirmedSelectedTrajectory) {
                            setActiveValues([...activeValues, index]);
                            setSelectedEntries([...selectedEntries, entry]);
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
          steps={steps}
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
