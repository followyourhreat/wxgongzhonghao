<template>
  <div class="payment-body">
    <van-nav-bar
    title="待支付订单"
  
   
    left-arrow
    @click-left="handleReset"
   
  />
    <div class="payment-container">
      <div class="payment-card">
        <div class="payment-header">
          <div class="payment-mall-info">
            <img :src="shopPic" alt :onerror="defaultImg">
            <span>{{shopName}}</span>
          </div>
        </div>
        <div class="amount-count">
          <span>订单金额：</span>
          <input
            type="text"
            class="count-input"
            v-model="orderPrice"
            placeholder="请输入金额"
           
            disabled
          >
        </div>
      </div>
      <div class="payment-counpon-body">
        <div class="csmcounpon-title">
          <img src="../../assets/images/counpon.png" alt>
          <span>消费券</span>
        </div>
        <input type="text" placeholder="可使用￥25" disabled v-model="csmCounpon" >
      </div>
      <!-- <van-button type="primary" @click="testPay">支付宝测试</van-button> -->
    </div>

    <van-submit-bar :price="orderTotal" button-text="提交订单" @submit="handleSubmit">
      <span class="sub-counpon">已优惠￥{{csmCounpon}}</span>
    </van-submit-bar>
   



  </div>
</template>
<script>

export default {
  data() {
    return {
      uid: "",
      title: "提交订单",
      csmCounpon: "", //消费券
      checked: false,
      orderPrice: "", //订单金额
      openId: "", //openid
      shopId: "", //店铺id  先设置一个shopid测试功能
      orderId: 0, //订单号
      clientType: 0, //0 是微信支付 ，1是支付宝支付
      shopName: "利达众餐厅（南湖店)",
      shopPic: "",
      defaultImg: 'this.src="' + require("../../assets/images/food1.png") + '"',
      isLogin: true,
      canClick: false,
      orderTotal: 0, //实际支付金额
      token:"",
      waitingOrderShow:false,
      orderInfo:{
     
      },
      userOrderInfo:[],
      order_no:"",//待支付订单号
      domain:"",
      picUrlRelative:"",
      appId:"",
      picUrl:"",
    };
  },
  components: {
   
  },
  beforeCreate(){
    let cUrl = window.location;
    let targetUrl = cUrl.origin + cUrl.pathname+cUrl.hash;
    if(cUrl.search !== undefined || cUrl.search.indexOf("code") >0){
        window.location.href = targetUrl;
    }
  },
  created(){
    this.commonSystemInfo();
  },
  mounted() {
    console.log("查看本地的openid");
    console.log(localStorage.getItem("open_id"));
    this.openId = localStorage.getItem("open_id");
    let Uid = localStorage.getItem("id");
    // this.getShopInfo();
    //线上测试开启 看是否登录
    if(Uid){
        this.uid = Uid;
    }else{
      this.uid = 2;
    }
    if( sessionStorage.getItem("redisTokenKey") !==  undefined){
      this.token = sessionStorage.getItem("redisTokenKey");
      console.log(this.token);
    }
    this.getWaitingOrder()
  },
  methods: {
   
    //获取openid
    getOpenId() {
      if (this.openId == null || this.openId === "") {
        this.$toast("下单支付需要您授权登录");
        this.$router.push({ path: "/home" });
      } else {
        this.openId = localStorage.getItem("openid");
        this.isLogin = true;
      }
    },
    //更改订单金额
    // changeOrderPrice() {
   
    //   if(this.orderPrice == ""){
    //       console.log("12312");
    //       this.orderTotal = 0;
    //   }else{
    //     this.orderTotal = 100 * (Number(this.orderPrice).toFixed(2) - this.csmCounpon);
    //     console.log(this.orderTotal);
    //   }
      
    // },
    // //监听输入的订单金额
    // handleInput(){
    //   console.log("123");
    //   if(this.orderPrice == ""){
    //       console.log("12312");
    //       this.orderTotal = 0;
    //   }else{
    //     this.orderTotal = 100 * (Number(this.orderPrice).toFixed(2) - this.csmCounpon);
        
    //   }
    // },
    // //更改消费券金额
    // changeCsmCounpon() {
    //   console.log("66666");
    //   this.orderTotal = 100 * (Number(this.orderPrice).toFixed(2) - this.csmCounpon);
    //   console.log(this.orderTotal);
    // },
    handleSubmit() {
      //判断是否登录
      if (this.isLogin) {
        console.log("提交订单 下单");
        if (this.orderPrice == "") {
          this.$toast("请输入金额");
          return;
        }
        var ua = navigator.userAgent.toLowerCase();
        var result = /micromessenger/.test(ua) ? true : false;
        if (result) {
          console.log("你正在访问微信浏览器");
          let params = {
            uid: this.uid + "",
            shopId: this.shopId + "",
            openId: this.openId + "",
            payType: "3",
            consumerCoupon: this.csmCounpon + "",
            orderPrice: this.orderPrice + "",
            dataSrc: "1",
            orderResubmit:"0",
            orderNo:this.order_no
          };
          this.$http
            .post(
              "/newLzshApi/order/offLinePay",
              "data=" + JSON.stringify(params),
              {
                headers:{
                  'token':this.token
                }
              }
            )
            .then(res => {
              //拉取微信支付  开始
             
              if( res.code == "121"){ 
                 //如果未登录  token失效
                this.autoLogin()
              }else{
                let wxres = res.data;          
                this.wxPay(wxres,this);
              }
              
            })
            .catch(error=>{
              alert(error);
            })
       
        } else {
          console.log("你访问的不是微信浏览器");
          console.log(this);
          let params = {
            uid: this.uid + "",
            shopId: this.shopId + "",
            openId: this.openId + "",
            payType: "4",
            consumerCoupon: this.csmCounpon + "",
            orderPrice: this.orderPrice + "",
            dataSrc: "2",
            orderResubmit:"0",
            orderNo:this.order_no
          };
          this.$http
            .post(
              "/newLzshApi/order/offLinePay",
              "data=" + JSON.stringify(params),
              {
                headers:{
                  'token':this.token
                }
              }
            )
            .then(res => {
              if(res.code == "121"){
                   //如果未登录  token失效
                this.autoLogin();
              }else{
                //拉取支付宝支付
                this.orderInfo = res.data;
                //网页链接支付
                let orderStr = res.data.returnPayMap.responseStr;
                window.location.href = "https://openapi.alipay.com/gateway.do?"+orderStr;
              }
              
              
            });
        }
      }
    },
      wxPay(result,self){
        function onBridgeReady() {
          WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                  "appId": result.wxPayResultMap.appId,   //公众号名称，由商户传入
                  "timeStamp": result.wxPayResultMap.timeStamp,         //时间戳，自1970年以来的秒数
                  "nonceStr": result.wxPayResultMap.nonceStr, //随机串
                  "package": result.wxPayResultMap.package,
                  "signType": result.wxPayResultMap.signType,         //微信签名方式：
                  "paySign": result.wxPayResultMap.paySign //微信签名
              
              },
              function (res) {
                  alert(res.err_msg);
                  if (res.err_msg === "get_brand_wcpay_request:ok") {
                    alert("支付成功")
                    self.$router.push({ path: "/payResult" });
                  } else {
                    
                     alert("支付失败");
                  }
              });
          }

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener
            ) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
      },
   
    //取消订单
    handleReset() {
      
      let params = {
        orderNo: this.order_no + ""
      };
      this.$http
        .post(
          "/newLzshApi/order/userCancelOrder",
          "data=" + JSON.stringify(params),
          {
            headers: {
              token: this.token
            }
          }
        )
        .then(res => {
          // this.userOrderInfo = res.data.userOrderInfo;
          this.getWaitingOrder();
          this.$router.go(-1);
          this.$toast("取消订单成功");
      
        });



    },
 
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    //处理当前页面的code
    queryCurUrl(){
      
      
     
    },
    //支付自动登录
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
          
          this.getWaitingOrder();
         
        })
    },
    //获取待支付订单
    getWaitingOrder(){
      this.token = sessionStorage.getItem("redisTokenKey");
      let params ={
          uid:this.uid+""
        };
        this.$http.post( "/newLzshApi/order/getUnpaidUserOrderInfoByUid", "data=" + JSON.stringify(params),{
          headers:{
              'token':this.token
            }
        } ).then(res=>{
            if(res.code == "121"){
              this.autoLogin();
            }else{
              // alert("消费券："+res.data.userOrderInfo[0].consumer_money);
              this.userOrderInfo = res.data.userOrderInfo;
              this.orderPrice = res.data.userOrderInfo[0].order_money;
              this.csmCounpon = res.data.userOrderInfo[0].consumer_money;
              this.shopPic =this.picUrl +res.data.userOrderInfo[0].shop_cover;
              this.shopName = res.data.userOrderInfo[0].shop_name;
              this.order_no = res.data.userOrderInfo[0].order_no;
              this.shopId = res.data.userOrderInfo[0].shop_id;
              // this.changeOrderPrice(); 
            }
        
          
        })
        
    },
    
    //查看待支付订单
    viewDetail(){
      this.waitingOrderShow = false;
      
    },

    onClickRight(){

    }
  }
};
</script>
<style scoped>
body {
  background: #efefef;
}
.payment-header {
  padding: 0.2rem 0.2rem;
  position: relative;
}
.payment-mall-info {
  transform: translateY(-20%);
}
.payment-mall-info img {
  width: 1.83rem;
  height: 1.83rem;
  border-radius: 50%;
}
.payment-mall-info span {
  display: block;
  color: #333;
  font-size: 0.35rem;
}
.payment-brand {
  display: flex;
  align-content: center;
  float: right;
  font-size: 0.3rem;
}
.payment-brand span {
  display: block;
  line-height: 0.6rem;
}
.amount-count {
  position: relative;
  transform: translateY(-35%);
}
.amount-count span {
  font-size: 0.28rem;
  color: #666;
}
.count-input {
  width: 2.08rem;
  border: none;
  outline: none;
  line-height: 0.4rem;
  font-size: 0.28rem;
  border-bottom: 0.01rem solid #000;
  text-indent: 0.2rem;
  padding-bottom: 0.1rem;
  background:#fff;
}
.sub-counpon {
  position: relative;
  padding-left: 0.2rem;
  color: #fff;
  font-size: 0.3rem;
  border-right: 0.01rem solid #fff;
  width: 2.54rem;
  text-align: left;
}
.tabbar {
  display: none !important;
}
.van-cell {
  border-bottom: 0.01rem solid #ccc;
}
.van-submit-bar__bar {
  background: #444;
}
.van-submit-bar__text {
  color: #fff;
}
.van-button--danger {
  background: #ffbd29;
  border: none;
  outline: none;
}
.payment-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #efefef;
}
.payment-container {
  width: 100%;
  height: calc(100% - 96px);
  background: #efefef;
  position: relative;
  overflow: hidden;
}
.payment-card {
  position: relative;
  width: 6.81rem;
  margin: 0.7rem auto 0.15rem;
  background: #fff;
  border-radius: 0.07rem;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #ceccd3;
  font-size: 0.29rem;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #ceccd3;
  font-size: 0.29rem;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #ceccd3;
  font-size: 0.29rem;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #ceccd3;
  font-size: 0.29rem;
}
.payment-counpon-body {
  width: 6.81rem;
  margin: 0 auto;

  line-height: 0.77rem;
  background: #fff;
  border-radius: 0.07rem;
  position: relative;
  overflow: hidden;
  padding: 0.17rem 0.24rem 0.17rem 0.33rem;
}
.csmcounpon-title {
  font-size: 0.29rem;
  color: #444;
  display: flex;
  float: left;
  position: relative;
}
.csmcounpon-title img {
  width: 0.45rem;
  height: 0.31rem;
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.csmcounpon-title span {
  margin-left: 0.6rem;
}
.payment-counpon-body input {
  width: 2.17rem;
  height: 0.69rem;
  line-height: 0.69rem;
  text-indent: 0.3rem;
  float: right;
  border: none;
  outline: none;
  border: 0.01rem solid #fe443a;
  font-size: 0.28rem;
    background:#fff; 
}
.van-submit-bar__text {
  display: block;
  width: 2.64rem;
}
.waiting-body{
  position: relative;
  padding:0.3rem 0.88rem 0.65rem;
  border-radius: 0.14rem;
  background: #fff;
  width:5.98rem;
}
.waiting-header img{
  width:1.01rem;
  height: 1.01rem;
  display: block;
  margin:auto;
}
.waiting-content{
  font-size: 0.32rem;
  color:#333;
  overflow: hidden;
  margin:0.5rem auto 0.6rem;
  line-height: 0.42rem;
  text-align: left;
}
.van-popup{
  background: none;
}
.waiting-btn{
  display: flex;
  justify-content: center;
  align-items: center;
}
.waiting-btn button{
  width: 1.81rem;
  height: 0.69rem;
  line-height: 0.69rem;
  text-align: center;
  font-size: 0.31rem;
  border:1px solid #999;
}
.waiting-btn button:nth-child(1){
  margin-right: 0.25rem;
  color:#999;
}
.waiting-btn button:nth-child(2){
  margin-left: 0.25rem;
  color:#FF3333;
}
.van-nav-bar .van-icon{
  color:#FF3333;
}
</style>