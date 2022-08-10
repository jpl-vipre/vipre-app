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

const emitter = new EventEmitter();

const path = require("path");
const url = require("url");

const fs = require("fs");

emitter.setMaxListeners(100);

let window;
let api;

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

const launchAPI = () => {
  let apiPath = "";
  let datasetPath = "";
  if (process.platform === "win32") {
    apiPath = app.isPackaged
      ? path.join(process.resourcesPath, "vipre-data", "server", "server.exe")
      : path.join(__dirname, "..", "vipre-data", "server", "server.exe");
  } else {
    apiPath = app.isPackaged
      ? path.join(process.resourcesPath, "vipre-data", "vipre-api.pex")
      : path.join(__dirname, "..", "vipre-data", "vipre-api.pex");
  }

  datasetPath = app.isPackaged
    ? `sqlite:///${path.join(
        process.resourcesPath,
        "vipre-data",
        "data",
        "EJS_test_big.db"
      )}`
    : path.join(__dirname, "..", "vipre-data", "data", "EJS_test_big.db");

  if (!process.env.REACT_APP_STOP_API) {
    let apiCommand =
      process.platform === "win32"
        ? `"${apiPath}"`
        : `SQL_ALCHEMY_DATABASE_URI=${datasetPath} "${apiPath}" vipre_data.app.main:app --port 8000`;

    console.log(`SPAWNING ${apiCommand}`);

    api = exec(apiCommand, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.log(stderr);
        return;
      }

      console.log(stdout);
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
    if (!api) {
      launchAPI();
    }
  });

  if (!api) {
    launchAPI();
  }

  ipcMain.on("new-window", (evt, url) => {
    if (!api) {
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
});

const killAPI = () => {
  if (!process.env.REACT_APP_STOP_API && api) {
    api.kill("SIGINT");
    api = null;
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
