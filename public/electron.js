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

app.whenReady().then(async () => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  let apiPath = app.isPackaged
    ? path.join(process.resourcesPath, "vipre-data", "vipre-api.pex")
    : path.join(__dirname, "..", "vipre-data", "vipre-api.pex");

  console.log(`SPAWNING API ${apiPath} app.main:app --port 8000`);

  api = exec(`${apiPath} app.main:app --port 8000`, (err, stdout, stderr) => {
    window.webContents.send("api-log", { stdout, err, stderr });

    if (err) {
      console.error(err);
      console.error(stderr);
      return;
    }

    window.webContents.send("api-loaded");
    console.log(stdout);
  });

  ipcMain.on("new-window", (evt, url) => {
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

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
  if (api) api.kill("SIGINT");
});
