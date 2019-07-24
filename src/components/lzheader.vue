<template>
  <div class="header">
    <div class="header_left">
      <router-link to="recommend">
        <img src="../assets/images/erweima.png" alt>
        <span>推荐码</span>
      </router-link>
    </div>
    <div class="header_title">
      <van-search placeholder="请输入搜索关键词" v-model="value" />
    </div>
    <div class="header_right">
      <!-- <a href="http://sao315.com/w/api/saoyisao" @click="getWxScan()"> -->
      <a href="javascript:void(0)" @click="getWxScan">
        <img src="../assets/images/scan.png" alt>
        <span>扫一扫</span>
      </a>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import md5 from "js-md5";
export default {
  name: "lzheader",
  data() {
    return {
      value:"",
      domain:"",
      picUrlRelative:"",
      appId:"",
    };
  },
  created() {

    this.getWxConfig();
  },
  mounted() {
    //    this.getWxConfig();
    // this.getWxScan();
  },
  methods: {
  
     
   
    // 获取微信验签配置
    getWxConfig() {
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res => {
      let arr = res.data.webSystemParameterConfigList;
        arr.forEach(item => {
          if (item.parameter_key == "DOMAIN") {
            this.domain = item.parameter_value;
          } else if (item.parameter_key == "WEB_IMG_PATH") {
            this.picUrlRelative = item.parameter_value;
          } else if (item.parameter_key == "WEB_WX_APPID") {
            this.appId = item.parameter_value;
          }
        });
        this.picUrl = this.domain + this.picUrlRelative;
        let curUrl = window.location.href;
        let pageUrl = escape(window.location.href.split("#")[0]);
        console.log(pageUrl);
        this.$http
          .post("/newLzshApi/weixin/getSign", "data={'url':'" + pageUrl + "'}")
          .then(res => {
            console.log(res);
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: this.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.signature, // 必填，签名，见附录1
              jsApiList: ["scanQRCode", "barCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          });



      })
      
    },
    //调起扫一扫
    getWxScan() {
      const _this = this;
      var ua = navigator.userAgent.toLowerCase();
      var result = /micromessenger/.test(ua) ? true : false;
      if (result) {
        //微信扫一扫
        wx.ready(function() {
          wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function(res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              console.log(result);
              // _this.$router.push({ path: "/home" });
            }
          });
        });
      } else {
        //支付宝扫一扫
        window.AlipayJSBridge.call(
          "scan",
          {
            type: "qr", // 扫描类型  qr 二维码  / bar 条形码
            actionType: "scanAndRoute" // 如果只是扫码,拿到码中的内容，这项不用设置都可以
          },
          function(result) {
            // alert(JSON.stringify(result));
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.van-search{padding:0;    }
.van-search__content{
  background: #fff;
  border-radius: 0.17rem;
}
.van-search .van-cell{
  padding:0 10px 0 0;
}

</style>
