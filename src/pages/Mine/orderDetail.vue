<template>
  <div class="order_list">
    <memnavbar :pageTitle="title"></memnavbar>
    <div class="order-detail-body">
        <!-- <div class="order-detail-main">
            <div class="order-detail-pic">
                <img src="../../assets/images/goods.png" alt="">
                <span>￥188</span>
            </div>
            <div class="order-detail-title">
                <span>当前积分:<b>866408</b></span><span>消費卷可抵扣金額:<b>115</b></span>
            </div>
            <div class="order-detail-content">
                <div class="order-detail-menu">
                    <span>支付现金：</span><span>￥0.03</span>
                </div>
                <div class="order-detail-menu">
                    <span>支付消费卷：</span><span>￥45</span>
                </div>
                <div class="order-detail-menu">
                    <span>付款商家：</span><span>王麻子杂货铺</span>
                </div>
                <div class="order-detail-menu">
                    <span>交易时间：</span><span>2019-06-06 10:25</span>
                </div>
                <div class="order-detail-menu">
                    <span>交易方式：</span><span>支付宝支付</span>
                </div>
                <div class="order-detail-menu">
                    <span>获得积分：</span><span>+0.85</span>
                </div>
                <div class="order-detail-menu">
                    <span>获得消费卷：</span><span>+0.85</span>
                </div>
            </div>
        </div> -->
        <div class="order-new-container">
            <div class="order-new-header">
                <div class="order-new-check">
                    <img src="../../assets/images/pay-success.png" alt="">
                    <span>支付成功</span>
                </div>
                <div class="order-new-number">
                    ￥{{userOrderInfo.order_money}}
                </div>
                <div class="order-new-bot-img">
                    <img src="../../assets/images/golden-stone.png" alt="">
                    <img src="../../assets/images/golden-cash.png" alt="">
                </div>
            </div>
            
            <div class="order-detail-content order-detail-new">
                <div class="order-detail-title ">
                    <span>当前积分:<b>{{consumerScore}}</b></span><span>消費卷可抵扣金額:<b>{{consumerCoupon}}</b></span>
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
                    <span>交易方式：</span><span>{{userOrderInfo.data_src}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>获得积分：</span><span style="color:#FF3333">+{{consumerCouponReward}}</span>
                </div>
                <div class="order-detail-menu">
                    <span>获得消费卷：</span><span style="color:#FF3333">+{{consumerCouponReward}}</span>
                </div>
            </div>
        </div>
    </div>
   
  </div>
</template>
<script>
import memnavbar from "../../components/memnavbar";
export default {
  name: "orderList",
  data() {
    return {
        title:"账单详情",
        orderNo:"",
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
      this.uid = localStorage.getItem("id");
      this.autoLogin();
      this.orderNo = this.$route.query.orderNo;
     
  },
  methods: {
    //获取订单详情
    getOrderInfo(){
      let params = {
     
        orderNo:this.orderNo
      }
      this.$http.post("/newLzshApi/order/userOrderInfoByOrderNo","data=" + JSON.stringify(params),{
        headers: {
          token: this.token
        }    
      }).then(res=>{
        if(res.code == '121'){
          this.autoLogin()
        }else{
            if(res.data.consumerScoreReward == "" || res.data.consumerScoreReward == null ){
                this.consumerScoreReward = 0;
            }else{
                this.consumerScoreReward = res.data.consumerScoreReward;
            }
            if( res.data.consumerCouponReward == "" ||  res.data.consumerCouponReward == null){
                this.consumerCouponReward = 0;
            }else{
                this.consumerCouponReward = res.data.consumerCouponReward;
            }

          this.consumerScore = res.data.consumerScore;
          this.userOrderInfo = res.data.userOrderInfo;
          this.consumerCoupon = res.data.consumerCoupon;
        }
        
      })
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
            this.token = res.data.redisTokenKey;
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
    margin:0.5rem auto 0.3rem;
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
       margin:0 0.48rem;
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
    background: #F35543;
    border-bottom-right-radius: 100%;
    border-bottom-left-radius: 100%;
}
.order-new-check {
    padding-top:0.43rem;
}
.order-new-check img{
    width:0.97rem;
    height: 0.97rem;
    display: block;
    margin:auto;
    display: none;
}
.order-new-check span{
    color:#FFE2B1;
    font-size: 0.35rem;
}
.order-new-number{
    color:#FFE2B1;
    font-size: 0.78rem;
}
.order-detail-new{
    padding-top:4.69rem;
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
</style>

