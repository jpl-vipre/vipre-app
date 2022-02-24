import { FC, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC = () => {
  const [windowMaximized, setWindowMaximized] = useState(false);
  return (
    <header>
      <span className="target-select">
        <img src="/icons/saturn.svg" alt="Saturn target" />
        <FormControl>
          <InputLabel id="target-body-select-label">Target Body</InputLabel>
          <Select
            labelId="target-body-select-label"
            id="target-body-select"
            value={"Saturn"}
            placeholder="Target Body"
            label="Target Body"
            style={{ margin: "5px", color: "white", minWidth: "200px" }}
            inputProps={{ style: { color: "white" } }}
            variant="standard"
          >
            {["Saturn"].map((targetBody) => (
              <MenuItem key={`target-${targetBody}`} value={targetBody}>
                {targetBody}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <h1>VAPRE</h1>
        <h5>Visualization of Atmospheric Probe Entry conditions for different bodies and trajectories</h5>
      </span>
    </header>
  );
};

export default Header;
