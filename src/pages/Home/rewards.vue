<template>
  <div>
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="order-list-content">
        <ul>
          <li class="list-box" v-for="item in scoreRocordList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费积分-来自积分兑换</div>
              <div class="list-order-time">{{item.crtTime | fixDate}}</div>
            </div>
            <div class="list-number">
              <button @click="showRedPacket(item.id,item.score)">领取奖励</button>
            </div>
          </li>
          <!-- <li class="list-box">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费积分-来自CL</div>
              <div class="list-order-time">6月12日 08:23</div>
            </div>
            <div class="list-number">
              <button @click="showRedPacket">领取奖励</button>
            </div>
          </li>
          <li class="list-box">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费积分-来自CL</div>
              <div class="list-order-time">6月12日 08:23</div>
            </div>
            <div class="list-number">
              <button @click="showRedPacket">领取奖励</button>
            </div>
          </li> -->
        </ul>
      </div>
    <!-- <div class="redPacket" v-show="redPacketShow" transition="fade"> -->
      <van-popup v-model="redPacketShow">
        <div class="redPacket">
          <div class="con_box">
            <div class="con_top">
              <span>积分奖励</span>
            </div>
            <span style="display:none;">{{redPacktId}}</span>
            <div class="con_logo">
              <img src="../../assets/images/ic_logo.png" alt>
            </div>
            <div class="con_bottom">
              <button @click="getRedPacket">领取红包</button>
            </div>
          </div>
        </div>
        
      </van-popup>
     
  
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "领取积分奖励",
      redPacketShow: false,
      uid:"",
      score:"",
       token:"bc1d578c323e3fc5044ca46e1c743691",
      scoreRocordList:[]
    };
  },
  components: {
    Memnavbar
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    },
  },
  mounted(){
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
     
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 
      console.log("本地测试");
      this.uid = 3;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getScoreRecord();
  },
  methods: {
    
    getScoreRecord(){
      let params ={
          uid:this.uid
        };
      this.$http.post( "/newLzshApi/score/queryScoreReward", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
   
        this.scoreRocordList = res.data;
      })
    },
    showRedPacket(idx,score) {
      console.log(1);
      this.redPacketShow = true;
      this.redPacktId = idx;
      this.score = score;
    },
    getRedPacket(){
      this.redPacketShow = false;
      let params ={
          uid:this.uid+"",
          id:this.redPacktId+"",
          score:this.score+""
        };
      this.$http.post( "/newLzshApi/score/receiveReward", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.$toast('领取成功');
        this.getScoreRecord();
      }) 
    }
  }
};
</script>
<style lang="stylus" scoped>
.inte_record {
  width: 100%;
  height: 1.1rem;
  line-height: 1.1rem;
  background-color: #efefef;
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

.consum_rewards {
  display: block;
  position: relative;
  top: -0.9rem;
  right: 0.2rem;
  float: right;
  width: 1.1rem;
  height: 0.6rem;
  line-height: 0.7rem;
  background-color: #ff3636;
  font-size: 0.2rem;
  font-weight: 500;
  border-radius: 0.1rem;
  border: none;
  vertical-align: middle;
  color: #fff;
}

.redPacket {


  .con_box {
    width: 5.11rem;
    height: 7.87rem;
    background-color: #F1333B;
    border-radius: 0.28rem;
    border: none;

  
    overflow: hidden;
  }

  .con_top {
    width: 100%;
    height: 3.31rem;
    background-color: #F1333B;
    border-radius: 0.28rem 0.28rem 0 0;

    span {
      display: inline-block;
      font-size: 0.4rem;
      font-weight: 700;
      color: #F7F7F7;
    }
  }

  .con_logo {
    width: 1.76rem;
    height: 1.76rem;
    background-color: #F7F7F7;
    border-radius: 50%;
    margin: -0.72rem auto;
    position: relative;
    z-index: 1;

    img {
      width: 1.1rem;
      height: 0.92rem;
      margin: 0.42rem auto;
    }
  }

  .con_bottom {
    width: 120%;
    height: 4.57rem;
    border-top-right-radius: 100%;
    border-top-left-radius: 100%;
    transform: translate(-0.6rem, -1.18rem);
    background: #f7f7f7;
    margin-top: 0.9rem;

    button {
      width: 1.98rem;
      height: 0.53rem;
      background-color: #F1333B;
      color: #F7F7F7;
      font-size: 0.32rem;
      font-weight: 200;
      border: none;
      border-radius: 0.12rem;
      margin: 2.18rem auto;
      margin-left: 0.1rem;
    }
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
  width 1.4rem
  button {
      display: block;
      margin: 0.4rem auto;
      width: 1.4rem;
      height: 0.6rem;
      background-color: #ff3636;
      font-size: 0.24rem;
      font-weight: 500;
      border-radius: 0.13rem;
      border: none;
      vertical-align: middle;
      color: #fff;
    }
}
.van-popup{
  background none;
}
</style>

