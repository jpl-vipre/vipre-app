const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  shell,
  dialog,
} = require("electron");
const EventEmitter = require("events");

const { exec } = require("child_process");
const find_process = require("find-process");

const emitter = new EventEmitter();

const path = require("path");
const url = require("url");

const fs = require("fs");

emitter.setMaxListeners(100);

let window;
let api;
let database = null;
let apiName = process.platform === "win32" ? "vipre-data.exe" : "vipre-data";
let defaultDatabase = "E_S_test_big9.db";

const createWindow = () => {
  window = new BrowserWindow({
    title: "VAPRE",
    width: 1660,
    minWidth: 1660,
    height: 800,
    minHeight: 800,
    titleBarStyle: "hiddenInset",
    titleBarOverlay: true,
    maximizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  window.maximize();

  const appURL = app.isPackaged
    ? `file://${__dirname}/index.html`
    : "http://localhost:3000";
  window.loadURL(appURL);
};

const setupLocalFilesNormalizerProxy = () => {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
};

const launchAPI = async () => {
  let apiPath = "";
  if (process.platform === "win32") {
    apiPath = app.isPackaged
      ? path.join(process.resourcesPath, "vipre-data", "winbuild", apiName)
      : path.join(__dirname, "..", "vipre-data", "winbuild", apiName);
  } else {
    apiPath = app.isPackaged
      ? path.join(process.resourcesPath, "vipre-data", "macbuild", apiName)
      : path.join(__dirname, "..", "vipre-data", "macbuild", apiName);
  }

  if (!database) {
    database = app.isPackaged
      ? path.join(
          process.resourcesPath,
          "vipre-data",
          "vipre_data",
          "sql",
          defaultDatabase
        )
      : path.join(
          __dirname,
          "..",
          "vipre-data",
          "vipre_data",
          "sql",
          defaultDatabase
        );
  }

  if (!process.env.REACT_APP_STOP_API) {
    const processes = await find_process("name", apiName);
    if (processes.length > 0) {
      api = null;
      killAPI();
    }

    let apiCommand =
      process.platform === "win32"
        ? `"${apiPath}"`
        : `SQLALCHEMY_DATABASE_URI=sqlite:///${database} "${apiPath}"`;

    console.log(`SPAWNING ${apiCommand}`);

    setTimeout(() => {
      window.webContents.send("database-imported", {
        path: database,
        apiPath,
      });
    }, 2000);

    api = exec(apiCommand, async (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log(stderr);
        window.webContents.send("api-log", { err, stderr });

        const processes = await find_process("pid", api.pid);
        if (processes.length === 0) {
          api = null;
          killAPI();
        }
        return;
      }

      console.log(stdout);
    });

    [("SIGINT", "SIGHUP")].forEach(function (signal) {
      process.addListener(signal, killAPI);
    });
  }
};

app.whenReady().then(async () => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    if (!api && database !== null) {
      launchAPI();
    }
  });

  if (!api && database !== null) {
    launchAPI();
  }

  ipcMain.on("new-window", (evt, url) => {
    if (!api && database !== null) {
      launchAPI();
    }
    evt.preventDefault();
    shell.openExternal(url);
  });

  ipcMain.on("maximize-app-window", () => {
    window.maximize();
    window.webContents.send("maximize");
  });

  ipcMain.on("unmaximize-app-window", () => {
    window.unmaximize();
    window.webContents.send("minimize");
  });

  ipcMain.on("export-config", (event, info) => {
    dialog
      .showSaveDialog({
        properties: ["createDirectory"],
        buttonLabel: "Save",
        defaultPath: "vipre-config.json",
        filters: [{ name: "Configs", extensions: ["json"] }],
      })
      .then((response) => {
        if (!response.canceled) {
          fs.writeFileSync(response.filePath, JSON.stringify(info, null, 4));
          window.webContents.send("config-exported", {
            path: response.filePath,
          });
        }
      });
  });

  ipcMain.on("import-config", (event, info) => {
    if (info && info.chooseFile) {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          buttonLabel: "Load",
          filters: [{ name: "Configs", extensions: ["json"] }],
        })
        .then((response) => {
          if (!response.canceled) {
            const config = JSON.parse(fs.readFileSync(response.filePaths[0]));
            window.webContents.send("config-imported", {
              path: response.filePaths[0],
              config: config,
            });
          }
        });
    } else if (info && info.path) {
      const config = JSON.parse(fs.readFileSync(info.path));
      window.webContents.send("config-imported", {
        path: info.path,
        config: config,
      });
    }
  });

  ipcMain.on("import-database", (event, info) => {
    if (info && info.chooseFile) {
      dialog
        .showOpenDialog({
          properties: ["openFile"],
          buttonLabel: "Load",
          filters: [{ name: "Databases", extensions: ["db"] }],
        })
        .then((response) => {
          if (!response.canceled) {
            if (api) {
              if (database !== response.filePaths[0]) {
                database = response.filePaths[0];
                killAPI();
                setTimeout(() => {
                  launchAPI();
                }, 2000);
              }
            } else {
              database = response.filePaths[0];
              launchAPI();
            }
          }
        });
    } else if (info && info.path !== null) {
      if (api) {
        if (database !== info.path) {
          database = info.path;
          killAPI();
          setTimeout(() => {
            launchAPI();
          }, 500);
        }
      } else {
        database = info.path;
        launchAPI();
      }
    }
  });

  ipcMain.on("stop-api", (event, info) => {
    killAPI();
  });
});

const killAPI = async () => {
  if (!process.env.REACT_APP_STOP_API && api) {
    const processes = await find_process("pid", api.pid);

    if (processes[0] && processes[0].name.toLowerCase().includes(apiName)) {
      process.kill(processes[0].pid);
    }

    api.kill("SIGINT");
    api = null;
  } else if (!process.env.REACT_APP_STOP_API && !api) {
    const processes = await find_process("name", apiName);
    if (processes.length > 0) {
      process.kill(processes[0].pid);
    }
  }
};

app.on("window-closed", function () {
  killAPI();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("window-all-closed", function () {
  killAPI();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", function () {
  killAPI();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
