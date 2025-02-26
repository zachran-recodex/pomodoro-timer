// File: main.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset', // Lebih cocok untuk macOS
        vibrancy: 'under-window', // Efek visual untuk macOS
    });

    mainWindow.loadFile('index.html');

    // Uncomment untuk membuka DevTools
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// Handle notifikasi
ipcMain.on('notify', (event, message) => {
    new Notification({
        title: 'Pomodoro Timer',
        body: message,
        silent: false,
    }).show();
});