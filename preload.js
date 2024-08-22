const { ipcRenderer,contextBridge } = require("electron")
contextBridge.exposeInMainWorld(
    'electron',
    {
        close:() => ipcRenderer.send("close"),
        min:() => ipcRenderer.send("min"),
        search:keyword => {
            ipcRenderer.send('search',keyword)
            ipcRenderer.send('hide-lrc')
        },
        on_search:callback => ipcRenderer.on('on-search',(event,data) => callback(data)),
        hide_search_event:() => {
            ipcRenderer.send('hide')
            ipcRenderer.send('hide-lrc')
        },
        on_hide_search:callback => ipcRenderer.on('hide-search',callback),
        play_music:id=> ipcRenderer.send('play-song',id),
        on_play_music:callback => ipcRenderer.on('on-play-song',(event,data)=>callback(data)),
        playLrc:()=> ipcRenderer.send('show-lrc'),
        hide_lrc:()=>ipcRenderer.send('hide-lrc'),
        on_show_lrc:callback=>ipcRenderer.on('show-lrc',callback),
        on_hide_lrc:callback=>ipcRenderer.on('hide-lrc',callback),
        load_lrc:(cover,title,lrc)=>ipcRenderer.send('load-lrc',{cover:cover,title:title,lrc:lrc}),
        on_load_lrc:callback=>ipcRenderer.on('load-lrc',(event,data)=>callback(data.cover,data.title,data.lrc)),
        play_mv:id=>ipcRenderer.send('play-mv',id),
        on_play_mv:callback=>ipcRenderer.on('on-play-mv',(event,data)=>callback(data))
    }
)