const {app,Tray,Menu} = require('electron')
const path = require('path')
let tray = null
function InitTray(win){
    win.on('close',(e)=>{
        e.preventDefault()
        win.setSkipTaskbar(true)
        win.hide()
    })
    tray = new Tray(__dirname+'\\song.png')
    console.log(__dirname+'\\song.png')
    const contextMenu = Menu.buildFromTemplate([
        {
            label:'退出',
            click:function(){
                win.destroy()
                app.quit()
            }
        },
        {
            label:'暂停/继续'
        }
    ])
    tray.setToolTip('My Music')
    tray.setContextMenu(contextMenu)
    tray.on('click',()=>{
        win.show()
    })
}
module.exports = {
    InitTray:InitTray
}