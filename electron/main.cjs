const { app, BrowserWindow, shell } = require('electron');
const path = require('node:path');

function createWindow() {
  const window = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    backgroundColor: '#111714',
    icon: path.join(__dirname, '..', 'assets', 'oracle-icon.png'),
    autoHideMenuBar: true,
    title: 'Oracle — The Thread of Thebes',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) window.loadURL(devUrl);
  else window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
