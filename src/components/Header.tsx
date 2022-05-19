import { FC, useMemo, useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

import SelectFilter from "./Filters/SelectFilter";
import useStore from "../utils/store";

import { TARGET_BODIES } from "../utils/constants";

import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC<{ view: number; setView: (view: number) => void }> = ({ view, setView }) => {
  const [windowMaximized, setWindowMaximized] = useState(false);

  const targetBodyFilter = useStore((state) => {
    const targetBody = state.filterList.filter((filter) => filter.id === 0);
    if (targetBody.length === 0) {
      return null;
    } else {
      return targetBody[0];
    }
  });

  const targetBodyLogo = useMemo(() => {
    if (!targetBodyFilter) return "";

    const targetBodyName = targetBodyFilter.value || targetBodyFilter.defaultValue;
    if (!targetBodyName || !Object.keys(TARGET_BODIES).includes(targetBodyName)) return "";
    // @ts-ignore
    return TARGET_BODIES[targetBodyName].icon;
  }, [targetBodyFilter]);

  return (
    <header>
      <span className="target-select">
        {targetBodyFilter && targetBodyLogo ? (
          <img src={targetBodyLogo} alt={`${targetBodyFilter.value} target`} />
        ) : (
          <span className="img-placeholder" />
        )}
        {targetBodyFilter && (
          <SelectFilter
            filter={targetBodyFilter}
            style={{ minWidth: "200px", marginBottom: 0 }}
            className="target-body-select"
          />
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
