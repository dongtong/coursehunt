import path from "path";
import url from "url";
import { app, Menu, BrowserWindow } from "electron";
import { appMenu } from './menus/app_menu';
import { editMenuTemplate } from './menus/edit_menu';
import { devMenuTemplate } from './menus/dev_menu';
const {autoUpdater} = require("electron-updater");
import env from "env";

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

const setApplicationMenu = () => {
  let menus = [editMenuTemplate];
  if(process.platform === 'darwin') {
    menus.unshift(appMenu);
  }
  if (env.name !== "production") {
     menus.push(devMenuTemplate);
  }
   Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();

  setApplicationMenu();
  const mainWindow = new BrowserWindow({width: 1200, height: 700, resizable: false, show: false})

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "intro.html"),
      protocol: "file:",
      slashes: true
    })
  );
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if(env.name == 'development') mainWindow.openDevTools();
});

app.on("window-all-closed", () => {
  app.quit();
});
