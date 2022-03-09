import { FC } from "react";

import { createTheme, Palette, PaletteOptions, ThemeProvider } from "@mui/material";

import Header from "./components/Header";

import DataView from "./views/DataView";

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
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <DataView />
      </div>
    </ThemeProvider>
  );
};

export default App;
