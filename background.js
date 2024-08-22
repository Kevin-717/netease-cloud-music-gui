const { app,BrowserWindow } = require('electron')
const {startServe} = require('./electron/NetServe')
const {InitIpc} = require('./electron/IpcHandler')
const {InitTray} = require('./electron/Tray')
const path = require('path')
const env = app.isPackaged ? 'production' : 'development'
const indexHtml = {
    development:'http://localhost:5173',
    production:path.join(__dirname,'dist/index.html')
}
const createWindow = () => {
    const win = new BrowserWindow({
        width:900,
        height:600,
        minHeight:600,
        minWidth:800,
        frame:false,
        webPreferences:{
            preload:path.join(__dirname,'preload.js')
        }
    })
    win.setAspectRatio(1.5)
    win.loadURL(indexHtml[env])
    if(env === 'development') win.webContents.openDevTools()
    return win
}
app.whenReady().then(async () => {
    await startServe()
    const win = createWindow()
    InitIpc(win)
    InitTray(win)
    app.on('activate',() => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed',() => {
    if(process.platform !== 'darwin') app.quit()
})