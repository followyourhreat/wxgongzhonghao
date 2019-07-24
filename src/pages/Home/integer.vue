<template>
  <div class="order_list" style="margin:0;padding=0">
    <van-nav-bar
      :title="title"
      left-text
      right-text
      left-arrow
      @click-left="onClickLeft"
     
    />
    <div class="int_tab">
      <span class="left">
        今日积分：
        <span class="inte_tody">{{todayScore}}</span>
      </span>
      <span class="right" @click="getIntegExplain">积分说明</span>
    </div>
    <div class="int-curInteral">
      <span class="middle">
        当前积分：
        <span class="inte_curren">{{totalScore}}</span>
      </span>
      <button @click="getRewards"  v-bind:class="{noActive:isDisable}">领取奖励</button>
    </div>
    <div class="inte_item">
      <span class="record_left">积分记录</span>
      <span class="record_right" @click="getAllRecord">查看所有记录</span>
    </div>
    <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <ul>
          <li class="list-box" v-for="item in scoreList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费积分-来自{{item.userName}}</div>
              <div class="list-order-time">{{item.crtTime | fixDate}}</div>
            </div>
            <div class="list-number">+{{item.score}}</div>
          </li>
        
        </ul>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
      </div>
    <div class="inte_item">
      <span class="record_left">领取奖励记录</span>
      <span class="record_right" @click="getAward">查看所有记录</span>
    </div>
    <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata2">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <ul>
          <li class="list-box" v-for="item in scoreExchangeList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">积分兑换奖励</div>
              <div class="list-order-time">{{item.crtTime | fixDate}}</div>
            </div>
            <div class="list-number">+{{item.couponMoney}}</div>
          </li>
         
        </ul>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
      </div>
  </div>
</template>
<script>
import memnavbar from "../../components/memnavbar";
export default {
  name: "orderList",
  data() {
    return {
      show: false,
      title: "我的积分",
      token:"bc1d578c323e3fc5044ca46e1c743691",//查询用户积分的token
      todayScore:"",//今日积分
      totalScore:"",//当前积分
      uid:"",//用户id
      dates:new Date(),
      scoreList:[],
      scoreExchangeList:[],
      loadingShow:false,//加载中
      nodata:false,
      nodata2:false,
     
      isDisable:false,
    };
  },
  mounted() {
    // this.token = sessionStorage.getItem("redisTokenKey"); //正式的获取token
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
      
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      this.uid = 3;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getUserIntegral();
    this.getIsIntegral();
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    } 
  },
  methods: {
    //获取当前用户积分信息
    
    getUserIntegral(){
      this.token = sessionStorage.getItem("redisTokenKey");
      this.loadingShow = true;
      this.$http.post( "/newLzshApi/score/getUserScoreInfo", "data={'uid':'" + this.uid + "'}",{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.loadingShow = false;
        if(res.code == "121"){
          this.autoLogin();
        }else{
          this.todayScore = res.data.todayScore;
          this.totalScore = res.data.totalScore;
          // this.totalScore = 0;
         
          this.scoreList = res.data.scoreList;
          if(res.data.scoreList.length == 0){
            this.nodata = true;
          }else{
            this.nodata =false;
          }
          this.scoreExchangeList = res.data.scoreExchangeList;
          if(res.data.scoreExchangeList == 0){
              this.nodata2 = true;
          }else{
            this.nodata2 =false;
          }
          
        }
        

      })
       
    },
    //查询是否有积分奖励
    getIsIntegral(){
      let params ={
          uid:this.uid
        };
      this.$http.post( "/newLzshApi/score/queryScoreReward", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        if(res.data.length>0){
          this.isDisable = false;
        }else{
          this.isDisable = true;
        }
        
      })


    },
    getIntegExplain() {
      this.$router.push({ path: "explain" });
    },
    getAllRecord() {
      this.$router.push({ path: "allrecord" });
    },
    getRewards() {
      if(this.totalScore == 0){
        this.$toast("亲，已经没有可以领取的积分了。");
        return;
      }else{
        this.$router.push({ path: "rewards" });
      }
      
    },
    getAward() {
      this.$router.push({ path: "changeAward" });
    },
     onClickLeft(){
      this.$router.push({path:"/home"});
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
         
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
         
          this.getUserIntegral();
        })
    }

  },
  components: {
    memnavbar
  }
};
</script>
<style lang="stylus" scoped>

.order_list {
  color: #333;
  background #E5E4E4
  .int_tab {
    width: 100%;
    height: auto;
    background: #fff;
    position:relative;
    overflow hidden;
    border-top-left-radius:0.28rem;
    border-top-right-radius:0.28rem;
    margin-top:0.15rem;
    .left, .right, .middle {
      display: inline-block;
      position: relative;
      font-size: 0.2rem;
      font-weight: 700;
      justify-content: center;
      padding: 0.4rem 0.3rem 0.1rem 0.3rem;
      color: #666;
    }

    .left {
      float: left;
    }

    .inte_tody {
      color: #ff3636;
    }

    .inte_curren {
      color: #fdb150;
    }

   

    .right {
      float: right;
    }

   
  }
  .int-curInteral{
    background:#fff;
    overflow hidden
    border-bottom-left-radius:0.28rem;
    border-bottom-right-radius:0.28rem;
    margin-bottom 0.15rem
    span{
      font-size:0.3rem;
      color:#666;
      justify-content: center;
      .inte_curren{
        color:#efbc5f;
        font-size:0.4rem;
      }
    }
     
     button {
      display: block;
      margin: 0.4rem auto;
      width: 1.45rem;
      height: 0.6rem;
      background-color: #ff3636;
      font-size: 0.18rem;
      font-weight: 500;
      border-radius: 0.21rem;
      border: none;
      vertical-align: middle;
      color: #fff;
    }
  }
  .inte_item {
    width: 100%;
    height: 1.1rem;
    line-height: 1.1rem;
    background-color: #fff;
    overflow:hidden;
    .record_left, .record_right {
      display: inline-block;
      position: relative;
      font-size: 0.28rem;
      font-weight: 700;
      color: #333;
      padding: 0 0.3rem 0 0.3rem;
    }

    .record_left {
      float: left;
      justify-content: center;
    }

    .record_right {
      float: right;
      color: #999999;
      justify-content: center;
    }
  }

  .inte_record {
    width: 100%;
    height: 1.1rem;
    line-height: 1.1rem;
    background-color: #fff;
    border-bottom: 0.01rem solid #efefef;
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;

    .inte_img {
      width: 0.84rem;
      height: 0.84rem;
      position: relative;
      top: 0.1rem;
      left: 0.5rem;
    }

    img {
      width: 0.84rem;
      height: 0.84rem;
    }

    .inte_middle {
      display: block;
      line-height: 0.5rem;
      width: 7.3rem;
      height: 0.1rem;
      padding-top: 0.3rem;
    }

    .consum_inte, .consum_count, .consum_time {
      display: inline-block;
      font-size: 0.2rem;
      font-weight: 500;
      color: #666;
    }

    .consum_inte, .consum_time {
      position: relative;
      top: -1.3rem;
      margin: -0.1rem 0 -2rem 0;
    }
  }

  .consum_count {
    position: relative;
    top: -0.9rem;
    left: -0.3rem;
    float: right;
  }
}
.order-list-content{
  margin-bottom 0.15rem;
}
.order-list-content>ul{
  padding:0 0.3rem;
}
.counpon-cate-container {
  position: relative;
  overflow: hidden;
}
.counpon-cate-container > div {
  float: left;
  width: 50%;
  font-size: 0.3rem;
  color: #333;
  padding: 0.2rem 0;
  height: 1.2rem;

  position: relative;
  border-bottom: 0.01rem solid #ccc;
}
.counpon-cate-container > div span {
  text-align: center;
  display: block;
}
.counpon-cate-left::after {
  content: " ";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  width: 0.01rem;
  height: 1.2rem;
  background: #ccc;
}
.counpon-cate-container > div.counpon-cate-left {
  color: #ff3636;
}
.list-number{
  font-size:0.4rem;
  color:#FF3636;
}
.order-list-nodata{
  position relative
}
.order-list-nodata img{
  display block;
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
.noActive{
  opacity:0.5;
}
.van-nav-bar {
  background: #f7f7f8;
  color: #000;
}
.van-nav-bar .van-icon {
  color: #ff3333;
}
.van-nav-bar__title {
  color: #000;
  font-size: 0.32rem;
}

</style>


