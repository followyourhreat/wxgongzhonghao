<template>
  <div>
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="nav-cont">
      <ul>
        <li class="item-1">
          <img class="icon" src="../../assets/images/ic_phone.png">
          <a class="text" href="tel:0730-88888888">联系电话：0730-88888888</a>
        </li>
        <li>
          <img class="icon" src="../../assets/images/ic_qq.png">
          <!-- <a target="_blank" class="text" :href="parameter_value">
            <img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="利达众" title="利达众">
           
          </a> -->
          <a class="text" href="javascript:;">客服QQ群：<span >{{lzQQ}}</span><input type="hidden" id="text" name="" :value="lzQQ"><van-button class="copy-btn" plain type="primary" @click="copyTxt">点击复制群号</van-button></a>
          <!-- <van-button class="copy-btn" plain type="primary" @click="copyTxt">点击复制群号</van-button> -->
          <!-- <a class="text" :href="parameter_value"></a> -->
          
        </li>
        <li>
          <img class="icon" src="../../assets/images/ic_wechat.png">
          <a class="text" href="javascript:;">客服微信：szlzsh<input type="hidden" id="text" name="" value="szlzsh"><van-button class="copy-btn" plain type="primary" @click="copyTxt2">点击复制微信号</van-button></a>
        </li>
        <!-- <li>
                 <img class="icon" src="../../assets/images/ic_wechat.png"/>
                 <a class="text" href="#">客服电话：075522677795</a>
            </li>
            <li>
                 <img class="icon" src="../../assets/images/ic_wechat.png"/>
                 <a class="text" href="#">用户客服QQ：2115876986</a>
            </li>
            <li>
                 <img class="icon" src="../../assets/images/ic_wechat.png"/>
                 <a class="text" href="#">商家客服QQ：2736656451</a>
        </li>-->
      </ul>
    </div>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "联系我们",
      webSystemParameterConfigList:"",
      picUrlRelative:"",
      domain:"",
      parameter_value:"",
      lzQQ:"",
    };
  },
  components: {
    Memnavbar
  },
  mounted(){
    this.getSystemInfo();
  },
  methods: {
    onClickLeft() {
      Toast("返回");
    },
    onClickRight() {
      Toast("按钮");
    },
    //获取系统信息
    getSystemInfo(){
      this.$http.post("/newLzshApi/systemCommon/getWebSystemParameterConfig").then(res=>{
        let arr =  res.data.webSystemParameterConfigList;
         arr.forEach(item => {
          if (item.parameter_key == "DOMAIN") {
            this.domain = item.parameter_value;
          } else if (item.parameter_key == "WEB_IMG_PATH") {
            this.picUrlRelative = item.parameter_value;
          } else if (item.parameter_key == "WEB_WX_APPID") {
            this.appId = item.parameter_value;
          }else if(item.parameter_key == "QQ_GOURP_WEB_KEY"){
            this.parameter_value = item.parameter_value;
          }else if(item.parameter_key == "QQ_GOURP_NUM"){
            this.lzQQ = item.parameter_value;
          }

        });
        this.picUrl = this.domain + this.picUrlRelative;
        // this.parameter_value = "//shang.qq.com/wpa/qunwpa?idkey="+res.data.webSystemParameterConfigList[9].parameter_value;

    
      })
    },
    copyTxt(){
      var copycode=document.getElementById("text");
      copycode.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      alert("已复制好，可贴粘。")

    },
    copyTxt2(){
      var copycode=document.getElementById("text2");
      copycode.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      alert("已复制好，可贴粘。")
    }

  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.nav-cont {
 
  position absolute
  top:0;
  left 0;
  width:100%;
  height 100%;
  background: #e7e7e7;
  padding-top: 1.1rem;

  li {
   
    height: 1.1rem;
  
    background: rgb(251, 251, 251);
    margin-top: 0.1rem;
    position relative
  }

  .text {
    font-size: 0.32rem;
    color: #666;
    font-weight: 400;
    text-align: left;
    display: block;
    padding-left: 1.2rem;
    line-height: 1.1rem;
   position:relative;
  }
  .text img{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
  }
  .icon {
    position: absolute;
    left: 0.4rem;
    top: 50%;
    width: 0.42rem;
    height: 0.42rem;
    display: block;
    transform: translateY(-50%);
  }
}
.copy-btn{
  
}
.van-button--normal{
  padding:0;
  height:0.6rem;
  display:block;
 
      line-height: 0.6rem;
      position:absolute;
      right:0.2rem;
      padding:0 0.1rem;
      top:50%;
      transform:translateY(-50%);
}
.van-button--plain.van-button--primary{
  color:#FD3636;
}
.van-button--primary{
  border: 1px solid #FD3636;
}
</style>