<template>
  <div class="payment-body">
   <memnavbar :pageTitle="title"></memnavbar>
   <div class="order-detail-body">
       
        <div class="order-new-container">
            <div class="order-new-header">

            </div>
            
            <div class="order-detail-content order-detail-new">
              <div class="order-new-check">
                    <img src="../../assets/images/pay-success.png" alt="">
                    <span>支付成功</span>
                </div>
                <div class="order-new-number">
                    ￥{{userOrderInfo.order_money}}
                </div>
                <van-button plain type="primary">获得积分{{consumerCouponReward}}</van-button>
                <div class="order-detail-title ">
                    <span>当前积分:<b>{{consumerScore}}</b></span><span>消费券余额:<b>{{consumerCoupon}}</b></span>
                </div>
                <div class="order-detail-menu">
                    <span>支付现金：</span><span>￥{{userOrderInfo.pay_money}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>支付消费卷：</span><span style="color:#FF3333">￥{{userOrderInfo.consumer_money}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>付款商家：</span><span>{{userOrderInfo.shop_name}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>交易时间：</span><span>{{userOrderInfo.created_time}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>交易方式：</span><span>{{userOrderInfo.pay_type}}</span>
                </div>
                <div class="order-bottom-btn">
                   <van-button type="default" @click="finishedPay">完成</van-button>
                </div>
               
            </div>
        </div>
    </div>
    <van-popup v-model="redPacketshow">
      <div class="return-redpacket-box">
        <div class="return-profit animated" :class="{wobble:isActive}" @click="getProfit">
          <!-- <transition enter-active-class="animated swing" leave-active-class="animated swing"> -->
            <img src="../../assets/images/return-repacket.png"   alt="">
          <!-- </transition> -->
          <div class="profit-btn "   >
            <span>领取</span>
          </div>
        </div>
       
        <div class="profit-close" @click="closePat">
          <img src="../../assets/images/profit-close.png" alt="">
        </div>
      </div>

    </van-popup>

    <van-popup v-model="redPacket">
      <div class="redpacket-body">
        <div class="redpacket-title">
          <span>获得红包</span>
        </div>
        <div class="redpacket-logo">
          <img src="../../assets/images/lz-reg-logo.png" alt>
        </div>
        <div class="repacket-desc">
          <span>恭喜您，获得利达众</span>
          <span>
            返还红包
            <i>￥{{consumerCouponReward}}</i>
          </span>
          <span>可直接抵用现金</span>
        </div>
        <div class="packet-close" @click="closeRedPacket">
          <img src="../../assets/images/close.png" alt>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import memnavbar from "../../components/memnavbar"
import animate from 'animate.css'
 Vue.use(animate)
export default {
  name: "orderList",
  data() {
    return {
        title:"支付详情",
        redPacketshow:false,
        redPacket:false,
        isActive:false,
        isShow:true,
        orderNo:'',//已经下单的订单号
        token:"",
        consumerScoreReward:"",//返还的积分奖励
        consumerCouponReward:"",//消费券奖励
        consumerScore:"",//本金
        consumerCoupon:"",//消费券
        uid:"",
        userOrderInfo:{
          order_money:"",//订单金额
          pay_money:"",//付的钱
          consumer_money:"",//消费券
          shop_name:"",//店铺名称
          data_src:"",//1就是微信 2就是支付宝
          created_time:"",//支付时间
        },
    };
  },
  mounted() {
   
    var ua = navigator.userAgent.toLowerCase();
    var result = /micromessenger/.test(ua) ? true : false;
    if(result){
      this.orderNo = location.href.split("?")[1].split("=")[1];
      // alert("微信订单号1："+this.orderNo )
    }else{
      let lStr = location.href.split("?")[1];
      let pStr =lStr.split("=")[1];
      let oStr =pStr.split("&")[0];

      // this.orderNo = this.getParams("orderNo");
      this.orderNo = oStr;
      // alert("支付宝订单号2："+this.orderNo )
    }
    
  
    this.token = sessionStorage.getItem("redisTokenKey");
    this.uid = localStorage.getItem("id");
    this.autoLogin();
  },
  methods: {
    //获取订单详情
    getOrderInfo(){
    //  alert("step3");
    //  alert("sessin token"+sessionStorage.getItem("redisTokenKey"));
     this.token = sessionStorage.getItem("redisTokenKey");
      let params = {
        orderNo:this.orderNo
      }
      this.$http.post("/newLzshApi/order/userOrderInfoByOrderNo","data=" + JSON.stringify(params),{
        headers: {
          token: this.token
        }    
      }).then(res=>{
        if(res.code == '121'){
          // alert("code 121");
          // this.autoLogin();
        }else{
            // alert("step4");
            // alert("消费券奖励"+res.data.consumerCoupon);
          this.consumerScoreReward = res.data.consumerScoreReward;
          if( res.data.consumerCouponReward == "" || res.data.consumerCouponReward == null){
              this.consumerCouponReward = 0;
              this.redPacketshow = false;
          }else{
             this.consumerCouponReward = res.data.consumerCouponReward;
             this.redPacketshow = true;
          }
         
          if( res.data.consumerScore == "" || res.data.consumerScore == null){
            this.consumerScore = 0;
          }else{
            this.consumerScore = res.data.consumerScore;
          }

          if(res.data.consumerCoupon == "" || res.data.consumerCoupon == null || res.data.consumerCoupon == "0"){
            this.consumerCoupon = 0;
           
          }else{
            this.consumerCoupon = res.data.consumerCoupon;
            
          }
          
          this.userOrderInfo = res.data.userOrderInfo;
        }
        
      })
    },
    getProfit(){
      this.isActive = true;
      let params = {
        uid:this.uid,
        billNo:this.orderNo
      }
      this.$http.post("/newLzshApi/coupon/receiveCoupon","data=" + JSON.stringify(params)).then(res=>{
        setTimeout(()=>{
          this.redPacketshow =  false;
          this.redPacket = true;
        },2000)
      })
      

     
    },
    closePat(){
      this.redPacketshow =  false;
        
    },

    closeRedPacket(){
      this.redPacket = false;

    },
    finishedPay(){
      sessionStorage.setItem("recommendCode", "");//使用完recommendCode 就删除
      this.$router.push({path:"/home"});
    },
    //自动登录
    autoLogin(){
      // alert("uid:"+this.uid);
      let params ={
        uid:this.uid+""
      };
        this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params),
          
        ).then(res=>{
          if(res.code == "150"){
            this.$toast("用户不存在");
          }
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;

           this.getOrderInfo();
        })
    }
  },
  components: {
    memnavbar
  }
};
</script>
<style scoped>
body {
  background: #efefef;
}
.order-detail-body{
  position: relative;
  overflow: hidden;
}
.redpacket-body {
  position: relative;

  width: 6.6rem;
  height: auto;

  color: #fff;
}
.redpacket-title {
  height: 3.56rem;
  width: 100%;
  background: url("../../assets/images/redpacket-bg.png") no-repeat;
  background-size: cover;
  font-size: 0.63rem;
  position: relative;
  text-align: center;
}
.redpacket-title span {
  display: block;
  position: relative;
  top: 0.8rem;
}
.redpacket-logo {
  width: 2.67rem;
  height: 2.67rem;
  border-radius: 50%;
  margin: auto;
  background: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.redpacket-logo img {
  width: 1.52rem;

  display: block;
  height: 1.26rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.repacket-desc {
  padding-top: 1.34rem;
  position: relative;
  color: #444;
  font-size: 0.33rem;
  background: #fff;
}
.repacket-desc span {
  display: block;
  width: 100%;
  line-height: 0.48rem;
}
.repacket-desc span i {
  font-style: normal;
  color: #fe443a;
}
.repacket-desc span:last-child {
  margin-top: 0.53rem;
  padding-bottom: 1.5rem;
}
.packet-close {
  position: absolute;
  top: 0;
  right: 0;
  background: #dd362f;
  width: 0.52rem;
  height: 0.52rem;
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.packet-close img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.van-popup {
  overflow: visible;
}
/* 弹出层end */



.active{

  position: relative;

}
.order_list {
  color: #333;
  position: relative;
  overflow: hidden;
}
.order-detail-body{
   
}
.order-new-container{
    
}
.order-detail-main{
    width:100%;
    height: auto;
    
    background: #fff;
    margin-top:0.97rem;
    border-radius: 0.07rem;
    padding-bottom: 0.5rem;
}
.order-detail-pic{
    position: relative;
  
}
.order-detail-pic img{
    width:1.73rem;
    height: 1.73rem;
    display: block;
    position:absolute;
    left: 50%;
    margin:auto;
    border-radius: 50%;
    transform: translate(-50%,-50%);
}
.order-detail-pic span{
    display: block;
    text-align: center;
    color:#FE443A;
    font-size: 0.54rem;
    padding-top:1.4rem;
}
.order-detail-title{
   
    height: 0.9rem;
    margin:0 auto 0.3rem;
    line-height: 0.9rem;
    background: #F7F7F7;
    color:#666;
    font-size: 0.25rem;
    padding:0 0.2rem;
}
.order-detail-title span:nth-child(1){
    display: block;
    float: left;
}
.order-detail-title span:nth-child(2){
    display: block;
    float: right;
}
.order-detail-content{
    position: relative;
    margin:0 0.20rem;
    background: #fff;
    top:0.35rem;
}
.order-detail-menu{
    position: relative;
    color:#666;
    font-size:0.25rem;
    overflow: hidden;
    margin-bottom: 0.20rem;
    padding:0 0.2rem;
}
.order-detail-menu span:nth-child(1){
   display: block;
    float: left; 
}
.order-detail-menu span:nth-child(2){
   display: block;
    float: right; 
    color:#333333;
}
.order-counpon-money span:nth-child(1){
    padding-top:0.6rem;
}
.order-counpon-money span:nth-child(2){
    padding-top:0.2rem;
}
.order-counpon-money img{
    position: absolute;
    width:1.71rem;
    height: 1.71rem;
    border-radius: 50%;
    overflow: hidden;
    top:0.2rem;
   
    right: 0.2rem;
    transform: none;
}
.order-new-header{
    position: absolute;
    width: 140%;
    height: 4.69rem;
    left: 50%;
    border-bottom: 0.03rem solid #FFB91C;
    transform: translateX(-50%);
    overflow: hidden;
    background: #FF3333;
    border-bottom-right-radius: 100%;
    border-bottom-left-radius: 100%;
}
.order-new-check {
    padding-top:0.43rem;
}
.order-new-check img{
    width:0.94rem;
    height: 0.94rem;
    display: block;
    margin:auto;
}
.order-new-check span{
    color:#FF3333;
    font-size: 0.35rem;
}
.order-new-number{
    color:#FF3333;
    font-size: 0.78rem;
}
.order-detail-new{
  
}
.order-new-bot-img{
   
}
.order-new-bot-img img:nth-child(1){
    width:0.33rem;
    height: 0.26rem;
    display: block;
    position: absolute;
    bottom:11%;
    left: 23%;
}
.order-new-bot-img img:nth-child(2){
    width:0.35rem;
    height: 0.30rem;
    display: block;
    position: absolute;
    bottom:11%;
    right: 23%;
}
.van-button--plain.van-button--primary{
  height: 0.4rem;
  line-height: 0.4rem;
  color:#FFB91C;
  border:1px solid #FFB91C;
  border-radius: 0.2rem;
  font-size: 0.21rem;
      display: block;
    margin:0.26rem auto 0.8rem;
}
.van-button--default{
  width:3.47rem;
  height: 0.83rem;
  line-height: 0.83rem;
  background: #FF3333;
  color:#FEFEFE;
  border-radius: 0.1rem;
  font-size: 0.29rem;
  margin-top:1rem;
}
.order-bottom-btn{
  position: relative;
  overflow: hidden;
  padding-bottom:0.3rem;
}
.return-redpacket-box{

}
.van-popup{
  background: none;
}
.return-profit{
  position: relative;
}
.return-profit img{
  width: 5.9rem;
  height: auto;
}
.profit-btn{
  width: 1.86rem;
  height: 1.86rem;
  line-height: 1.86rem;
  margin:auto;
  border-radius: 50%;
  background: #FFBD29;
  color:#fff;
  font-size: 0.56rem;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
.profit-close img{
  width:0.76rem;
  height: 0.76rem;
}
</style>