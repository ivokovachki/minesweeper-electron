const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required to use Node APIs in renderer
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
