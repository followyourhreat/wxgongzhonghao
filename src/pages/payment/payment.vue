<template>
  <div class="payment-body">
    <van-nav-bar
      title="提交订单"
      left-text
      right-text
      left-arrow
      @click-left="onClickLeft"
     
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
            type="number"
            class="count-input"
            v-model="orderPrice"
            placeholder="请输入金额"
            @blur="changeOrderPrice"
            @input="enterOrderPrice"
          >
        </div>
      </div>
      <div class="payment-counpon-body">
        <div class="csmcounpon-title">
          <img src="../../assets/images/counpon.png" alt>
          <span>消费券</span>
        </div>
        <input
          type="number"
          :placeholder="placeWord"
          v-model="csmCounpon"
          @blur="changeCsmCounpon"
          @input="handleInput"
        >
      </div>
      <!-- <van-button type="primary" @click="testPay">支付宝测试</van-button> -->
    </div>
    
    <van-submit-bar :price="orderTotal" button-text="提交订单" label="实付：" @submit="handleSubmit">
      <span class="sub-counpon">已优惠￥{{csmCounpon}}</span>
    </van-submit-bar>
    <van-popup v-model="waitingOrderShow" :close-on-click-overlay="false">
      <div class="waiting-body">
        <div class="waiting-header">
          <img src="../../assets/images/waiting-pay.png" alt>
        </div>
        <div class="waiting-content">您有一笔未完成的订单，可以 选择查看或取消。</div>
        <div class="waiting-btn">
          <van-button plain type="primary" @click="handleReset">取消</van-button>
          <van-button plain type="primary" @click="viewDetail">查看</van-button>
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
      uid: "",
      // uid: "186",
      title: "提交订单",
      csmCounpon: "", //消费券
      placeWord:"",//文本提示语
      checked: false,
      orderPrice: "", //订单金额
      openId: "", //openid
      shopId: "106", //店铺id  先设置一个shopid测试功能
      orderId: 0, //订单号
      clientType: 0, //0 是微信支付 ，1是支付宝支付
      shopName: "利达众餐厅",
      shopPic: "",
      defaultImg: 'this.src="' + require("../../assets/images/food1.png") + '"',
      isLogin: true,
      canClick: false,
      orderTotal: 0, //实际支付金额
      token: "",
      waitingOrderShow: false,
      orderInfo: {},//支付宝存的订单信息
      userOrderInfo:{},//待支付订单的信息
      order_no:"",//待支付订单号
      domain:"",//域名
      picUrlRelative:"",//图片文件夹
      picUrl:"",
      couponMoney:"",//可用消费券
      recommendCode:"",//推荐码
    };
  },
  components: {
    Memnavbar
  },
  beforeCreate() {
    let cUrl = window.location;
    let targetUrl = cUrl.origin + cUrl.pathname + cUrl.hash;
    if (cUrl.search !== undefined || cUrl.search.indexOf("code") > 0) {
      window.location.href = targetUrl;
    }
  },
  created(){
     this.commonSystemInfo();
  },
  mounted() {
     
      if(location.href.indexOf("shopId")>0){
        this.shopId = this.getParams("shopId");//获取店铺id

        sessionStorage.setItem("shopId",this.shopId);
        this.$store.dispatch("setShopIdAction", this.shopId);
      }else{
        this.shopId = sessionStorage.getItem("shopId");
      }
      this.getShopInfo();
   
      if( localStorage.getItem("id") == undefined ){
      //  alert("id2:"+localStorage.getItem("id"));
        this.$router.push({path:"/home"});
      }else{
        // alert("用户已经登录!");
        //已登录用户的支付流程
        this.uid = localStorage.getItem("id");
        this.openId = localStorage.getItem("open_id");
        console.log(this.openId);  
        this.token = sessionStorage.getItem("redisTokenKey");
        this.autoLogin();
        
      } 
    

  
    
  },
  methods: {
    //获取参数
    getParams(name){
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
 
    //获取店铺信息
    getShopInfo() {
      this.$http
        .post(
          "newLzshApi/shopInfo/getShopInfoByShopId",
          "data={'shopId':'" + this.shopId + "'}"
        )
        .then(response => {
          let shopRes = JSON.parse(JSON.stringify(response.data));
       
          if (response.code == "200") {
            this.shopName = shopRes.name;
            this.shopPic = this.picUrl+"/"+shopRes.cover;
            this.recommendCode = response.data.recommendCode;
            sessionStorage.setItem("recommendCode",this.recommendCode);
          } else if(response.msg == "店铺信息不存在") {
            this.$toast("店铺信息不存在");
          }else{
            console.log(shopRes.msg);
            
          }
        });
    },
    //获取可用消费券
   getUserCounpon() {
      let params = {
        uid: this.uid
      };
      this.$http
        .post(
          "/newLzshApi/coupon/getUserCouponInfo",
          "data=" + JSON.stringify(params),
          {
            headers: {
              token: this.token
            }
          }
        )
        .then(res => {
          // alert("消费券res.code:"+res.code);
          if (res.code == "121") {
            // alert("getUserCounpon 121");
            
            this.autoLogin();

          } else { 
            // alert("消费券余额：" + res.data.couponMoney);
            this.couponMoney = res.data.couponMoney;
            this.placeWord = "可用消费券￥"+res.data.couponMoney;
          }
        });
    },
    //更改订单金额
    enterOrderPrice() {
   
        if( 100 * (Number(this.orderPrice).toFixed(2) - Number(this.csmCounpon).toFixed(2))<0){
          this.orderTotal = 0;
        }else{
          this.orderTotal =
          100 * (Number(this.orderPrice).toFixed(2) - Number(this.csmCounpon).toFixed(2));
        }
        
        console.log(this.orderTotal);
      
    },
    //监听订单金额
    changeOrderPrice(){
     if(this.orderPrice == ""){
       this.$toast("订单金额不能为空");
     }
    },
    //监听输入的消费券
    handleInput() {
      console.log("123");
      if (this.orderPrice == "") {
        console.log("12312");
        this.$toast("订单金额不能为空");
        // this.orderTotal = 0;
      } else {
        if( 100 * (Number(this.orderPrice).toFixed(2) - Number(this.csmCounpon).toFixed(2))<0){
          this.orderTotal = 0;
        }else{
          this.orderTotal =
          100 * (Number(this.orderPrice).toFixed(2) - Number(this.csmCounpon).toFixed(2));
        }
       
      }
    },
    //更改消费券金额
    changeCsmCounpon() {
        if(this.couponMoney < this.csmCounpon){
          this.csmCounpon = this.couponMoney;
          this.$toast("消费券余额不足");  
          return;
        }
     
       
      console.log(this.orderTotal);
    },
    handleSubmit() {
      //判断是否登录
      this.openId = localStorage.getItem("open_id");
       if (this.orderPrice == "") {
          this.orderPrice = 0;
          this.$toast("请输入金额");
          return;
        }
        if(this.orderPrice == 0){
          this.$toast("请输入大于0的订单金额");
          return;
        }
      
        if(this.csmCounpon<0 ){
          this.$toast("消费券不能小于零");
          this.csmCounpon = 0;
          return;
        }

        if(this.csmCounpon == ""){
            this.csmCounpon = 0;
        }
        if(Number(this.csmCounpon) > Number(this.orderPrice)){
          // alert("消费券："+this.csmCounpon);
          // alert("订单金额："+this.orderPrice);
          this.csmCounpon = this.orderPrice;
          return;
        }
   
        //全是消费券消费的支付
        if(Number(this.csmCounpon) >= Number(this.orderPrice) ){
          
     
          // alert("消费券支付:"+this.csmCounpon);
           var ua = navigator.userAgent.toLowerCase();
            var result = /micromessenger/.test(ua) ? true : false;
            let dtSrc="";
            if(result){
              dtSrc="1";
            }else{
              dtSrc="2";
            }
          let params = {
              uid: this.uid + "",
              // uid:  "148",
              shopId: this.shopId + "",
              openId: this.openId + "",
              // openId:  "oDVaU007_qMQsuCR4igoCNDSINIw",
              payType: "3",
              consumerCoupon: this.csmCounpon + "",
              orderPrice: this.orderPrice + "",
              dataSrc: dtSrc
            };
          // alert("提交:"+JSON.stringify(params));
            this.$http
              .post(
                "/newLzshApi/order/offLinePay",
                "data=" + JSON.stringify(params),
                {
                  headers: {
                    token: this.token
                  }
                }
              )
              .then(res => {
               
                this.orderNo = res.data.orderNo;
                if (res.code == "121") {
                  //如果未登录  token失效
                  let params = {
                    uid: this.uid + ""
                    // uid:  "145"
                  };
                  this.$http
                    .post(
                      "/newLzshApi/userInfo/userAutoLoginByUid",
                      "data=" + JSON.stringify(params)
                    )
                    .then(res => {
                      if(res.code == "150"){
                        // this.getShopId();
                        localStorage.clear();
                        this.$router.push({path:"/home"});
                      }
                      sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);
                      localStorage.setItem("open_id", res.data.openId);
                      let params = {
                        uid: this.uid + "",
                        // uid:  "148",
                        shopId: this.shopId + "",
                        openId: this.openId + "",
                        payType: "3",
                        consumerCoupon: this.csmCounpon + "",
                        orderPrice: this.orderPrice + "",
                        dataSrc: "1"
                      };
                    // alert("调教2:"+JSON.stringify(params));
                      this.$http
                        .post(
                          "/newLzshApi/order/offLinePay",
                          "data=" + JSON.stringify(params),
                          {
                            headers: {
                              token: this.token
                            }
                          }
                        ).then(res=>{
                          if(res.code == "200"){
                            let orderNo = res.data.orderNo;
                            
                            sessionStorage.setItem("shopId","0");//用完shopId就清0;
                            sessionStorage.setItem("recommendCode","");//支付前清除推荐码信息
                            this.$router.push({ path: "/payResult",
                              query:{order_no: orderNo}
                            });
                          }else{
                             alert(res.msg);
                          }

                        })

                    });
               
                }else if(res.code == "252"){
                  this.$toast("消费券不足");
                  return;
                } else if(res.code == "200"){
                  sessionStorage.setItem("shopId","0");//用完shopId就清0;
                  sessionStorage.setItem("recommendCode","");//支付前清除推荐码信息
                  this.$router.push({ path: "/payResult",
                    query:{order_no:this.orderNo}
                  });
                }else{
                  alert(res.msg);
                }
              })
        }else{
          // alert("正常支付："+this.csmCounpon);
          var ua = navigator.userAgent.toLowerCase();
          var result = /micromessenger/.test(ua) ? true : false;
          
          if (result) {
            console.log("你正在访问微信浏览器");
            let params = {
              uid: this.uid + "",
              // uid:  "148",
              shopId: this.shopId + "",
              openId: this.openId + "",
              payType: "3",
              consumerCoupon: this.csmCounpon + "",
              orderPrice: this.orderPrice + "",
              dataSrc: "1"
            };
            // alert("提交3:"+JSON.stringify(params));
            this.$http
              .post(
                "/newLzshApi/order/offLinePay",
                "data=" + JSON.stringify(params),
                {
                  headers: {
                    token: this.token
                  }
                }
              )
              .then(res => {
                //拉取微信支付  开始
                this.orderNo = res.data.orderNo;
                // alert("res.code:"+res.code);
                if (res.code == "121") {
                  //如果未登录  token失效
                  this.autoLogin();
                } else if(res.code == "200") {
                  sessionStorage.setItem("shopId","0");//用完shopId就清0;
                  let wxres = res.data;
                  this.wxPay(wxres, this);
                }else{
                  alert(res.msg);
                }
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
              dataSrc: "2"
            };
            // alert("提交4:"+JSON.stringify(params));
            this.$http
              .post(
                "/newLzshApi/order/offLinePay",
                "data=" + JSON.stringify(params),
                {
                  headers: {
                    token: this.token
                  }
                }
              )
              .then(res => {
                if (res.code == "121") {
                  // alert("支付宝提交121");
                  //如果未登录  token失效
                  this.autoLogin();
                } else if(res.code == "200"){
                  sessionStorage.setItem("shopId","0");//用完shopId就清0;
                  //拉取支付宝支付
                  this.orderInfo = res.data;
                  //网页链接支付
                  sessionStorage.setItem("recommendCode","");//支付前清除推荐码信息
                  let orderStr = res.data.returnPayMap.responseStr;
                  window.location.href =
                  "https://openapi.alipay.com/gateway.do?" + orderStr;
                }else{
                  alert(res.msg);
                }
              });
          }
        }
     
     
        
      
    },
    wxPay(result, self) {
      function onBridgeReady() {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: result.wxPayResultMap.appId, //公众号名称，由商户传入
            timeStamp: result.wxPayResultMap.timeStamp, //时间戳，自1970年以来的秒数
            nonceStr: result.wxPayResultMap.nonceStr, //随机串
            package: result.wxPayResultMap.package,
            signType: result.wxPayResultMap.signType, //微信签名方式：
            paySign: result.wxPayResultMap.paySign //微信签名
          },
          function(res) {
            // this.order_no = result.wxPayResultMap.orderNo
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              // alert("订单号:"+result.wxPayResultMap.orderNo);
              sessionStorage.setItem("recommendCode","");//支付前清除推荐码信息
              self.$router.push({ path: "/payResult",
                query:{order_no:result.wxPayResultMap.orderNo}
              });
            } else if( res.err_msg === "get_brand_wcpay_request:cancel" ) {
                //取消订单
                let params = {
                  orderNo:result.wxPayResultMap.orderNo + ""
                };
                self.$http
                  .post(
                    "/newLzshApi/order/userCancelOrder",
                    "data=" + JSON.stringify(params),
                    {
                      headers: {
                        token: self.token
                      }
                    }
                  )
                  .then(res => {
                    // this.userOrderInfo = res.data.userOrderInfo;
                    self.waitingOrderShow = false;
                    this.getWaitingOrder();
                    self.$toast("取消订单成功");
                  });  
          
              alert("支付取消");
            }else if( res.err_msg === "get_brand_wcpay_request:fail" ){
              //取消订单
                let params = {
                  orderNo:result.wxPayResultMap.orderNo + ""
                };
                self.$http
                  .post(
                    "/newLzshApi/order/userCancelOrder",
                    "data=" + JSON.stringify(params),
                    {
                      headers: {
                        token: self.token
                      }
                    }
                  )
                  .then(res => {
                    // this.userOrderInfo = res.data.userOrderInfo;
                    self.waitingOrderShow = false;
                    this.getWaitingOrder();
                    self.$toast("取消订单成功");
                  });  
              alert("支付取消");
            }
          }
        );
      }

      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },

    aliPay() {
      this.$toast("支付宝支付");
      let params = {
        uid: this.uid + "",
        shopId: this.shopId + "",
        openId: this.openId + "",
        clientType: 1 + "",
        consumerCoupon: this.csmCounpon + "",
        orderPrice: this.orderPrice
      };
      this.$http
        .post(
          "/newLzshApi/order/offLinePayWeb",
          "data=" + JSON.stringify(params),
          {
            headers: {
              token: this.token
            }
          }
        )
        .then(res => {
          console.log(res);
        });
    },

    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    //处理当前页面的code
    queryCurUrl() {},
    //支付自动登录
    autoLogin() {
      let params = {
        uid: this.uid + ""
        // uid:  "148"
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params)
        )
        .then(res => {
          // alert("res.code:"+res.code);
          if(res.code == "150"){
            // this.getShopId();
            // alert("自动登录150,清理localStorage");
            localStorage.clear();
            this.$router.push({path:"/home"});
          }
          
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);
          localStorage.setItem("open_id", res.data.openId);
          this.getUserCounpon();
          this.getWaitingOrder();
          
         
        });
    },
    //获取待支付订单
    getWaitingOrder() {
      this.token = sessionStorage.getItem("redisTokenKey");
      let params = {
        uid: this.uid + ""
      };
      this.$http
        .post(
          "/newLzshApi/order/getUnpaidUserOrderInfoByUid",
          "data=" + JSON.stringify(params),
          {
            headers: {
              token: this.token
            }
          }
        )
        .then(res => {
          if(res.code == "121"){
            // alert("getWaitingOrder code:121");
            this.autoLogin();
            
          }else{
            this.userOrderInfo = res.data.userOrderInfo;
            
            if(res.data.userOrderInfo.length>0){
              this.waitingOrderShow = true;
              this.order_no = res.data.userOrderInfo[0].order_no;
            }else{
              this.waitingOrderShow =false;
            }
            
            console.log(res);
          }
          
        });
    },
    //取消订单
    handleReset() {
     
      let params = {
        orderNo:this.order_no + ""
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
          this.waitingOrderShow = false;
          // this.getWaitingOrder();
          this.$toast("取消订单成功");
          this.getWaitingOrder()
         
      
        });



    },
    //查看待支付订单
    viewDetail() {
      this.waitingOrderShow = false;
      this.$router.push({ path: "/waiting-order" });
    },
    onClickLeft(){
      sessionStorage.setItem("recommendCode", "");//使用完recommendCode 就删除
      this.$router.push({path:"/home"});
    },
   
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
.van-submit-bar{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
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
  z-index: 1;
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
  text-indent: 0.1rem;
  float: right;
  border: none;
  outline: none;
  border: 0.01rem solid #fe443a;
  font-size: 0.28rem;
}
.van-submit-bar__text {
  display: block;
  width: 2.64rem;
}
.waiting-body {
  position: relative;
  padding: 0.3rem 0.88rem 0.65rem;
  border-radius: 0.14rem;
  background: #fff;
  width: 5.98rem;
}
.waiting-header img {
  width: 1.01rem;
  height: 1.01rem;
  display: block;
  margin: auto;
}
.waiting-content {
  font-size: 0.32rem;
  color: #333;
  overflow: hidden;
  margin: 0.5rem auto 0.6rem;
  line-height: 0.42rem;
  text-align: left;
}
.van-popup {
  background: none;
}
.waiting-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.waiting-btn button {
  width: 1.81rem;
  height: 0.69rem;
  line-height: 0.69rem;
  text-align: center;
  font-size: 0.31rem;
  border: 1px solid #999;
}
.waiting-btn button:nth-child(1) {
  margin-right: 0.25rem;
  color: #999;
}
.waiting-btn button:nth-child(2) {
  margin-left: 0.25rem;
  color: #ff3333;
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
input::-webkit-input-placeholder{
    font-size: 0.24rem;
}
input::-moz-placeholder{
  font-size: 0.24rem;
}
input:-ms-input-placeholder{
   font-size: 0.24rem;
}
</style>