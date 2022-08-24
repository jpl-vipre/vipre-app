import { FC } from "react";
import useStore, { GraphConfig, VizTab } from "../utils/store";
import { FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import constants from "../utils/constants";
import OutlinedContainer from "./OutlinedContainer";
import AllFieldsSelect from "./AllFieldsSelect";

interface DialogGraphRowProps {
  modifiedTab: VizTab;
  setModifiedTab: (tab: VizTab) => void;
  rowLabel: string;
  rowName: keyof VizTab;
}
const DialogGraphRow: FC<DialogGraphRowProps> = ({ modifiedTab, setModifiedTab, rowLabel, rowName }) => {
  const schemas = useStore(state => state.schemas);

  return (
    <OutlinedContainer label={rowLabel}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {(modifiedTab[rowName] as GraphConfig[]).map((graphConfig: GraphConfig, i) => {
            return (
              <OutlinedContainer
                key={`${rowName}-${i}`}
                label={`Graph ${i}`}
                className="graph-edit-group"
                style={{ minWidth: "300px", maxWidth: "400px", width: "100%" }}
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
                      value={constants.GRAPH_SOURCES.includes(graphConfig.source || "") ? graphConfig.source : ""}
                      label="Source"
                      onChange={(evt) => {
                        let row = [...(modifiedTab[rowName] as GraphConfig[])];
                        row[i] = { ...row[i], source: evt.target.value };
                        let newTab = { ...modifiedTab };
                        // @ts-ignore
                        newTab[rowName] = row;
                        setModifiedTab(newTab);
                      }}
                    >
                      {constants.GRAPH_SOURCES.map((source: string, i: number) => (
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
                <div className="additional-options" style={{ display: "flex", flexWrap: "wrap", maxWidth: "400px", width: "100%" }}>
                  <div style={{ display: "flex", flex: 1, maxWidth: "400px", width: "100%" }}>
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
                            style={{ minWidth: "100px" }}
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
                      .map(([_, option, label]) => {
                        return (
                          <TextField
                            style={{ margin: "5px", minWidth: "100px" }}
                            key={`${option}-axis-units`}
                            label={label}
                            type="text"
                            variant="standard"
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
          })}
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
