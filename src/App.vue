<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Search from './components/Search.vue'
import Player from './components/Player.vue'
import MvPlayer from './components/MvPlayer.vue'
</script>
<template>
  <div id="content">
    <Header></Header>
    <router-view id="box"></router-view>
    <Footer></Footer>
    <Search></Search>
    <Player></Player>
    <MvPlayer></MvPlayer>
  </div>
</template>
<style>
html,body,#app{
  height:100%;
  width: 100%;
  padding: 0;
  background-color: black;
  overflow: hidden;
}
a{
  text-decoration: none;
  color: white;
}
a:hover{
  color: white;
}
</style>
<style scoped>
#content{
  width: 98%;
  height: 100%;
  position: absolute;
  top: 1%;
  left: 1%;
}
#content::after,#content::before{
    content: "";
    position: absolute;
    left: -.1333rem;
    height: .2666rem;
    width: calc(100% + .2666rem);
    background-image: linear-gradient(90deg, #aeb3be 0, #aeb3be .2666rem, transparent 0, transparent calc(100% - .2666rem), #aeb3be calc(100% - .2666rem), #aeb3be);
}
#box{
  width: 100%;
  height: calc( 100% - 70px );
  padding-bottom: 10px;
  overflow-y: scroll;
}
#box::-webkit-scrollbar{
  display: none;
}
</style>