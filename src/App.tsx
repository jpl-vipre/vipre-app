import { FC, useState, useEffect } from "react";

import { createTheme, Palette, PaletteOptions, ThemeProvider } from "@mui/material";

import useStore from "./utils/store";

import Header from "./components/Header";

import DataView from "./views/DataView";
import SettingsView from "./views/SettingsView";
import { useEffectOnce } from "usehooks-ts";

import "./App.css";

const { ipcRenderer } = window.require("electron");

declare module "@mui/material/styles" {
  interface Theme {
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}

let theme = createTheme({
  palette: { mode: "dark" },
});

const App: FC = () => {
  const [view, setView] = useState(0);
  const fetchFilterFields = useStore((state) => state.fetchFilterFields);
  const fetchFields = useStore((state) => state.fetchFields);
  const fetchSchemas = useStore((state) => state.fetchSchemas);

  useEffectOnce(() => {
    ipcRenderer.on("api-log", (evt: any, info: any) => {
      console.log(evt, info);
    })
  });


  useEffect(() => {
    fetchFilterFields();
    fetchSchemas();
    fetchFields();
  }, [fetchFilterFields, fetchSchemas, fetchFields]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header view={view} setView={setView} />
        {view === 0 && <DataView />}
        {view === 1 && <SettingsView />}
      </div>
    </ThemeProvider>
  );
};

export default App;
