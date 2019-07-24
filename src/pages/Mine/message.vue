<template>
  <div>
   
    <div class="nav-cont">
      <memnavbar :pageTitle="title"></memnavbar>
      <div class="notice-img" v-show="noNotice">
         <img src="../../assets/images/ic_news.png" >
         <span>暂无消息</span>
      </div>
      
      <van-notice-bar
        mode="link"
        left-icon="volume-o"
        color="#FF3333"
        :scrollable="false"
        :wrapable="true"
        v-for="item in NoticeList"
        :key="item.index"
      >
        <a href="#">{{item.content}}</a>
      </van-notice-bar>
      <!-- <van-notice-bar
        mode="link"
        left-icon="volume-o"
        color="#FF3333"
        :scrollable="false"
        :wrapable="true"
      >
        <a href="#">【升级】利达众新版全新上线，一款可以为您省钱的 APP来啦！</a>
      </van-notice-bar> -->
    </div>
  </div>
</template>
<script>
import memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "消息中心",
      showMessage: false,
      NoticeList:[],
      uid:"",
      webSystemParameterConfigList:[],
      domain:"",//域名
      picUrl:"",//图片访问路径
      noNotice:false,//暂无公告
    };
  },
  components: {
    memnavbar
  },
  mounted(){

     if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
      
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      this.uid = 3;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getNoticeInfo();
    this.getSystemInfo();
  },
  methods:{
    getNoticeInfo(){
      this.token = sessionStorage.getItem("redisTokenKey");
      let params = {
        appEnv:"0",
        code:"2",
        mark:"2",
      }
      this.$http.post("/newLzshBusinessApi/banner/getBannerAndNoticeInfo","data=" + JSON.stringify(params),{
        headers:{
          token:this.token
        }
      }).then(res=>{
        if(res.code == "121"){
          this.autoLogin()
        }else{
          
          
          if(res.data.result.length>0){
            this.noNotice =false;
            this.NoticeList = res.data.result;
          }else{
            this.noNotice = true;
          }
        }
          
      
       
      }).catch(err =>{
        console.log(err);
      })
    },
    //获取系统信息
    getSystemInfo(){
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res=>{
        this.webSystemParameterConfigList =  res.data.webSystemParameterConfigList;
        this.picUrlRelative = res.data.webSystemParameterConfigList[3].parameter_value;
        this.domain = res.data.webSystemParameterConfigList[2].parameter_value;
        let picUrlAbsolute = this.domain + this.picUrlRelative;
        console.log(res.data);
        console.log(picUrlAbsolute);
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
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
          
          this.getNoticeInfo();
        })
    }
  }
};
</script>
<style lang='stylus' scoped>
.nav-cont {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e7e7e7;

  img {
    widows: 2.33rem;
    height: 2.71rem;
    margin-top: 2.63rem;
  }

  span {
    display: block;
    font-size: 0.33rem;
    font-weight: 400;
    color: #666;
  }

  .van-notice-bar {
    margin-top: 0.1rem;
    padding-top: 0.42rem;
    padding-bottom: 0.35rem;
    color: #444;
    margin-bottom: 0.2rem;
  }

  .van-notice-bar__content {
    text-align: left;
    padding-left: 0.15rem !important;

    a {
      display: block;
      text-align: left;
      padding-left: 0.2rem;
    }
  }
}
</style>
