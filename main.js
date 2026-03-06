const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

const SETTINGS_FILE = 'settings.json';

function getSettingsPath() {
  return path.join(app.getPath('userData'), SETTINGS_FILE);
}

async function readSettings() {
  const filePath = getSettingsPath();
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeSettings(settings) {
  const filePath = getSettingsPath();
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8');
  return true;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 980,
    minHeight: 700,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

ipcMain.handle('settings:read', readSettings);
ipcMain.handle('settings:write', (_event, settings) => writeSettings(settings));
ipcMain.handle('app:version', () => app.getVersion());

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
