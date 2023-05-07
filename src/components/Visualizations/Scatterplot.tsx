/**
 * Copyright (c) 2021-2023 California Institute of Technology ("Caltech"). U.S.
 * Government sponsorship acknowledged.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of Caltech nor its operating division, the Jet Propulsion
 *   Laboratory, nor the names of its contributors may be used to endorse or
 *   promote products derived from this software without specific prior written
 *   permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import { FC, useEffect, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Label } from "recharts";
import MuiTooltip from "@mui/material/Tooltip";
import * as math from "mathjs";

import constants from "../../utils/constants";

import { digitToSuperScript } from "../../utils/helpers";

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
  isSelectable: boolean;
  dataSource?: string;
}
const Scatterplot: FC<ScatterplotProps> = ({ data, xField, xUnits, yField, yUnits, colorField, colorUnits, id, isTrajectorySelector = false, isSelectable = true, dataSource = "" }) => {
  const [selectedActiveValues, setActiveValues] = useState<number[]>([]);
  const [hoverValue, setHoverValue] = useState<number>(-1);
  const [minSelected, setMinSelected] = useState<number>(-1);
  const [maxSelected, setMaxSelected] = useState<number>(-1);

  const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);
  const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
  const selectedTrajectory = useStore((state) => state.selectedTrajectory);
  const [selectedEntries, setSelectedEntries] = useStore(state => [state.selectedEntries, state.setSelectedEntries]);

  useEffect(() => {
    if (!isTrajectorySelector && isSelectable) {
      setActiveValues(selectedEntries.map(entry => data.findIndex(row => row.id === entry.id)));
    }
  }, [selectedEntries, data, isTrajectorySelector, isSelectable])

  const selectedTrajectoryIdx = useMemo(() => {
    if (!data || selectedTrajectory === null || !isTrajectorySelector || !isSelectable) return -1;
    return data.findIndex((d) => d.id === selectedTrajectory.id);
  }, [data, selectedTrajectory, isTrajectorySelector, isSelectable]);

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
      let fields = [[xField, xUnits], [yField, yUnits], [colorField, colorUnits]].filter(([field]) => !!field).map(([field, units]) => ([field, units?.replace(/\^[0-9]/g, digitToSuperScript)]));
      let otherFields: [string, string][] = [];
      if (payload && payload[0]?.payload) {
        otherFields = Object.entries(payload[0].payload || {}).filter(([field, value]) => ![xField, yField, colorField].includes(field) && typeof value !== "object").map(([field]) => ([field, ""]));
      }

      return (
        <div className="chart-tooltip">
          {fields.map(([field, units], i) => {
            let value: number = field && payload[0].payload && payload[0].payload[field] !== undefined ? payload[0].payload[field] : null;

            // math.
            // math.format(2000, { lowerExp: -2, upperExp: 2 })  
            let displayValue: string = value !== null ? math.format(value, { lowerExp: -3, upperExp: 8 }).toString() : "";
            return (
              <p key={`chart-tooltip-${field}-${i}`} className="label">
                {field}: <b>{displayValue}{units ? ` ${units}` : ""}</b>
              </p>
            )
          })}
          <div className="tooltip-split"></div>
          {otherFields.map(([field, units], i) => {
            let value: number = field && payload[0].payload && payload[0].payload[field] !== undefined ? payload[0].payload[field] : null;
            let displayValue: string = value !== null && typeof value === "number" ? math.round(value, 3).toString() : `${value}`;
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

  const [xFieldLabel, yFieldLabel, colorFieldLabel] = useMemo(() => {
    return [xField, yField, colorField].map(field => {
      return field;
    })
  }, [xField, yField, colorField]);

  let xFieldLabelWithUnits = `${xFieldLabel} (${xUnits?.replace(/\^[0-9]/g, digitToSuperScript)})`;
  let yFieldLabelWithUnits = `${yFieldLabel} (${yUnits?.replace(/\^[0-9]/g, digitToSuperScript)})`;

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", maxHeight: "calc(100% - 15px)", alignItems: "center" }}
      id={id}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative" }}>
        <h4 style={{ margin: 0, color: "#a1a1b5", fontSize: "16px", position: "absolute", bottom: -7 }}>{dataSource ? `${dataSource[0].toUpperCase()}${dataSource.slice(1)}` : ""}</h4>
        <h4 style={{ margin: 0, color: "white", fontSize: "16px" }}>
          <MuiTooltip title={`X Axis: ${xFieldLabelWithUnits}`}>
            <b style={{ fontWeight: 900 }}>{xFieldLabel} </b>
          </MuiTooltip>
          vs
          <MuiTooltip title={`Y Axis: ${yFieldLabelWithUnits}`}>
            <b style={{ fontWeight: 900 }}> {yFieldLabel}</b>
          </MuiTooltip>
          {colorField && <MuiTooltip title={`Color Field: ${colorFieldLabel} (${colorUnits?.replace(/\^[0-9]/g, digitToSuperScript) || "No Units"})`}>
            <span> (<b style={{ fontWeight: 900 }}>{colorFieldLabel}</b>)</span>
          </MuiTooltip>}
        </h4>
        <div style={{ width: "calc(100% - 15px)", height: "100%" }} className="scatterplot-container">
          <ResponsiveContainer width="100%" height="97%">
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
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toPrecision(2)}
                fill="#ffffff"
                style={{ fill: "#ffffff" }}
              >
                <Label value={xFieldLabelWithUnits} offset={2} position="insideBottom" fill="white" fontSize={14} />
              </XAxis>
              <YAxis
                type="number"
                dataKey={yField}
                name={yField}
                domain={["auto", "auto"]}
                tickFormatter={(value) => value.toPrecision(2)}
                fill="#ffffff"
                style={{ fill: "#ffffff" }}
                label={{ value: yFieldLabelWithUnits, dy: yFieldLabelWithUnits.length * 3, angle: -90, position: 'insideLeft', fill: "white", fontSize: 14 }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: any) => value.toExponential()} content={<CustomTooltip />} />
              <Scatter data={(data || [])} fill="#ffffff">
                {((confirmedSelectedTrajectory || isTrajectorySelector || !isSelectable) && data ? data : []).map((entry, index) => {
                  let fill = "white";
                  let stroke = "white";
                  let isWithinThreshold = activeValues.includes(index);


                  let selectedEntryIndex = isSelectable && entry?.id ? selectedEntries.findIndex((selectedEntry) => selectedEntry.id === entry.id) : -1;
                  let isSelectedEntry = !isTrajectorySelector && selectedEntryIndex >= 0;
                  if (isSelectedEntry) {
                    fill = "black";
                    stroke = constants.TRAJECTORY_COLORS[selectedEntryIndex % constants.TRAJECTORY_COLORS.length];
                  }

                  let isSelectedTrajectory = isSelectable && index === selectedTrajectoryIdx;
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
                        if (isSelectable) {
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
