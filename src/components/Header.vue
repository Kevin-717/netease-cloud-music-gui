<script setup>
import "../assets/font.scss"
</script>
<template>
    <div id="header">
        <div class="line"></div>
        <p id="title" @click="back">My MUSIC</p>
        <div id="search-box">
            <input v-model="keyword" placeholder="SEARCH" @keyup.enter="search"/>
        </div>
        <div id="nav">
            <div class="nav-item">
                <router-link to="/"><p>发现音乐</p></router-link>
                <span>MUSIC</span>
            </div>
            <div class="nav-item">
                <router-link to="/top"><p>榜单信息</p></router-link>
                <span>TOPLIST</span>
            </div>
        </div>
        <div id="window">
            <span id="min" @click="min">🗕</span>
            <span id="close" @click="close">✖</span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            keyword:''
        }
    },
    methods:{
        min(){
            window.electron.min()
        },
        close(){
            window.electron.close()
        },
        search(){
            if(this.keyword.length != 0){
                console.log(this.keyword)
                window.electron.search(this.keyword)
            }
        },
        back(){
            window.electron.hide_search_event()
        }
    }
}
</script>
<style scoped>
#header{
    -webkit-app-region: drag;
    width: 100%;
    height: 50px;
}
.line{
    width: 25%;
    height: 0px;
    border: 2px dotted white; 
    margin-left: 7px;
}
#title{
    font-family: "Bender";
    font-weight: bold;
    font-size: 20px;
    text-align: left;
    position: relative;
    top: -15px;
    left: 20px;
    color: white;
    -webkit-app-region: no-drag;
    cursor: pointer;
}
#nav{
    position: absolute;
    left: calc( 50% + 20px );
    top: -20px;
    width: 50%;
}
.nav-item{
    color: white;
    font-family: "Geometos", "Sans-Bold", "SourceHanSansCN-Bold";
    float: left;
    padding-right: 10px;
}
.nav-item p{
    font-size: 20px;
    font-weight: bold;
}
.nav-item span{
    position: relative;
    font-size: 12px;
    top: -27px;
}
#search-box{
    position: absolute;
    top: 5px;
    left: 33%;
    width: 16%;
}
input{
    width: 100%;
    background-color: black;
    outline: none;
    border: 1px solid rgba(0,0,0,0);
    -webkit-app-region: no-drag;
    color:white;
    background-color: #2e2e2e;
}
#search-box::after, #search-box::before {
    content: "";
    display: block;
    position: absolute;
    left: -.1rem;
    width: calc(100% + .50rem);
    height: .1rem;
    background-image: linear-gradient(90deg, #c6c9ce 0, #c6c9ce .1rem, transparent 0, transparent calc(100% - .1rem), #c6c9ce calc(100% - .1rem), #c6c9ce);
}
#window{
    position: absolute;
    right: -5px;
    top: 5px;
    color: white;
    width: 50px;
    -webkit-app-region: no-drag;
}
#min{
    position: relative;
    top: -6px;
    left: -5px;
}
</style>