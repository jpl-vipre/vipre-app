import { FC, useMemo, useState } from "react";

import SelectFilter from "./Filters/SelectFilter";
import useStore from "../utils/store";

import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC = () => {
  const [windowMaximized, setWindowMaximized] = useState(false);

  const targetBodyFilter = useStore((state) => {
    const targetBody = state.filterList.filter((filter) => filter.label === "Target Body");
    if (targetBody.length === 0) {
      return null;
    } else {
      return targetBody[0];
    }
  });

  const targetBodyLogo = useMemo(() => {
    if (!targetBodyFilter) return "";

    const targetBodyName = targetBodyFilter.value || targetBodyFilter.defaultValue;
    if (!targetBodyName) return "";

    switch (targetBodyName) {
      case "Saturn":
        return "/icons/saturn.svg";
      case "Neptune":
        return "/icons/neptune.svg";
      case "Uranus":
        return "/icons/uranus.png";
      default:
        return "";
    }
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
    </header>
  );
};

export default Header;
