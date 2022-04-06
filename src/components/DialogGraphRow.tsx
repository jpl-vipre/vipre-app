import { FC } from "react";
import { GraphConfig, VizTab } from "../utils/store";
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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
                style={{ minWidth: "300px", maxWidth: "300px" }}
              >
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
                <div style={{ display: "flex" }}>
                  {[
                    ["xAxis", "X Axis"],
                    ["yAxis", "Y Axis"],
                    ["color", "Color"],
                  ]
                    .filter(([option]: any) => (constants.GRAPH_TYPES as any)[graphConfig.type as any][option])
                    .map(([option, label]) => {
                      return (
                        <AllFieldsSelect
                          key={`${option}-axis`}
                          label={label}
                          value={graphConfig[option as keyof GraphConfig]}
                          onChange={(value) => {
                            let row = [...(modifiedTab[rowName] as GraphConfig[])];
                            let modifiedGraphConfig: GraphConfig = { ...row[i] };
                            modifiedGraphConfig[option as keyof GraphConfig] = value;
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
                <div style={{ display: "flex" }} className="axis-units">
                  {[
                    ["xAxis", "xUnits", "X Units"],
                    ["yAxis", "yUnits", "Y Units"],
                    ["color", "colorUnits", "Color Units"],
                  ]
                    .filter(([option]: any) => (constants.GRAPH_TYPES as any)[graphConfig.type as any][option])
                    .map(([_, option, label]) => {
                      return (
                        <TextField
                          style={{ margin: "5px" }}
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
