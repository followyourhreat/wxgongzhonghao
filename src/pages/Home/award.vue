<template>
  <div>
    <div class="award_content">
      <div class="con_box">
        <div class="con_top">
          <span>消费券奖励</span>
        </div>
        <div class="con_logo">
          <img src="../../assets/images/ic_logo.png" alt>
        </div>
        <div class="con_bottom">
          <button @click="showCsmDetail">领取红包</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";

export default {
  data() {
    return {
      title: "领取消费券奖励",
      scoreData:"",
      uid:"",
      token:"",
      billNo:"",
    };
  },
  components: {
    Memnavbar
  },
  mounted(){
    if (
      localStorage.getItem("id") !== undefined &&
      localStorage.getItem("id") !== null
    ) {
      this.uid = localStorage.getItem("id");
    } else {
      //没有uid应该提示去登录  此处为了本地测试先放uid=
      console.log("本地测试");
      this.uid = 128;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getUserOrderInfoList();
   
  },
  methods: {
    //领取消费券
    showCsmDetail() {
    
      let params = {
        uid:this.uid,
        billNo:""
      }
      this.$http.post("/newLzshApi/coupon/receiveCoupon","data=" + JSON.stringify(params),{
        headers:{
          token:this.token
        }
      }).then(res=>{
          this.$toast("领取消费券成功");
          this.scoreData = res.data;
          this.$router.push({path:"/counpon/csmCounponDetail",query:{
            curCounpon:this.scoreData
          }});
        
      })

      
    },
    //获取订单号
  //获取用户订单列表
    getUserOrderInfoList(){
        this.token = sessionStorage.getItem("redisTokenKey");
        this.loadingShow = true;
        this.token = sessionStorage.getItem("redisTokenKey");
        let params = {
          uid:this.uid,
          currentPage:"1",
          pageSize:"10",
          searchDate:""
        }
        this.$http.post("/newLzshApi/order/getOrderInfoList","data=" + JSON.stringify(params),{
          headers:{
            token:this.token
          }
        }).then(res=>{
            if(res.code == '121'){
              this.autoLogin()
            }else{
              this.billNo = res.data.userOrderInfoList[0].bill_no;
            }
          
        })
      
    },

    //自动登录
    autoLogin() {
      let params = {
        uid: this.uid + ""
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params)
        )
        .then(res => {
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
          
          this.getUserOrderInfoList()
        });
    }
  }
};
</script>
<style lang="stylus">
.award_content {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  height: 13.32rem;

  .con_box {
    width: 5.11rem;
    height: 7.87rem;
    background-color: #F1333B;
    border-radius: 0.28rem;
    border: none;
    margin: 2.73rem auto;
    box-shadow: 0.1rem 0.1rem 0.8rem #666;
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
      margin: 1.18rem auto;
      margin-left: 0.1rem;
    }
  }
}
</style>

