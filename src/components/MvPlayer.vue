<script setup>
import '../assets/font.scss'
</script>
<template>
    <div id="cover-frame" ref="frame">
        <div id="close" @click="close">✖</div>
        <div id="content">
            <video :src="mv_url" controls autoplay></video>
            <h3>{{ mv_title }}</h3>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data(){
        return {
            mv_url:'',
            mv_title:'',
        }
    },
    methods:{
        show(mvid){
            axios.all(
                [
                    axios.get('http://127.0.0.1:3000/mv/url?id='+mvid),
                    axios.get('http://127.0.0.1:3000/mv/detail?mvid='+mvid)
                ]
            )
            .then(axios.spread((mvurl,mvdet)=>{
                this.mv_url = mvurl.data.data.url,
                this.mv_title = mvdet.data.data.name,
                this.$refs.frame.style.width='100%'
                this.$refs.frame.style.height='100%'
            }))
            .catch(err=>{
                console.log(err)
            })
        },
        close(){
            this.$refs.frame.style.width='0%'
            this.$refs.frame.style.height='0%'
            this.mv_title = ''
            this.mv_url = ''
        }
    },
    mounted(){
        window.electron.on_play_mv(this.show)
    }
}
</script>
<style scoped>
#cover-frame *{
    transition:all 0.3s;
}
#cover-frame{
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 0%;
    z-index: 999;
    background-color: rgba(0,0,0,0.5);
    transition:all 0.3s;
    overflow: hidden;
}
#close{
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    cursor: pointer;
}
#content{
    width: 90%;
    height: 90%;
    position: absolute;
    top: 5%;
    left: 5%;
    background-color: rgb(66, 66, 66);
}
video{
    width: 90%;
    margin-left: 5%;
    margin-top: 30px;
}
h3{
    font-family: "Bender";
    color: white;
    text-align: left;
    margin: 10px 60px;
}
</style>