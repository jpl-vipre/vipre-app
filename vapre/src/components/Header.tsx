import { FC, useState } from "react";
import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC = () => {
  const [windowMaximized, setWindowMaximized] = useState(false);
  return (
    <header>
      <h1
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
        VAPRE
      </h1>
    </header>
  );
};

export default Header;
