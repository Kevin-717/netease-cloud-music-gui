<template>
    <div id="search" ref="frame">
      <el-tabs>
        <el-tab-pane label="歌曲" >
          <el-table :data="tableData()" style="width: 100%;height:50%;background-color: black"
          @cell-click="play">
              <el-table-column type="index" width="auto" min-width="10%"/>
              <el-table-column prop="name" label="歌名" width="auto" min-width="50%" />
              <el-table-column prop="singer" label="歌手" width="auto" min-width="30%" />
              <el-table-column prop="durtation" label="时长" width="auto" min-width="10%"/>
          </el-table>
          <br>
          <div class="pagination-block">
              <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
              />
          </div>
        </el-tab-pane>
        <el-tab-pane label="mv搜索">
          <el-card v-for="mv in mvData" class="card">
            <img :src="mv.cover" class="cover">
            <p @click="play_mv(mv.id)">{{ mv.name }}</p>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <br><br><br><br><br>
    </div>
</template>
<script>
import { reactive, toRefs,ref } from "vue";
import axios from 'axios'
export default {
  name: "HomeView",
  components: {},
  setup() {
    //表格的全数据（这里是自定义的列表，要看分页效果自行往此数组内加数据）
    // const allTableData = [
    //   {
    //     date: "2016-05-03",
    //     name: "Tom",
    //     address: "No. 189, Grove St, Los Angeles",
    //   },
    // ];
    var allTableData = ref([
      {
        name: "unknown",
        singer: "unknown",
        durtation: "00:00",
        id:0
      },
    ]);
    //表格用到的参数
    const state = reactive({
      page: 1,
      limit: 10,
    });
    //前端限制分页（tableData为当前展示页表格）
    const tableData = () => {
      return allTableData.value.filter(
        (item, index) =>
          index < state.page * state.limit &&
          index >= state.limit * (state.page - 1)
      );
    };
    //改变页码
    const handleCurrentChange = (e) => {
      state.page = e;
    };
    //改变页数限制
    const handleSizeChange = (e) => {
      state.limit = e;
    };
    const total = ref(0);
    return {
      allTableData,
      tableData,
      handleCurrentChange,
      handleSizeChange,
      ...toRefs(state),
      total
    };
  },
  data(){
    return {
      mvData:[]
    }
  },
  methods:{
    search_by_keyword(keyword){
        console.log(keyword)
        axios.get('http://127.0.0.1:3000/cloudsearch?keywords='+keyword+'&limit=100')
        .then(data => {
            this.total = 0
            console.log(data.data)
            const result = data.data.result;
            this.allTableData = []
            result.songs.forEach(item => {
              if(item.fee != 1 && item.fee != 4){
                  var singers = []
                  item.ar.forEach(item => {
                      singers.push(item.name)
                  })
                  this.allTableData.push(
                      {
                          name:item.name,
                          singer:singers.join(' '),
                          durtation:this.msToTime(item.dt),
                          id:item.id
                      }
                  )
                  this.total++;
              }
            })
            this.search_mv(keyword)
            this.$refs.frame.style.top='50px'
        })
        .catch(err => {
            console.log(err)
            this.$refs.frame.style.top='100%'
        })
    },
    search_mv(keyword){
      console.log(keyword)
      axios.get('http://127.0.0.1:3000/cloudsearch?keywords='+keyword+'&limit=100&type=1004')
      .then(data => {
        console.log(data.data)
        const result = data.data.result
        this.mvData = []
        result.mvs.forEach(item => {
          this.mvData.push({
            name:item.name,
            cover:item.cover,
            id:item.id
          })
        });
      })
      .catch(err => {
          console.log(err)
      })
    },
    hide_search(){
        this.$refs.frame.style.top='100%'
    },
    msToTime(ms){
        var s = Math.floor(ms/1000)
        var m = Math.floor(s / 60)
        s = s % 60
        s = s >= 10 ? s : '0'+s;
        m = m >= 10 ? m : '0'+m;
        return m + ':' + s
    },
    play(data){
      console.log(data)
      window.electron.play_music(data.id)
    },
    play_mv(id){
      window.electron.play_mv(id)
    }
  },
  mounted(){
    window.electron.on_search(this.search_by_keyword);
    window.electron.on_hide_search(this.hide_search)
  }
};
</script>
<style scoped>
#search{
    position:absolute;
    top:100%;
    width: 100%;
    height: calc( 100% - 50px );
    background-color: black;
    transition: top 0.3s;
    overflow: scroll;
}
#search::-webkit-scrollbar{
  display: none;
}
#search *{
    font-family: "Bender";
    font-size: 17px;
}
.cover{
  width: 200px;
  height: 112px;
}
.card{
  display: inline-block;
  padding: 0;
  width: 230px;
  margin: 20px;
}
.card p{
  height: 40px;
}
</style>