import { FC, useState, useEffect } from "react";

import { CircularProgress, createTheme, Palette, PaletteOptions, ThemeProvider } from "@mui/material";

import useStore from "./utils/store";

import Header from "./components/Header";

import DataView from "./views/DataView";
import SettingsView from "./views/SettingsView";
import { useEffectOnce } from "usehooks-ts";

import "./App.css";
import constants, { STOP_API } from "./utils/constants";

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
  const [apiStarted, setAPIStarted] = useState(false);
  const [tabs, setTabs] = useStore(state => [state.tabs, state.setTabs]);
  const fetchFilterFields = useStore((state) => state.fetchFilterFields);
  const filtersInitialized = useStore(state => state.filtersInitialized);
  const [filterList, setFilterList] = useStore(state => [state.filterList, state.setFilterList]);
  const fetchFields = useStore((state) => state.fetchFields);
  const fetchSchemas = useStore((state) => state.fetchSchemas);
  const fetchBodies = useStore((state) => state.fetchBodies);
  const [apiVersion, fetchAPIVersion] = useStore((state) => [state.apiVersion, state.fetchAPIVersion]);
  const searchTrajectories = useStore((state) => state.searchTrajectories);

  const [activeDatabase, setActiveDatabase] = useStore((state) => [state.activeDatabase, state.setActiveDatabase]);
  const [databaseHistory, setDatabaseHistory] = useStore((state) => [state.databaseHistory, state.setDatabaseHistory]);

  useEffectOnce(() => {
    ipcRenderer.on("api-log", (evt: any, info: any) => {
      console.log(evt, info);
    })
  });

  useEffect(() => {
    if (!apiStarted) {
      setAPIStarted(true);
      ipcRenderer.send("import-database", {
        path: activeDatabase,
        chooseFile: false
      });
    }
  }, [apiStarted, activeDatabase]);

  useEffect(() => {
    if (filtersInitialized && tabs.length === 0) {
      setTabs(constants.DEFAULT_TABS);
    }
  }, [filtersInitialized, setTabs, tabs]);

  useEffect(() => {
    if (filtersInitialized && filterList.length === 0) {
      searchTrajectories();
    }
  }, [filtersInitialized, filterList, setFilterList, searchTrajectories]);

  useEffectOnce(() => {
    if (STOP_API) {
      setAPIStarted(true);
      setTimeout(() => {
        fetchAPIVersion(5, () => {
          if (activeDatabase) {
            setActiveDatabase(activeDatabase);
          }
          fetchFilterFields();
          fetchSchemas();
          fetchFields();
          fetchBodies();
          searchTrajectories();
        });
      }, 1000);
    }
  })

  useEffect(() => {
    const callback = (evt: any, info: any) => {
      if (info && info.path) {
        setAPIStarted(true);
        setActiveDatabase(info.path);
        setDatabaseHistory(Array.from(new Set([...databaseHistory, info.path])));
        setTimeout(() => {
          fetchAPIVersion(5, () => {
            fetchFilterFields();
            fetchSchemas();
            fetchFields();
            fetchBodies();
            searchTrajectories();
          });
        }, 1000);
      }
    }

    ipcRenderer.on("database-imported", callback);

    return () => {
      ipcRenderer.removeListener("database-imported", callback);
    }
  }, [databaseHistory, setActiveDatabase, setDatabaseHistory, fetchFilterFields, fetchSchemas, fetchFields, fetchBodies, fetchAPIVersion, searchTrajectories]);

  useEffect(() => {
    if (apiStarted && apiVersion && view === 0) {
      searchTrajectories();
    }
  }, [view, searchTrajectories, apiStarted, apiVersion]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header view={view} setView={setView} />
        {apiStarted ? <>
          {view === 0 && <DataView />}
          {view === 1 && <SettingsView />}
        </> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "calc(100vh - 70px - 38.5px)" }}>
          <CircularProgress size={100} />
        </div>}
      </div>
    </ThemeProvider>
  );
};

export default App;
