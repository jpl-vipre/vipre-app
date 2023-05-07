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

import { FC, useMemo } from "react";
import useStore, { GraphConfig, VizTab } from "../utils/store";
import { FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import constants from "../utils/constants";
import OutlinedContainer from "./OutlinedContainer";
import AllFieldsSelect from "./AllFieldsSelect";

interface DialogGraphItemProps {
  modifiedTab: VizTab;
  setModifiedTab: (tab: VizTab) => void;
  rowName: keyof VizTab;
  graphConfig: GraphConfig;
  i: number;
}
const DialogGraphItem: FC<DialogGraphItemProps> = ({ modifiedTab, setModifiedTab, rowName, graphConfig, i }) => {
  const schemas = useStore(state => state.schemas);
  const sources = useMemo(() => {
    let graphSources = constants.GRAPH_SOURCES;
    if (graphConfig.type === "table") {
      graphSources = [...graphSources, "targetedBodies", "flybys", "occultations"];
    }
    return graphSources;
  }, [graphConfig]);

  return (
    <OutlinedContainer
      label={`Graph ${i + 1}`}
      className="graph-edit-group"
      style={{ minWidth: "300px", maxWidth: "305px", width: "100%" }}
    >
      <div style={{ display: "flex" }}>
        <FormControl fullWidth style={{ marginBottom: "5px" }}>
          <InputLabel id={`top-${i}-graph-type-label`}>Type</InputLabel>
          <Select
            variant="standard"
            style={{ textAlign: "left", paddingLeft: "5px" }}
            labelId={`top-${i}-graph-type-label`}
            value={Object.keys(constants.GRAPH_TYPES).includes(graphConfig.type) ? graphConfig.type : ""}
            label="Type"
            onChange={(evt) => {
              let row = [...(modifiedTab[rowName] as GraphConfig[])];
              row[i] = { ...row[i], type: evt.target.value };
              if (evt.target.value === "globe") {
                row[i]["source"] = "entries";
                row[i]["globeType"] = "entryPoint";
              }
              let newTab = { ...modifiedTab };
              // @ts-ignore
              newTab[rowName] = row;
              setModifiedTab(newTab);
            }}
          >
            {Object.entries(constants.GRAPH_TYPES).map(([graphType, options]: [string, any], i: number) => (
              <MenuItem key={`${options.label}-${graphType}-${i}`} value={graphType}>
                {options.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {graphConfig.type !== "globe" && <FormControl fullWidth style={{ marginBottom: "5px", marginLeft: "10px" }}>
          <InputLabel id={`top-${i}-graph-source-label`}>Source</InputLabel>
          <Select
            variant="standard"
            style={{ textAlign: "left", paddingLeft: "5px" }}
            labelId={`top-${i}-graph-source-label`}
            value={sources.includes(graphConfig.source || "") ? graphConfig.source : ""}
            label="Source"
            onChange={(evt) => {
              let row = [...(modifiedTab[rowName] as GraphConfig[])];
              row[i] = { ...row[i], source: evt.target.value };
              if (evt.target.value === "dataRates") {
                row[i]["xAxis"] = "time";
                row[i]["xUnits"] = "seconds past entry";
                row[i]["yAxis"] = "data_rate";
                row[i]["yUnits"] = "kbps";
              }
              let newTab = { ...modifiedTab };
              // @ts-ignore
              newTab[rowName] = row;
              setModifiedTab(newTab);
            }}
          >
            {sources.map((source: string, i: number) => (
              <MenuItem key={`${source}-${i}`} value={source}>
                {source[0].toUpperCase()}{source.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>}
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        {graphConfig.type === "globe" && <FormControl style={{ margin: "5px" }}>
          <FormLabel id="globe-viz-type">Globe Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="globe-viz-type"
            defaultValue="entryPoint"
            name="globe-viz-type-group"
            value={graphConfig.globeType}
            onChange={(evt) => {
              let row = [...(modifiedTab[rowName] as GraphConfig[])];
              row[i] = { ...row[i], globeType: evt.target.value };
              let newTab = { ...modifiedTab };
              // @ts-ignore
              newTab[rowName] = row;
              setModifiedTab(newTab);
            }}
          >
            <FormControlLabel value="entryPoint" control={<Radio />} label="Entry Points" />
            <FormControlLabel value="arc" control={<Radio />} label="Trajectories" />
          </RadioGroup>
        </FormControl>}
      </div>
      <div className="additional-options" style={{ display: "flex", flexWrap: "wrap", maxWidth: "305px", width: "100%" }}>
        <div style={{ display: "flex", flex: 1, maxWidth: "305px", width: "100%" }}>
          {[
            ["xAxis", "X Axis", "xUnits"],
            ["yAxis", "Y Axis", "yUnits"],
            ["color", "Color", "colorUnits"],
          ]
            .filter(([option]: any) => (constants.GRAPH_TYPES as any)[graphConfig.type as any][option] && (graphConfig.type !== "globe" || (option !== "color" || !graphConfig.globeType || graphConfig.globeType === "entryPoint")))
            .map(([option, label, unitField]) => {
              let row = [...(modifiedTab[rowName] as GraphConfig[])];
              let modifiedGraphConfig: GraphConfig = { ...row[i] };

              return (
                <AllFieldsSelect
                  style={{ minWidth: "75px" }}
                  disabled={!modifiedGraphConfig.source && graphConfig.type !== "globe"}
                  source={modifiedGraphConfig.source ? modifiedGraphConfig.source : graphConfig.type === "globe" ? "entries" : "trajectories"}
                  key={`${option}-axis`}
                  label={label}
                  value={graphConfig[option as keyof GraphConfig]}
                  clearable={true}
                  useFilterFields={false}
                  onChange={(value) => {
                    modifiedGraphConfig[option as keyof GraphConfig] = value;
                    // @ts-ignore
                    if (schemas && schemas[value] && schemas[value]["units"]) {
                      // @ts-ignore
                      modifiedGraphConfig[unitField as keyof GraphConfig] = schemas[value]["units"] as string;
                    }

                    if (graphConfig.type === "globe" && !graphConfig.globeType) {
                      modifiedGraphConfig.globeType = "entryPoint";
                      modifiedGraphConfig.source = "entries";
                    }

                    row[i] = modifiedGraphConfig;
                    let newTab = { ...modifiedTab };
                    // @ts-ignore
                    newTab[rowName] = row;
                    setModifiedTab(newTab);
                  }}
                />
              );
            })}
        </div>
        <div style={{ display: "flex", flex: 1, maxWidth: "400px", width: "100%" }} className="axis-units">
          {[
            ["xAxis", "xUnits", "X Units"],
            ["yAxis", "yUnits", "Y Units"],
            ["color", "colorUnits", "Color Units"],
          ]
            .filter(([option]: any) => (constants.GRAPH_TYPES as any)[graphConfig.type as any][option] && (graphConfig.type !== "globe" || (option !== "color" || !graphConfig.globeType || graphConfig.globeType === "entryPoint")))
            .map(([field, option, label]) => {
              let row = [...(modifiedTab[rowName] as GraphConfig[])];
              let modifiedGraphConfig: GraphConfig = { ...row[i] };

              return (
                <TextField
                  style={{ margin: "5px", minWidth: "75px" }}
                  key={`${option}-axis-units`}
                  label={label}
                  type="text"
                  variant="standard"
                  // @ts-ignore
                  disabled={!!(modifiedGraphConfig[option] && schemas[graphConfig[field]] && schemas[graphConfig[field]]["units"])}
                  value={graphConfig[option as keyof GraphConfig]}
                  onChange={(evt: any) => {
                    let row = [...(modifiedTab[rowName] as GraphConfig[])];
                    let modifiedGraphConfig: GraphConfig = { ...row[i] };
                    modifiedGraphConfig[option as keyof GraphConfig] = evt.target.value;
                    row[i] = modifiedGraphConfig;
                    let newTab = { ...modifiedTab };
                    // @ts-ignore
                    newTab[rowName] = row;
                    setModifiedTab(newTab);
                  }}
                />
              );
            })}
        </div>
      </div>
      <IconButton
        onClick={() => {
          let row = [...(modifiedTab[rowName] as GraphConfig[])].filter((_, j) => i !== j);
          let newTab = { ...modifiedTab };
          // @ts-ignore
          newTab[rowName] = row;
          setModifiedTab(newTab);
        }}
        style={{ marginLeft: "auto" }}
      >
        <RemoveCircleOutlineIcon color="error" />
      </IconButton>
    </OutlinedContainer>
  );
}

interface DialogGraphRowProps {
  modifiedTab: VizTab;
  setModifiedTab: (tab: VizTab) => void;
  rowLabel: string;
  rowName: keyof VizTab;
}
const DialogGraphRow: FC<DialogGraphRowProps> = ({ modifiedTab, setModifiedTab, rowLabel, rowName }) => {
  return (
    <OutlinedContainer label={rowLabel}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {(modifiedTab[rowName] as GraphConfig[]).map((graphConfig: GraphConfig, i) =>
            <DialogGraphItem
              key={`${rowName}-${i}`}
              modifiedTab={modifiedTab}
              setModifiedTab={setModifiedTab}
              rowName={rowName}
              graphConfig={graphConfig}
              i={i}
            />
          )}
        </div>
        {(modifiedTab[rowName] as GraphConfig[]).length < 5 && (
          <div style={{ display: "flex" }}>
            <IconButton
              onClick={() => {
                let row = [
                  ...(modifiedTab[rowName] as GraphConfig[]),
                  {
                    type: "scatterplot",
                    xAxis: "",
                    yAxis: "",
                    color: "",
                  },
                ];
                let newTab = { ...modifiedTab };
                // @ts-ignore
                newTab[rowName] = row;
                setModifiedTab(newTab);
              }}
              style={{ margin: "auto" }}
            >
              <AddIcon />
            </IconButton>
          </div>
        )}
      </div>
    </OutlinedContainer>
  );
};

export default DialogGraphRow;
