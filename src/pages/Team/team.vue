<template>
  <div class="lz-myteam">
    <div class="team-header">
      <van-nav-bar title="我的团队" left-text right-text="查看说明" left-arrow @click-left="onClickLeft" @click-right="ruleTeam"/>
    </div>
    <div class="sum_list">
      <van-notice-bar color="#333" background="#fff">
        <slot name="left-icon">
          <img src="../../assets/images/broad.png" alt>
        </slot>数据每十分钟刷新1次
      </van-notice-bar>
      <div id="sum_circle" style="height:1.89rem;background:#fff;"></div>
    </div>
    
      
        <div class="sort-condition">
          <ul>
            <li @click="toggle()" v-bind:class="{ active: isHot }">
              <span>活跃度</span>
              <van-icon name="arrow-up"/>
              <van-icon name="arrow-down"/>
            </li>
            <li @click="toggle2()" v-bind:class="{ active: isNum }">
              <span>推荐人数</span>
              <van-icon name="arrow-up"/>
              <van-icon name="arrow-down"/>
            </li>
            <li @click="toggle3()" v-bind:class="{ active: isTime }">
              <span>时间</span>
              <van-icon name="arrow-up"/>
              <van-icon name="arrow-down"/>
            </li>
          </ul>
        </div>
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
        <div class="list">
          <div class="mem-list" v-for="item in  teamList" :key="item.index">
            <div class="mall-image">
              <img src="../../assets/images/food1.png" alt>
              <!-- <span>New</span> -->
            </div>
            <div class="mall-content">
              <div class="mem-noramal-title">{{item.userName}} {{item.mobile}}</div>
              <div class="mem-noramal-num">
                <span>
                  团队人数：
                  <i>{{item.recommendCount}}</i>
                </span>
                <span>
                  活跃度：
                  <i>{{item.userActivityCount}}</i>
                </span>
              </div>
              <div class="mem-normal-direct">
                <span>
                  直推用户：
                  <i>{{item.subordinateRecommendCount}}</i>
                </span>
                <span>
                  直推商家：
                  <i>{{item.subordinateRecommendBusinessCount}}</i>
                </span>
              </div>
              <div class="mem-register-time">
                <span>
                  注册时间：
                  <i>{{item.regTime}}</i>
                </span>
              
              </div>
              <div class="mem-register-time">
                 <span>
                  是否商家：
                  <i>{{item.isBusiness | fixName}}</i>
                </span>
              
              </div>
               
            </div>
          </div>
        
        </div>
        </van-list>
   

    <!-- <div class="team-footer" @click="ruleTeam">查看说明</div> -->
  </div>
</template>

<script>
export default {
  name: "team",
  data() {
    return {
      isHot: false,
      isNum: false,
      isTime: false,
      uid:"",
      token:"",
      page:1,
      limit:10,
      sortOrder:"",
      mapData: [],
      teamList:[],
      loading:false,
      finished:false,
      hasMore:false,
      loadingShow:false,
      nodata:false,
    };
  },

  mounted() {
   
    this.token = sessionStorage.getItem("redisTokenKey");
    this.uid = localStorage.getItem("id");
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
      
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      this.uid = 22;
    }
    
   
    this.getMyTeamStatistics();
    
    this.getTeam(2);
    this.cronTab();
  },
  filters:{
    fixName(val){
      if( val == "0"){
        return "用户"
      }else{
        return "商家"
      }
    }
  },
  methods: {
    //每十分钟刷新一次
    cronTab(){  
      let _this = this;
      setInterval(()=>{
        _this.getMyTeamStatistics();
        
      },600000)
    },
    //获取我的团队统计
    getMyTeamStatistics(){
      this.token = sessionStorage.getItem("redisTokenKey");
      this.$http.post("/newLzshApi/userInfo/myTeamStatistics","data={'uid':'" + this.uid + "'}",{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        if(res.code == "121"){
          this.autoLogin();
        }else{
          this.mapData = [
            { value: Number(res.data.subordinateRecommendCount), name: "用户数" },
            { value: Number(res.data.recommendCount), name: "直接用户" },
            { value: Number(res.data.userActivityCount), name: "用户活跃度" },
            { value: Number(res.data.recommendBusinessCount), name: "商家数" },
            { value: Number(res.data.subordinateRecommendBusinessCount), name: "直推商家" },
            { value: Number(res.data.businessActivityCount), name: "商家活跃度" }
          ];
         
          let sum_circle = this.$echarts.init(document.getElementById("sum_circle"));
          this.drawLine(sum_circle);
          
        }
        
      })
    },
    //我的团队列表
    getTeam(sortOrder){
      this.loadingShow = true;
      this.token = sessionStorage.getItem("redisTokenKey");
      let params = {
        uid:this.uid+"",
        page:"1",
        limit:"10",
        sort:sortOrder+""
      };
      this.$http.post("/newLzshApi/userInfo/myTeamQuery","data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        if(res.code == '121'){
          this.autoLogin();
        }else{
          this.loadingShow = false;
          this.teamList = res.data.resultList;
          this.hasMore = res.data.hasMore;
          this.sortOrder = sortOrder;
          if(res.data.resultList.length == 0){
              this.nodata = true;
            }else{
              this.nodata =false;
            }
           
        }
      })  
    },
    //加载更多
    onLoad(){
      let _this = this;  
      setTimeout(() => {
          if( _this.hasMore !== undefined){
         
            let params = {
              uid:_this.uid+"",
              page:++_this.page+"",
              limit:_this.limit,
              sort:_this.sortOrder+""
            }
            _this.$http.post( "/newLzshApi/userInfo/myTeamQuery", "data="+JSON.stringify(params),{
                  headers: {
                    'token':_this.token
                  },
            }).then(res=>{
              _this.teamList.push(...res.data.resultList);
              _this.hasMore = res.data.hasMore;
              // 加载状态结束
              _this.loading = false;
            })
          }else{
             _this.loading = false;
            _this.finished = true;
          }       
      }, 500);
    },


    onClickLeft() {
      this.$router.go(-1);
    },
    onClick(index, title) {
      this.$toast(title);
    },
    toggle() {
      this.isHot = !this.isHot;
      this.page = 1;
      this.getTeam(1);
      this.finished = false;
    },
    toggle2() {
      this.isNum = !this.isNum;
       this.page = 1;
      this.getTeam(2);
      this.finished = false;
    },
    toggle3() {
      this.isTime = !this.isTime;
      this.page = 1;
      this.getTeam(3);
      this.finished = false;
    },
    drawLine(name) {
      let curData = this.mapData;
      console.log(curData);
      name.setOption({
        // 移入显示文字
        tooltip: {
          trigger: "item", // 项目触发
          formatter: "{a} <br/>{b}: {c} ({d}%)",
          position: [20, 20]
        },
        // 图解 可以设置在圆环图的中心
        graphic: {
          type: "text",
          left: "right",
          top: "center",
          z: 2,
          zlevel: 100,
          style: {
            text: "",
            fontSize: 12,
            x: 100,
            y: 100,
            textAlign: "center",
            fill: "#f00",
            width: 100,
            height: 100
          }
        },
        // 左侧提示 图表的标注
        legend: {
          orient: "vertical",
          x: "left",
          // data:['用户数','直接用户','用户活跃度','商家数','直推商家','商家活跃度'],
          // data:this.mapData
          formatter: function(name) {
            var res = "";
            for (var i = 0; i < curData.length; i++) {
              if (curData[i].name == name) {
                res = curData[i].value;
              }
            }
            return name + "  " + res;
          }
        },

        color: [
          "#ED4848",
          "#C4799F",
          "#E68B5F",
          "#FF8585",
          "#94CD3A",
          "#64B7EB"
        ],
        series: [
          {
            name: "",
            // 显示成饼状
            type: "pie",
            // 内环和外环的大小
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            // 主标题
            label: {
              normal: {
                // 是否默认显示文字
                show: false
                // position: 'center'
              },
              emphasis: {
                // 移入是否显示文字
                show: false, // 不显示
                // 文字类型
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            center: ["85%", "45%"],
            // 是否显示连接线
            labelLine: {
              normal: {
                show: false
              }
            },
            // 每一个饼状图的信息
            data: curData
          }
        ]
      });
    },
    ruleTeam() {
      this.$router.push({ path: "teamrule" });
    },
    //自动登录
    autoLogin(){
      let params ={
        uid:this.uid+""
      };
        this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params),
          
        ).then(res=>{
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);
          
          this.getTeam()
        })
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background: #ff3636;
  height: 1.8rem;
  line-height: 1.8rem;
}
.van-nav-bar .van-icon {
  color: #fff;
  top: -0.35rem;
}
.van-nav-bar__title {
  color: #fff;
  font-size: 0.32rem;
  line-height: 1.2rem;
}
.van-notice-bar__content {
  font-size: 0.18rem;
}
.van-notice-bar__content img {
  width: 0.26rem;
  height: 0.22rem;
}
.sum_list {
  position: relative;
  border-radius: 0.42rem;
  box-shadow: 0 0 0.14rem 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-0.6rem);
  z-index: 10;
  width: 7rem;
  margin: auto;
  overflow: hidden;
}
.van-tabs__nav--card {
  margin: 0;
}
.team-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-size: 0.33rem;
  color: #fff;
  z-index: 10;
  background: #ff3636;
}
.van-tabs__nav--card{
  display: none !important;
}
.order-list-nodata{
  position:relative;
  padding-top:0.3rem;
}
.order-list-nodata img{
  display:block;
  width:2.09rem;
  height:2.09rem;
  margin:auto;
}
.order-list-nodata span{
  display: block;
  font-size: 0.33rem;
  font-weight: 400;
  color: #666;
}
.van-nav-bar__right{
  top:0;
  font-size: 0.30rem;
  line-height: 1.2rem;
}
.van-nav-bar__text{
 color:#fff;
}
</style>
