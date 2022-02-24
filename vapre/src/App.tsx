import React from "react";

import { createTheme, Palette, PaletteOptions, ThemeProvider } from "@mui/material";

import Header from "./components/Header";

import logo from "./logo.svg";
import "./App.css";

declare module "@mui/material/styles" {
  interface Theme {
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}

var theme = createTheme({
  palette: {},
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
