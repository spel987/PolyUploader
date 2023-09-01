const {app, BrowserWindow, shell, ipcMain} = require('electron')
const ipc = ipcMain

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1100,
    height: 700,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });


  mainWindow.loadFile('.\\src\\index.html')

  mainWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url); 
  });

  ipc.on("closeApp", () => {
    mainWindow.close()
  })

  ipc.on("minimizeApp", () => {
    mainWindow.minimize()
  })
})


let cors_proxy = require('cors-anywhere');

let port = process.env.PORT || 61337;

let host = process.env.HOST || '127.0.0.1';

cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});