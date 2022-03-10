import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useStore, { GraphConfig, VizTab } from "../utils/store";
import { FormControl, FormGroup, FormLabel, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import constants from "../utils/constants";
import "../scss/NewTabDialog.scss";

interface GraphRowProps {
  modifiedTab: VizTab;
  setModifiedTab: (tab: VizTab) => void;
  rowLabel: string;
  rowName: keyof VizTab;
}
const GraphRow: FC<GraphRowProps> = ({ modifiedTab, setModifiedTab, rowLabel, rowName }) => {
  return (
    <FormGroup>
      <FormLabel>{rowLabel}</FormLabel>
      <div style={{ display: "flex", flexWrap: "wrap", minWidth: "1000px" }}>
        {(modifiedTab[rowName] as GraphConfig[]).map((graphConfig: GraphConfig, i) => {
          return (
            <FormGroup className="graph-edit-group" style={{ flex: 1, margin: "5px" }}>
              <FormLabel style={{ marginBottom: "10px" }}>Graph {i}</FormLabel>
              <FormControl fullWidth>
                <InputLabel id={`top-${i}-graph-type-label`}>Type</InputLabel>
                <Select
                  variant="standard"
                  style={{ textAlign: "left", paddingLeft: "5px" }}
                  labelId={`top-${i}-graph-type-label`}
                  value={graphConfig.type}
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
                  {Object.entries(constants.GRAPH_TYPES).map(([graphType, options]: [string, any]) => (
                    <MenuItem value={graphType}>{options.label}</MenuItem>
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
                      <FormControl fullWidth style={{ margin: "5px" }}>
                        <InputLabel id={`${option}-${i}-graph-type-label`}>{label}</InputLabel>
                        {/* TODO: Convert to Autocomplete with full list of fields */}
                        <Select
                          variant="standard"
                          style={{ textAlign: "left", paddingLeft: "5px" }}
                          labelId={`${option}-${i}-graph-type-label`}
                          value={graphConfig[option as keyof GraphConfig]}
                          label={label}
                          onChange={(evt) => {
                            let row = [...(modifiedTab[rowName] as GraphConfig[])];
                            let modifiedGraphConfig: GraphConfig = { ...row[i] };
                            modifiedGraphConfig[option as keyof GraphConfig] = evt.target.value as string;
                            row[i] = modifiedGraphConfig;
                            let newTab = { ...modifiedTab };
                            // @ts-ignore
                            newTab[rowName] = row;
                            setModifiedTab(newTab);
                          }}
                        >
                          {Object.entries(constants.GRAPH_TYPES).map(([graphType, options]: [string, any]) => (
                            <MenuItem value={graphType}>{options.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  })}
              </div>
            </FormGroup>
          );
        })}
      </div>
    </FormGroup>
  );
};

interface NewTabDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  modifiedTab: VizTab;
  setModifiedTab: (modifiedTab: VizTab) => void;
}
const NewTabDialog: FC<NewTabDialogProps> = ({ open, setOpen, modifiedTab, setModifiedTab }) => {
  const [tabs, setTabs] = useStore((state) => [state.tabs, state.setTabs]);
  const setTab = useStore((state) => state.setTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="tab-dialog">
      <DialogTitle className="dialog-title">Tab {modifiedTab.id}</DialogTitle>
      <DialogContent className="tab-content">
        <TextField
          autoFocus
          className="tab-title-text"
          label="title"
          type="text"
          fullWidth
          variant="standard"
          value={modifiedTab.label}
          onChange={(evt) => {
            setModifiedTab({ ...modifiedTab, label: evt.target.value });
          }}
        />
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "15px" }}>
            <GraphRow modifiedTab={modifiedTab} setModifiedTab={setModifiedTab} rowLabel="Top Row" rowName="topRow" />
            <IconButton onClick={() => {}}>
              <AddIcon />
            </IconButton>
          </div>
          <div>
            <GraphRow
              modifiedTab={modifiedTab}
              setModifiedTab={setModifiedTab}
              rowLabel="Bottom Row"
              rowName="bottomRow"
            />
            <IconButton onClick={() => {}}>
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          style={{ marginRight: "auto" }}
          color="error"
          variant="contained"
          disabled={tabs.length === 1}
          onClick={() => {
            setOpen(false);
            let filteredTabs = tabs.filter((tab) => tab.id !== modifiedTab.id);
            setTabs(filteredTabs);
            if (filteredTabs.length > 0) {
              setActiveTab(filteredTabs[0].id);
            }
          }}
        >
          Delete
        </Button>
        <Button
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            let existingTab = tabs.filter((tab) => tab.id === modifiedTab.id)[0];
            if (existingTab.label !== "") {
              setModifiedTab(existingTab);
            } else {
              setTabs(tabs.filter((tab) => tab.id !== modifiedTab.id));
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            setTab(modifiedTab);
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTabDialog;
