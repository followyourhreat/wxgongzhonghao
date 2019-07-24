<template>
  <div class="recommend-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="recommend-bg">
      <div class="recommend-title">
        邀请好友使用利达众
      </div>
      <div class="recommend-ads">

      </div>
      <div class="red-core">
        <div class="recommend-content">
          <span>生活利好 日日有赚</span>
          <span>独享不如分享 </span>
          <span>马上分享</span>
        </div>
        <div class="recommend-erweima">
          <qrcode :value="qrcodeUrl" id="picture" tag="img"  :options="{ size: 120 }"></qrcode>
        </div>
      </div>
      
      <div class="recommend-btn">
        <span>长按二维码保存图片</span>
        <!-- <van-button type="primary" @click="handleShare">点击保存</van-button> -->
      </div>
    </div>
    
  </div>
</template>

<script>
import Memnavbar from "../../components/memnavbar";
import QRcode from '@xkeshi/vue-qrcode'
export default {
  name: "recommend",
  data() {
    return {
      title: "推荐码",
      qrcodeUrl:"",
      uid:"",
    };
  },
  components: {
    Memnavbar,
    qrcode : QRcode
  },
  mounted(){
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
      
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      this.uid = 22;
    }
    this.token = sessionStorage.getItem("redisTokenKey");

    this.getQrcode()
  },
  methods:{
    //获取推荐码链接
    getQrcode(){
      this.token = sessionStorage.getItem("redisTokenKey");
      this.$http.post("/newLzshApi/userInfo/getRecommendShareUrl","data={'uid':'" + this.uid + "'}",{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        if(res.code == "121"){
          this.autoLogin();
        }else{
          if(location.href.indexOf("recommendCode")>0){
            let recUrl = res.data.recomandUrl.split("?")[1]; 
            this.qrcodeUrl = "http://www.lizsh.net/newLzshApi/index.html/#/home?"+recUrl;
            sessionStorage.setItem("recommendCode","");
            let recode = res.data.recomandUrl.split("?")[1].split("=")[1];
            sessionStorage.setItem("recommendCode",recode);
          }else{
            let recUrl = res.data.recomandUrl.split("?")[1]; 
            this.qrcodeUrl = "http://www.lizsh.net/newLzshApi/index.html/#/home?"+recUrl;
          }
          

        }
        
      })
    },
  
    //保存图片
      handlePreserve(){
      //找到canvas标签
        let myCanvas = document.getElementById('picture');
      //创建一个a标签节点
        let a = document.createElement("a")
      //设置a标签的href属性（将canvas变成png图片）
        a.href = myCanvas.src;
      //设置下载文件的名字
        a.download = "推荐码"
      //点击
        a.click()
      //弹出提示
        this.$toast('亲，正在进行下载保存');
      
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
          this.getQrcode()
        })
    },
    //分享二维码
    handleShare(){

    },
  }
};
</script>

<style scoped>

.recommend-erweima img {
  display: block;
  margin: auto;
  width: 2.67rem;
  height: 2.67rem;
  margin-top:0.6rem;
}
.recommend-bg{
  position: absolute;
  top:0;
  left: 0;
  width:100%;
  height: 100%;
  background:url(../../assets/images/recode.png) no-repeat center;
  background-size: cover;
}
.recommend-title{
  position: relative;
  margin-top:1.5rem;
 text-align: center;
 color:#fff;
 font-size: 0.63rem;
 font-weight: bold;
}
.recommend-ads{
  height: 1.2rem;
  margin:0.3rem auto 0.1rem;
  text-align: center;
  background: url(../../assets/images/rec-ads.png) no-repeat center;
  background-size: contain;
}
.red-core{
  position: relative;
  overflow: hidden;
  background: url(../../assets/images/mid-core.png) no-repeat center;
  background-size: cover;
  
  margin-left:0.9rem;
  min-height: 7.5rem;
}
.recommend-content{
  color:#333;
  font-size: 0.32rem;
  padding-top: 2.1rem;
}
.recommend-erweima {
  margin: 0 auto;
  margin-top:0.5rem;
  padding-right: 0.9rem;
}



.recommend-content span:nth-child(1){
  font-size: 0.35rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.recommend-content span{
  display: block;
  text-align: center;
  padding-right: 0.9rem;
}
.recommend-btn{
  position: relative;
  overflow: hidden;
      height: 0.56rem;
    margin-top: 0.3rem
}
.recommend-btn button{
 
  border:none;
  outline:none;
  width: 3.13rem;
  height: 0.56rem;
  line-height: 0.56rem;
  background: #FEE329;
  border-radius: 0.28rem;
  color:#FF3B30;
  font-size: 0.28rem;
  position: absolute;
      top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.recommend-btn span{
  font-size: 0.35rem;
  text-align: center;
      display: block;
    color: #fff;
}
</style>
