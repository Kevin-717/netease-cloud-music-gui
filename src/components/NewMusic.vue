<script setup>
import '../assets/font.scss'
</script>
<template>
    <div id="music-list">
        <div id="title">
            <p>新歌速递</p>
            <span>NEW MUSIC</span>
        </div>
        <div class="song-box" v-for="song in new_song_data">
            <div class="frame">
                <img :src="song.img" class="song-cover">
                <p class="song-title">{{ song.title }}</p>
                <span class="song-artist">{{ song.artist }}</span>
                <div class="play" @click="play(song.id)">▶</div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            new_song_data:[]
        }
    },
    methods:{
        get_data(){
            axios.get('http://127.0.0.1:3000/personalized/newsong?limit=3')
            .then(result=>{
                console.log(result)
                const songs = result.data
                this.new_song_data = []
                songs.result.forEach(item=>{
                    var singers = []
                    item.song.artists.forEach(item => {
                        singers.push(item.name)
                    })
                    this.new_song_data.push({
                        img:item.picUrl,
                        title:item.name,
                        artist:singers.join(' '),
                        id:item.id,
                    })
                })
            })
            .catch(error => {
                console.log(error)
            })
        },
        play(id){
            window.electron.play_music(id)
        }
    },
    mounted(){
        this.get_data()
    }
}
</script>
<style scoped>
#music-list{
    margin-left: 5%;
    width: 90%;
    text-align: left;
}
#title{
    border-bottom: 2px solid white;
}
#title span{
    font-size: 10px;
    padding: 1px;
    background-color: white;
    position: relative;
    top: 3px;
}
#title p{
    color:white;
    font-size: 16px;
    margin: 0;
    padding: 0;
    position: relative;
    top: 10px;
}
.frame{
    background-color: #2a2a2a;
    width: 100%;
    height: 100%;
    margin-top: 15px;
}
.song-box:after,.song-box::before{
    content: "";
    position: absolute;
    left: -.1333rem;
    height: .2666rem;
    width: calc(100% + .2666rem);
    background-image: linear-gradient(90deg, #aeb3be 0, #aeb3be .2666rem, transparent 0, transparent calc(100% - .2666rem), #aeb3be calc(100% - .2666rem), #aeb3be);
}
.song-box{
    width: 100%;
    height: 80px;
    position: relative;
}
.song-cover{
    width: 70px;
    margin-top: 5px;
    margin-left: 5px;
}
.song-title{
    position: absolute;
    margin: 0;
    top: 15px;
    left: 80px;
    color: white;
    font-family: "Bender";
    font-size:18px;
}
.song-artist{
    position: absolute;
    top: 50px;
    left: 80px;
    color:white;
    font-family: "Bender";
    font-size: 12px;
}
.play{
    width: 50px;
    height: 50px;
    position: absolute;
    right: 30px;
    top: calc( 50% - 25px );
    color: rgb(0, 0, 0);
    font-size: 25px;
    background-color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
}
</style>