import { FC, useState, useEffect } from "react";

import { createTheme, Palette, PaletteOptions, ThemeProvider } from "@mui/material";

import useStore from "./utils/store";

import Header from "./components/Header";

import DataView from "./views/DataView";
import SettingsView from "./views/SettingsView";

import "./App.css";

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

  useEffect(() => {
    fetchFilterFields();
  }, [fetchFilterFields]);

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
