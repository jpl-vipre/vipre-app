import { FC, useState, useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select, ListSubheader, Button, Divider, IconButton, Snackbar, Alert, Tooltip, TextField } from "@mui/material";

import useStore from "../utils/store";
import constants from "../utils/constants";
import "../scss/SettingsView.scss";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// @ts-ignore
const { ipcRenderer } = window.require("electron");

const SettingsView: FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const configPathHistory = useStore(state => state.configPathHistory);
  const setConfigPathHistory = useStore(state => state.setConfigPathHistory);

  const [filterList, setFilterList] = useStore(state => [state.filterList, state.setFilterList]);
  const [tabs, setTabs] = useStore(state => [state.tabs, state.setTabs]);
  const [relayVolumeScale, setRelayVolumeScale] = useStore(state => [state.relayVolumeScale, state.setRelayVolumeScale]);
  const [launchVehicleName, setLaunchVehicle] = useStore(state => [state.launchVehicleName, state.setLaunchVehicle]);

  const [isErrorStatus, setIsErrorStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    ipcRenderer.on("config-exported", (evt: any, info: any) => {
      if (info && info.path) {
        setSelectedConfig(info.path);
        setIsErrorStatus(false);
        setStatusMessage(`Successfully exported ${info.path}`);
      } else {
        setIsErrorStatus(true);
        setStatusMessage("Error exporting config, please retry.");
      }
    });

    ipcRenderer.on("config-imported", (evt: any, info: any) => {
      if (info && info.path) {
        setSelectedConfig(info.path);
        setConfigPathHistory(Array.from(new Set([...configPathHistory, info.path])))

        if (info && info.config && info.config.filterList && info.config.tabs) {
          setFilterList(info.config.filterList);
          setTabs(info.config.tabs);

          setIsErrorStatus(false);
          setStatusMessage(`Successfully imported ${info.path}`);
        } else {
          setIsErrorStatus(true);
          setStatusMessage("Import Failed. Malformed config file.");
        }
      } else {
        setIsErrorStatus(true);
        setStatusMessage("Import Failed. Couldn't find config file.");
      }
    });

  }, [configPathHistory, setFilterList, setTabs, setConfigPathHistory]);

  return (
    <div className="settings-container">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px" }}>
        <h1>Settings</h1>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "15px", width: "100%" }}>
          <div style={{ display: "flex", margin: "auto" }}>
            <div style={{ marginRight: "5px" }}>
              <Tooltip title="Export Config">
                <IconButton onClick={() => {
                  ipcRenderer.send("export-config", { filterList, tabs });
                }}>
                  <FileDownloadIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
            <FormControl style={{ width: "375px" }}>
              <InputLabel id="config-select-label">Import Configuration File</InputLabel>
              <Select
                id="config-select"
                value={selectedConfig}
                placeholder="Import Configuration File"
                label="Import Configuration File"
                labelId="config-select-label"
                onChange={(evt) => {
                  if (evt.target.value === "local") {
                    ipcRenderer.send("import-config", {
                      chooseFile: true
                    });
                  } else {
                    setSelectedConfig(evt.target.value);
                    setConfigPathHistory(Array.from(new Set([...configPathHistory, evt.target.value])))
                    ipcRenderer.send("import-config", {
                      path: evt.target.value,
                      chooseFile: false
                    });
                  }
                }}
              >
                <ListSubheader>
                  Recent
                  <Button disabled={configPathHistory.length === 0} onClick={() => {
                    setConfigPathHistory([]);
                    setSelectedConfig("");
                  }}>
                    Clear
                  </Button>
                </ListSubheader>
                {selectedConfig &&
                  selectedConfig.length > 0 &&
                  !configPathHistory.includes(selectedConfig) &&
                  <MenuItem value={selectedConfig}>{selectedConfig}</MenuItem>}
                {configPathHistory.map((fileName: string) => (
                  <MenuItem key={`recent-${fileName}`} value={fileName}>
                    {fileName}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="local">Choose Config from Computer</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider style={{ margin: "15px 0", width: "100%" }} />
          <div style={{ marginTop: "15px" }}>
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="launch-vehicle-label">Launch Vehicle</InputLabel>
              <Select
                id="launch-vehicle"
                value={launchVehicleName}
                placeholder="Launch Vehicle"
                label="Launch Vehicle"
                labelId="launch-vehicle-label"
                onChange={(evt) => {
                  setLaunchVehicle(evt.target.value);
                }}
              >
                {Object.entries(constants.LAUNCH_VEHICLES).map(([launchVehicle]) => <MenuItem key={launchVehicle} value={launchVehicle}>{launchVehicle}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div style={{ marginTop: "15px" }}>
            <TextField
              style={{ width: "200px" }}
              id="relay-volume-scale"
              label="Relay Volume Scale"
              variant="outlined"
              type="number"
              value={relayVolumeScale}
              onChange={(evt: any) => {
                setRelayVolumeScale(evt.target.value);
              }}
            />
          </div>
        </div>
        <Snackbar open={statusMessage.length > 0} autoHideDuration={3000} onClose={() => {
          setStatusMessage("");
          setIsErrorStatus(false);
        }}>
          <Alert onClose={() => {
            setStatusMessage("");
            setIsErrorStatus(false);
          }} severity={isErrorStatus ? "error" : "success"} sx={{ width: '100%' }}>
            {statusMessage}
          </Alert>
        </Snackbar>
      </div>
    </div >
  );
}

export default SettingsView;
