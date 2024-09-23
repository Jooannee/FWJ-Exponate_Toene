const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path')

let mainWindow;

//Create the main BrowserWindow once the electron app is ready
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        kiosk: true,
        fullscreen: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('index.html');

    // Prevent window from closing
    // mainWindow.on('close', (event) => {
    //     event.preventDefault(); // Prevents the window from closing
    //     // Potentially add password/other authentication to allow closing, rather than disabling.
    // });
    // Handle resize or full-screen change events if needed
    mainWindow.on('resize', () => {
        if (!mainWindow.isKiosk()) {
            mainWindow.setKiosk(true); // Re-enter kiosk mode if it is exited
        }
        mainWindow.setFullScreen(true);
    });
    mainWindow.on('leave-full-screen', () => {
        if (!mainWindow.isKiosk()) {
            mainWindow.setKiosk(true); // Re-enter kiosk mode if it is exited
        }
        mainWindow.setFullScreen(true);
    });
});

app.on('window-all-closed', (event) => {
    event.preventDefault(); // Prevent the app from quitting when all windows are closed
});

ipcMain.on("Request-App", (event, args) => {
    url = "http://localhost:400" + args["ID"]
    mainWindow.loadURL(url);
})