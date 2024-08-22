<script setup>
import "../assets/font.scss"
import songIcon from '../assets/song.png'
import LrcPlayer from "./LrcPlayer.vue"
</script>
<template>
    <!--
    http://127.0.0.1:3000/song/url/v1?id=33894312&level=hires
    http://127.0.0.1:3000/song/detail?ids=2163262921
    -->
    <div id="player" @mousemove="move_pos" @mouseup="end_move">
        <div id="frame">
            <img :src="pic_url" id="song-image" @click="show_lrc"/>
            <div id="slider-frame" ref="slider_frame">
                <div id="slider" ref="slider">
                    <div id="hand" v-if="playing" 
                    @mousedown="start_change_pos"
                    ></div>
                </div>
            </div>
            <p id="song-name">{{ song_name }}</p>
            <p id="song-time">{{ timeT }} / {{ totalTimeT }}</p>
            <p id="pause" @click="pause">{{ !isPause ? '| |' : '▶' }}</p>
            <audio ref="player" crossOrigin="anonymous"></audio>
        </div>
        <LrcPlayer ref="lrcPlayer"></LrcPlayer>
    </div>
</template>
<script>
import {ref} from 'vue'
import axios from 'axios'
export default {
    setup(){
        const startPos = ref([])
        const pos = ref()
        const drag = ref(false)
        return{
            startPos,
            pos,
            drag,
            count
        }
    },
    data(){
        return{
            total_time:1000,
            time:0,
            is_played:false,
            pic_url:songIcon,
            song_name:"Unknown Music",
            playing:false,
            isPause:false,
            timeT:"00:00",
            totalTimeT:"00:00",
            count:0
        }
    },
    methods:{
        start_change_pos(e){
            console.log(e)
            this.startPos = e.clientX
            this.drag = true
        },
        move_pos(e){
            if(!this.drag) return
            var diff = e.clientX - this.startPos
            if(diff > 0 && this.time+this.total_time*(diff/this.$refs.slider_frame.offsetWidth)<this.total_time){
                this.pos = this.time+this.total_time*(diff/this.$refs.slider_frame.offsetWidth)
            }else if(diff < 0 && this.time-this.total_time*(Math.abs(diff)/this.$refs.slider_frame.offsetWidth) > 0){
                this.pos = this.time-this.total_time*(Math.abs(diff)/this.$refs.slider_frame.offsetWidth)
            }
            this.timeT = this.msToTime(this.pos*1000)
            this.$refs.slider.style.width = this.pos/this.total_time*100+'%'
        },
        end_move(e){
            if(!this.drag) return
            this.drag = false
            this.$refs.player.currentTime = this.pos
        },
        load_music(id){
            axios.get('http://127.0.0.1:3000/song/detail?ids='+id)
            .then(detail=>{
                console.log(detail.data)
                const result = detail.data
                this.pic_url = result.songs[0].al.picUrl
                this.song_name = result.songs[0].name
                axios.all(
                    [
                        axios.get('http://127.0.0.1:3000/song/url/v1?id='+id+'&level='+result.privileges[0].maxBrLevel),
                        axios.get('http://127.0.0.1:3000/lyric?id='+id)
                    ]
                )
                .then(axios.spread((song_url,song_lrc)=>{
                    console.log(song_url)
                    console.log(song_lrc)
                    const url = song_url.data.data[0].url
                    this.$refs.player.src = url
                    window.electron.load_lrc(result.songs[0].al.picUrl,result.songs[0].name,JSON.stringify(song_lrc))
                    this.total_time = result.songs[0].dt/1000
                    this.isPause = false
                    this.$refs.player.play()
                    this.playing = true

                }))
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        },
        pause(){
            if(!this.playing) return
            this.isPause = !this.isPause
            if(this.isPause){
                this.$refs.player.pause()
            }else{
                this.$refs.player.play()
            }
        },
        msToTime(ms){
            var s = Math.floor(ms/1000)
            var m = Math.floor(s / 60)
            s = s % 60
            s = s >= 10 ? s : '0'+s;
            m = m >= 10 ? m : '0'+m;
            return m + ':' + s
        },
        updateTime(){
            if((!this.playing) || this.drag) return
            this.time = this.$refs.player.currentTime
            this.$refs.slider.style.width = this.time/this.total_time*100+'%'
            this.timeT = this.msToTime(this.time*1000)
            this.totalTimeT = this.msToTime(this.total_time*1000)
        },
        show_lrc(){
            if(this.playing){
                console.log(this.count)
                if(this.count%2 == 0){
                    window.electron.playLrc()
                }else{
                    window.electron.hide_lrc()
                }
                this.count++
            }
        }
    },
    mounted(){
        window.electron.on_play_music(this.load_music)
        setInterval(this.updateTime,1)
    }
}
</script>
<style scoped>
#player{
    background-color: #313131;
    width: 80%;
    height: 10%;
    position: relative;
    top: calc( 10% * -1 - 5px);
    left: -50px;
    display: inline-block;
    z-index: 99;
    -webkit-user-select: none
}
#player::after,#player::before{
    content: "";
    position: absolute;
    left: -.1333rem;
    height: .2666rem;
    width: calc(100% + .2666rem);
    background-image: linear-gradient(90deg, #aeb3be 0, #aeb3be .2666rem, transparent 0, transparent calc(100% - .2666rem), #aeb3be calc(100% - .2666rem), #aeb3be);
}
#frame{
    width: 100%;
    height: 100%;
}
#song-image{
    height: 80%;
    position: absolute;
    top: 10%;
    left: 1%;
}
#slider-frame{
    height: 7%;
    width: 85%;
    position: absolute;
    top: 30%;
    left: 10%;
    border: 1px solid white;
}
#slider{
    background-color: white;
    height: 100%;
    width: 0%;
}
#hand{
    float: right;
    position: relative;
    left: 8px;
    top: -1px;
    width: 8px;
    height: 100%;
    border: 2px solid #aeb3be;
    background-color: #aeb3be;
}
#song-name{
    color: white;
    font-family: "Bender";
    position: absolute;
    left: 10%;
    top: 30%;
}
#song-time{
    color: white;
    font-family: "Bender";
    position: absolute;
    right: 5%;
    top: 30%;
}
#pause{
    font-family: "Bender";
    color: white;
    position: absolute;
    top: 30%;
    left: 75%;
}
</style>