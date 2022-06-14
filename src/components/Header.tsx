import { FC, useMemo, useState } from "react";

import { FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

import useStore from "../utils/store";



import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC<{ view: number; setView: (view: number) => void }> = ({ view, setView }) => {
  const [windowMaximized, setWindowMaximized] = useState(false);
  const targetBodies = useStore((state) => state.targetBodies);
  const searchTrajectories = useStore((state) => state.searchTrajectories);

  const [targetBody, setTargetBody] = useStore(state => [state.targetBody, state.setTargetBody])

  const targetBodyProps = useMemo(() => {
    if (!targetBody) return { icon: "", map: "", value: "" };
    return targetBodies[targetBody];
  }, [targetBody, targetBodies]);

  return (
    <header>
      <span className="target-select">
        {targetBodyProps && targetBodyProps.icon ? (
          <img src={targetBodyProps.icon} alt={`${targetBodyProps.value} target`} />
        ) : (
          <span className="img-placeholder" />
        )}
        {targetBodyProps && (
          <FormControl fullWidth style={{ minWidth: "200px", marginBottom: 0 }} className="target-body-select">
            <InputLabel id={"target-body-select-label"}>Target Body</InputLabel>
            <Select
              variant="standard"
              style={{ textAlign: "left", paddingLeft: "5px" }}
              labelId={"target-body-select-label"}
              id={"target-body-select"}
              value={targetBody}
              label="Target Body"
              onChange={(evt) => {
                setTargetBody(evt.target.value);
                searchTrajectories();
              }}
            >
              {Object.entries(targetBodies).map(([targetBodyName, targetBody]) => (
                <MenuItem value={targetBodyName} key={`filter-${targetBodyName}-${targetBody.value}`}>
                  {targetBodyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </span>
      <span
        className="title-container"
        onDoubleClick={() => {
          if (windowMaximized) {
            ipcRenderer.send("unmaximize-app-window");
            setWindowMaximized(false);
          } else {
            ipcRenderer.send("maximize-app-window");
            setWindowMaximized(true);
          }
        }}
      >
        <h1>VIPRE</h1>
        <h5>Visualization of the Impact of PRobe Entry conditions on the science, mission and spacecraft design</h5>
      </span>
      <Tooltip title={view === 0 ? "Settings" : "Dashboard"}>
        <IconButton
          style={{ position: "absolute", right: "5px" }}
          onClick={() => {
            setView(view === 0 ? 1 : 0);
          }}
        >
          {view === 0 ? <SettingsIcon fontSize="large" /> : <DashboardIcon fontSize="large" />}
        </IconButton>
      </Tooltip>
    </header>
  );
};

export default Header;
