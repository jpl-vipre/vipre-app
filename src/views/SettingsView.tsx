import { FC, useState, useEffect, useMemo } from "react";

import { FormControl, InputLabel, MenuItem, Select, ListSubheader, Button, Divider, IconButton, Snackbar, Alert, Tooltip, TextField, CircularProgress } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ErrorIcon from "@mui/icons-material/Error";

import useStore from "../utils/store";
import constants from "../utils/constants";
import "../scss/SettingsView.scss";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// @ts-ignore
const { ipcRenderer } = window.require("electron");
const path = window.require("path");

const SettingsView: FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [configPathHistory, setConfigPathHistory] = useStore(state => [state.configPathHistory, state.setConfigPathHistory]);

  const [databaseSelectOpen, setDatabaseSelectOpen] = useState<boolean>(false);
  const [activeDatabase, setActiveDatabase] = useStore(state => [state.activeDatabase, state.setActiveDatabase]);
  const [databaseHistory, setDatabaseHistory] = useStore(state => [state.databaseHistory, state.setDatabaseHistory]);

  const [filterList, setFilterList] = useStore(state => [state.filterList, state.setFilterList]);
  const [tabs, setTabs] = useStore(state => [state.tabs, state.setTabs]);
  const [relayVolumeScale, setRelayVolumeScale] = useStore(state => [state.relayVolumeScale, state.setRelayVolumeScale]);
  const [launchVehicleName, setLaunchVehicle] = useStore(state => [state.launchVehicleName, state.setLaunchVehicle]);
  const [requestedEntryPointCount, setRequestedEntryPointCount] = useStore(state => [state.requestedEntryPointCount, state.setRequestedEntryPointCount]);

  const searchTrajectories = useStore(state => state.searchTrajectories);

  const [lastClickedAction, setLastClickedAction] = useState<string>("");
  const [apiVersion, databaseMetadata, fetchAPIVersion] = useStore(state => [state.apiVersion, state.databaseMetadata, state.fetchAPIVersion]);
  const loadingAPI = useStore(state => state.loadingAPI);

  const resetData = useStore(state => state.resetData);

  const [isErrorStatus, setIsErrorStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const isValidAPI = useMemo(() => apiVersion && apiVersion.length > 0, [apiVersion]);

  useEffect(() => {
    const callback = (evt: any, info: any) => {
      if (info && info.path) {
        setSelectedConfig(info.path);
        setIsErrorStatus(false);
        setStatusMessage(`Successfully exported ${info.path}`);
      } else {
        setIsErrorStatus(true);
        setStatusMessage("Error exporting config, please retry.");
      }
    };

    ipcRenderer.on("config-exported", callback);

    return () => {
      ipcRenderer.removeListener("config-exported", callback);
    }
  }, []);

  useEffect(() => {
    const callback = (evt: any, info: any) => {
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
    };

    ipcRenderer.on("config-imported", callback);

    return () => {
      ipcRenderer.removeListener("config-imported", callback);
    }
  }, [configPathHistory, setFilterList, setTabs, setConfigPathHistory]);


  useEffect(() => {
    const callback = (evt: any, info: any) => {
      if (info && info.path) {
        setActiveDatabase(info.path);
        setDatabaseHistory(Array.from(new Set([...databaseHistory, info.path])));
        resetData();
        searchTrajectories();
        setIsErrorStatus(false);
        setStatusMessage(`Successfully loaded database ${info.path}`);
      } else {
        setIsErrorStatus(true);
        setStatusMessage("Import Failed. Couldn't find database file.");
      }

      fetchAPIVersion();
    };
    ipcRenderer.on("database-imported", callback);

    return () => {
      ipcRenderer.removeListener("database-imported", callback);
    }
  }, [databaseHistory, setActiveDatabase, setDatabaseHistory, searchTrajectories, resetData, fetchAPIVersion]);

  return (
    <div className="settings-container">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "15px", height: "100%" }}>
        <h1>Settings</h1>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "15px", width: "100%", height: "100%" }}>
          <div style={{ display: "flex", margin: "0 auto" }}>
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
                  <MenuItem value={selectedConfig || ""}>{selectedConfig}</MenuItem>}
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
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
            <FormControl style={{ minWidth: "100px" }}>
              <InputLabel id="config-select-label">Import Database File</InputLabel>
              <Select
                autoWidth
                id="config-select"
                open={databaseSelectOpen}
                value={databaseMetadata.database || ""}
                placeholder="Import Database File"
                label="Import Database File"
                labelId="config-select-label"
                onClick={() => setDatabaseSelectOpen(!databaseSelectOpen)}
                onChange={(evt) => {
                  if (evt.target.value === "local") {
                    ipcRenderer.send("import-database", {
                      chooseFile: true
                    });
                  } else {
                    setActiveDatabase(evt.target.value);
                    setDatabaseHistory(Array.from(new Set([...databaseHistory, evt.target.value])));
                  }
                }}
              >
                <ListSubheader>
                  Recent
                  <Button disabled={databaseHistory.length === 0} onClick={() => {
                    if (activeDatabase) {
                      setDatabaseHistory([activeDatabase]);
                    } else {
                      setDatabaseHistory([]);
                    }
                  }}>
                    Clear
                  </Button>
                </ListSubheader>
                {activeDatabase &&
                  activeDatabase.length > 0 &&
                  !databaseHistory.includes(activeDatabase) &&
                  <MenuItem value={activeDatabase}>{!databaseSelectOpen ? activeDatabase : activeDatabase.slice(activeDatabase.lastIndexOf(path.sep) + 1)}</MenuItem>}
                {databaseHistory.filter((fileName: string) => fileName && fileName.length > 0).map((fileName: string) => (
                  <MenuItem key={`recent-${fileName}`} value={fileName}>
                    {!databaseSelectOpen ? fileName.slice(fileName.lastIndexOf(path.sep) + 1) : fileName}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem value="local">Choose Database from Computer</MenuItem>
              </Select>
            </FormControl>
            <div className="api-actions" style={{ display: "flex" }}>
              <Tooltip title="Test API Connection">
                <IconButton
                  color={isValidAPI ? "success" : "warning"}
                  aria-label="test api connection"
                  component="span"
                  className="config-btn"
                  disabled={loadingAPI}
                  onClick={() => {
                    fetchAPIVersion();
                    setLastClickedAction("test-api-connection");
                  }}
                >
                  {loadingAPI && lastClickedAction === "test-api-connection" ? (
                    <CircularProgress disableShrink />
                  ) : isValidAPI ? (
                    <CheckCircleIcon fontSize="large" />
                  ) : (
                    <ErrorIcon fontSize="large" />
                  )}
                </IconButton>
              </Tooltip>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Tooltip title={isValidAPI ? "Refresh API" : "Start API"}>
                <IconButton
                  color={isValidAPI ? "primary" : "success"}
                  aria-label={isValidAPI ? "Refresh API" : "Start API"}
                  component="span"
                  className="config-btn"
                  disabled={loadingAPI}
                  onClick={() => {
                    setLastClickedAction("start-api");
                    if (isValidAPI) {
                      resetData();
                      searchTrajectories();
                      fetchAPIVersion();
                    } else {
                      ipcRenderer.send("import-database", {
                        path: activeDatabase,
                        chooseFile: false
                      });
                    }
                  }}
                >
                  {loadingAPI && lastClickedAction === "start-api" ? (
                    <CircularProgress disableShrink />
                  ) : isValidAPI ? (
                    <RefreshIcon fontSize="large" />
                  ) : (
                    <PlayCircleFilledWhiteIcon fontSize="large" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Stop API">
                <IconButton
                  color={isValidAPI ? "error" : "success"}
                  aria-label="stop api"
                  component="span"
                  className="config-btn"
                  disabled={loadingAPI || !isValidAPI}
                  onClick={() => {
                    setLastClickedAction("stop-api");
                    ipcRenderer.send("stop-api");
                    fetchAPIVersion();
                    setTimeout(() => {
                      fetchAPIVersion();
                    }, 1000);
                  }}
                >
                  {loadingAPI && lastClickedAction === "stop-api" ? (
                    <CircularProgress disableShrink />
                  ) : <StopCircleIcon fontSize="large" />}
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Divider style={{ margin: "15px 0", width: "100%" }} />
          <div style={{ marginTop: "15px" }}>
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="launch-vehicle-label">Launch Vehicle</InputLabel>
              <Select
                id="launch-vehicle"
                value={launchVehicleName || ""}
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
                if (isNaN(evt.target.value)) {
                  setRelayVolumeScale(evt.target.value);
                } else {
                  setRelayVolumeScale(Number(evt.target.value));
                }
              }}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <TextField
              style={{ width: "200px" }}
              id="entry-point-count"
              label="Number of Entry Points"
              variant="outlined"
              type="number"
              value={requestedEntryPointCount}
              onChange={(evt: any) => {
                setRequestedEntryPointCount(evt.target.value);
              }}
            />
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between", width: "fit-content" }}>
              <span>UI Version: {constants.VERSION}</span>
              <span style={{ margin: "0 15px" }}>API Version: {apiVersion || "N/A"}</span>
              <span>Database Schema Version: {databaseMetadata.schema_version || "N/A"}</span>
            </div>
            <span>Loaded Database Path: {databaseMetadata.database || "N/A"}</span>
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
