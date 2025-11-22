const path = require("path");

const {
  app,
  BrowserWindow,
  Menu,
  clipboard,
  ipcMain,
  Tray,
  nativeImage,
} = require("electron");

let prevClipboard = "";
let mainWindow = null;

const menu = new Menu.buildFromTemplate([
  {
    role: "toggleDevTools",
  },
  {
    role: "quit",
  },
]);

const main = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenu(menu);
  mainWindow.loadFile("./views/index.html");

  setInterval(() => {
    if (
      clipboard.availableFormats("clipboard").includes("text/plain") &&
      clipboard.readText("clipboard") != prevClipboard
    ) {
      prevClipboard = clipboard.readText("clipboard");
      mainWindow.webContents.send("change-clipboard", prevClipboard);
    }
  }, 100); // 100MS == 1/10s
};

app.on("ready", () => {
  main();

  const trayMenu = new Menu.buildFromTemplate([
    {
      role: "quit",
    },
  ]);
  const tray = new Tray(
    nativeImage.createFromPath(path.join(__dirname, "icon.png"))
  );
  tray.setContextMenu(trayMenu);
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});
