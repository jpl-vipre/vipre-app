import { FC, useState } from "react";

import SelectFilter from "./Filters/SelectFilter";
import useStore from "../utils/store";

import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC = () => {
  const [windowMaximized, setWindowMaximized] = useState(false);

  const filterList = useStore((state) => state.filterList);

  return (
    <header>
      <span className="target-select">
        <img src="/icons/saturn.svg" alt="Saturn target" />
        <SelectFilter
          filter={filterList.filter((filter) => filter.label === "Target Body")[0]}
          style={{ minWidth: "200px", marginBottom: 0 }}
          className="target-body-select"
        />
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
