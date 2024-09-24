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
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('index.html');
});

//Switch to an app when receiving the correct IPC event
ipcMain.on("Request-App", (event, args) => {
    url = "http://localhost:400" + args["ID"]
    mainWindow.loadURL(url);
})

function createPasswordWindow() {
    passwordWindow = new BrowserWindow({
        width: 300,
        height: 300,
        modal: true, // To make it appear on top of the main window
        parent: mainWindow, // Reference to your main window
        webPreferences: {
            nodeIntegration: true, // Depends on your Electron setup
            contextIsolation: false, // Allows ipcRenderer in renderer
        }
    });
    passwordWindow.loadFile('password.html'); // The HTML file for the password prompt

    passwordWindow.on('closed', () => {
        passwordWindow = null;
    });
}
ipcMain.on("Request-Quit", (event, args) => {
    createPasswordWindow();
})
//Check whether the password is correct when it is submitted and quit if it is.
ipcMain.on("submit-password", (event, password) => {
    const pass = "abc123";
    
    if (password === pass) {
        if(passwordWindow) {
            passwordWindow.close();
        }
        app.quit(); // Quit the app if the password is correct
    } else {
        event.reply('password-result', 'Incorrect password');
    }
});