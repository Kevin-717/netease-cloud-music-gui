<template>
    <el-carousel trigger="click" indicator-position="outside">
        <el-carousel-item v-for="image in banner_images" :key="image">
            <img :src="image" width="784px">
        </el-carousel-item>
    </el-carousel>
</template>
<script>
import { ref } from 'vue';
import axios from 'axios'
export default {
    data(){
        return{
            banner_images:[]
        }
    },
    methods:{
        load_banner(){
            axios.get('http://127.0.0.1:3000/banner')
            .then(data => {
                const banners = data.data.banners.filter(item => item.typeTitle != '广告')
                this.banner_images = []
                console.log(banners)
                banners.forEach(item => {
                    this.banner_images.push(item.imageUrl)
                })
                console.log(this.banner_images)
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    mounted(){
        this.load_banner();
    }
}
</script>