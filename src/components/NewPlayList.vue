<script setup>
import '../assets/font.scss'
</script>
<template>
    <div id="playlist-list">
        <div id="title">
            <p>推荐歌单</p>
            <span>RECOMMENDED PLAYLISTS</span>
        </div>
        <div id="list">
            <div class="playlist-box" v-for="playlist in playlists">
                <img class="cover" :src="playlist.pic"/>
                <p class="playlist-title">{{ playlist.name }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data(){
        return{
            playlists:[]
        }
    },
    methods:{
        load_data(){
            axios.get('http://127.0.0.1:3000/personalized?limit=24')
            .then(data=>{
                const result = data.data.result
                this.playlists = []
                result.forEach(item=>{
                    this.playlists.push({
                        name:item.name,
                        id:item.id,
                        pic:item.picUrl
                    })
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },
    mounted(){
        this.load_data()
    }
}
</script>
<style scoped>
#playlist-list{
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
#list{
    padding: 0;
    margin: 0
}
.playlist-box{    
    padding: 5px;
    display: inline-block;
    width: 150px;
    height: 230px;
    background-color: #3f3f3f;
    border:1px solid white;
    margin: 30px 10px 10px;
    position: relative;
}
.playlist-box .cover{
    width: 120px;
    height: 120px;
    margin-left: 10%;
    margin-top: 10%
}
.playlist-box .playlist-title{
    color: white;
    text-align: center;
    font-family:"Bender";
    position: absolute;
    top: 60%;
}
</style>