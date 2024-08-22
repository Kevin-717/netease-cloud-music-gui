<script setup>
import '../assets/font.scss'
</script>
<template>
    <div id="lrcPlayer" ref="frame">
        <div id="detail">
            <div id="cover">
                <div id="border-up-left"></div>
                <div id="border-up-right"></div>
                <img id="cover-img" :src="cover">
                <div id="border-down-left"></div>
                <div id="border-down-right"></div>
            </div>
            <p id="title">{{ title }}</p>
        </div>
        <div id="lrc-area" ref="lrc_box">
            <ul id="lrcs">
                <li v-for="lrc_text,index in lrc" :class="{'active':index == play_index}">{{ lrc_text.text }}</li>
            </ul>
        </div>
        <canvas ref="waveShower" id="wave"></canvas>
    </div>
</template>
<script>
import {ref,nextTick} from 'vue'
export default {
    setup(){
        var player = ref()
        return{
            player,
        }
    },
    data(){
        return{
            cover:"",
            title:"",
            lrc:[],
            play_index:0
        }
    },
    methods:{
        load_lrc(cover,title,lrc){
            this.cover = cover
            this.title = title
            console.log(cover)
            console.log(title)
            const lrc_data = JSON.parse(lrc)
            const lrc_text = lrc_data.data.lrc.lyric
            const lrcs = lrc_text.split('\n').filter(item => item != '')
            this.lrc = []
            lrcs.forEach(item=>{
                if(item.split('[')[1].split(']')[1]){
                    this.lrc.push({
                        text:item.split('[')[1].split(']')[1],
                        time:this.textToSecond(item.split('[')[1].split(']')[0])
                    })
                }
            })

        },
        show_lrc_frame(){
            this.$refs.frame.style.top='50px'
        },
        hide_lrc_frame(){
            this.$refs.frame.style.top='100%'
        },
        updateLrc(){
            this.play_index = -1
            this.lrc.forEach(item=>{
                if(this.player.currentTime < item.time){
                    nextTick(()=>{
                        if(this.play_index < 5){
                            this.$refs.lrc_box.scrollTop = 0
                        }else{
                            this.$refs.lrc_box.scrollTop = (this.play_index-5)*47
                        }
                    })
                    return
                }
                this.play_index++
            })
        },
        textToSecond(text){
            var m = parseInt(text.split(':')[0])
            var s = parseInt(text.split(':')[1].split('.')[0])
            var ms = parseInt(text.split(':')[1].split('.')[1])*10
            return m*60+s+ms/1000
        },
        initAnalyser(){
            var context = new(window.AudioContext || window.webkitAudioContext)();
            var analyser = context.createAnalyser();
            analyser.fftSize = 512;
            var source = context.createMediaElementSource(this.player);

            source.connect(analyser);
            analyser.connect(context.destination);

            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);

            var canvas = this.$refs.waveShower;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            var ctx = canvas.getContext("2d");
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;

            var barWidth = WIDTH / bufferLength * 1.5;
            var barHeight;

            function renderFrame() {
                requestAnimationFrame(renderFrame);

                analyser.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, WIDTH, HEIGHT);

                for (var i = 0, x = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i]/255*HEIGHT*0.8;
                    ctx.fillStyle = "gray";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    x += barWidth+0.5;
                }
            }

            renderFrame();
        }
    },
    mounted(){
        this.player = this.$parent.$refs.player
        window.electron.on_show_lrc(this.show_lrc_frame)
        window.electron.on_hide_lrc(this.hide_lrc_frame)
        window.electron.on_load_lrc(this.load_lrc)
        setInterval(this.updateLrc,1)
        this.initAnalyser()
    }
}
</script>
<style scoped>
#lrcPlayer{
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    height: calc( 100% - 50px );
    background-color: black;
    z-index: -1;
    transition: top 0.3s;
}
#detail{
    width: 30%;
    height: 70%;
    position: absolute;
    top: 50px;
    left: 20px;
    background-color: rgba(40, 40, 40, 0.637);
}
#cover{
    width: 80%;
    position: absolute;
    left: 10%;
    top: 10%;
}
#cover-img{
    width: 100%;
    height: 100%
}
#title{
    width: calc(100% - 40px);
    position: absolute;
    bottom:5px;
    color: white;
    left: 20px;
    font-family: "Bender";
    font-size: 20px;
    text-align: center
}
#wave{
    position: absolute;
    width: 92%;
    margin-left: 4%;
    bottom: 90px;
    left: 0px;
    height: 80px;
    z-index: -1;
}
#border-up-left{
    border-top: 2px solid white;
    border-left: 2px solid white;
    width: 20px;
    height: 20px;
    position: absolute;
    top: -5px;
    left: -5px;
}
#border-up-right{
    border-top: 2px solid white;
    border-right: 2px solid white;
    width: 20px;
    height: 20px;
    position: absolute;
    top: -5px;
    left: calc(100% - 15px);
}
#border-down-left{
    border-bottom: 2px solid white;
    border-left: 2px solid white;
    width: 20px;
    height: 20px;
    position: absolute;
    top: calc(100% - 20px);
    left: -5px;
}
#border-down-right{
    border-bottom: 2px solid white;
    border-right: 2px solid white;
    width: 20px;
    height: 20px;
    position: absolute;
    top:  calc(100% - 20px);
    left: calc(100% - 15px);
}
#lrc-area{
    width: 55%;
    margin-left: 40%;
    margin-top: 20px;
    height: 80%;
    font-family:"Bender";
    font-size: 18px;
    color:white;
    overflow: scroll;
    text-align: left;
    background-color: rgba(40, 40, 40, 0.637);
}
#lrc-area::-webkit-scrollbar{
    display: none;
}
#lrcs{
    list-style-type: none;
}
#lrcs li{
    margin-bottom: 10px;
    padding: 5px;
    transition: all 0.3s;
    display: block;
    height: 27px;
    width: 150%;
}
#lrcs li.active{
    background-color: white;
    color: black;
    font-weight: bold;
    padding-left: 30px;
}
</style>