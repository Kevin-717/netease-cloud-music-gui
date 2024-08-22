const { ipcMain } = require('electron')
function InitIpc(win) {
    ipcMain.on('close',()=>{
        win.close()
    })
    ipcMain.on('min',()=>{
        win.minimize()
    })
    ipcMain.on('search',(event,data)=>{
        win.webContents.send('on-search',data)
    })
    ipcMain.on('hide',()=>{
        win.webContents.send('hide-search')
    })
    ipcMain.on('play-song',(event,data)=>{
        win.webContents.send('on-play-song',data)
    })
    ipcMain.on('show-lrc',()=>{
        win.webContents.send('show-lrc')
    })
    ipcMain.on('hide-lrc',()=>{
        win.webContents.send('hide-lrc')
    })
    ipcMain.on('load-lrc',(event,data)=>{
        win.webContents.send('load-lrc',{cover:data.cover,title:data.title,lrc:data.lrc})
    })
    ipcMain.on('play-mv',(event,data)=>{
        win.webContents.send('on-play-mv',data)
    })
}
module.exports = {
    InitIpc:InitIpc
}