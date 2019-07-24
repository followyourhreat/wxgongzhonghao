<template>
  <div>
    <div class="nav-cont">
      <memnavbar :pageTitle="title"></memnavbar>
     
      <div class="cell-box" @click="showPopup">
        <span class="cell-left">头像修改</span>
        <div class="pic-right">
          <img :src="userPic" alt :onerror="defaultImg">
          <van-icon name="arrow"/>
        </div>
      </div>
      <van-popup v-model="picModel" position="bottom" :style="{ height: '30%' }">
        <ul class="pic-upload-container">
          <li class="pic-list">
            <img src="../../assets/images/camera.png" alt class="upload-contorl">
            <van-uploader :after-read="afterCamera">
              <van-button type="primary">拍照</van-button>
            </van-uploader>
          </li>
          <li class="pic-list">
            <img src="../../assets/images/pic-box.png" alt class="upload-contorl">
            <van-uploader :after-read="afterRead">
              <van-button type="primary">选择本地相册</van-button>
            </van-uploader>
            <!-- <img src="../../assets/images/pic-box.png" alt="">
            <span>选择本地相册</span>-->
          </li>
        </ul>
      </van-popup>
      <div class="cell-box" @click="showInfo">
        <span class="cell-left">用户修改</span>
        <div class="pic-right">
          <span>{{userName}}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <van-popup v-model="infoModel" position="right" :style="{ height: '100%' }">
        <van-nav-bar left-text="更改名字" left-arrow @click-left="onClickLeft"/>
        <van-cell-group>
          <span>用户名：</span>
          <van-field v-model="userName" placeholder="请输入用户名"/>
          <van-button type="danger" @click="changeUserName">确定</van-button>
        </van-cell-group>
      </van-popup>
      <div class="cell-box" @click="showMobile">
        <span class="cell-left">绑定手机</span>
        <div class="pic-right">
          <span>{{mobile}}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <!-- <van-popup v-model="mobileModel" position="right" :style="{ height: '100%' }">
        <van-nav-bar left-text="更改手机号" left-arrow @click-left="closeMobile"/>
        <van-cell-group>
          <span class="cell-mb">输入手机号：</span>
          <van-field v-model="mobileCp" label="+86" placeholder="请输入手机号"/>

          <van-field v-model="sms" center clearable label="短信验证码" placeholder="请输入短信验证码">
            <van-button slot="button" size="small" type="primary" @click="sendVerifyCode" :disabled="disableCode" >发送验证码</van-button>
            
          </van-field>
          <div class="count-time" v-show="timeShow">{{countTime}}</div>
          <van-field v-model="password" label="密码" placeholder="请输入/设置密码"/>
          <van-button type="danger" @click="handleMbSubmit">确定</van-button>
        </van-cell-group>
      </van-popup> -->
      <div class="cell-box">
        <span class="cell-left">性别</span>
        <div class="pic-right">
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="sexModel"
              :options="sexOptions"
              @change="changeSex(sexModel)"
            />
          </van-dropdown-menu>
        </div>
      </div>
      <!-- <van-popup v-model="sexModel">内容</van-popup> -->
      <div class="cell-box" @click="showBirth">
        <span class="cell-left">生日</span>
        <div class="pic-right">
          <span>{{birthDay}}</span>
          <van-icon name="arrow"/>
        </div>
      </div>
      <van-popup v-model="birthModel" position="bottom" >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :formatter="formatter"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </van-popup>
       
    </div>
   
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import Cell from "../../components/cell";
import memnavbar from "../../components/memnavbar";

export default {
  data() {
    return {
      value1: 0,
      picModel: false,
      infoModel: false,
      mobileModel: false,
      birthModel: false,
      openId: "",
      uid: "",
      token:"",
      userName: "未设置昵称",
      userPic: "",
      defaultImg:
        'this.src="' + require("../../assets/images/mem-pic.png") + '"',
      sms: "",
      mobile: "请绑定手机号",
      mobileCp: "",
      password:"",
      title: "设置",
      sexModel: "",
      minHour: 10,
      maxHour: 20,
      birthDay: "1997-01-01",
      minDate:new Date(1950, 1, 1),
      localIds: "", //本地图片id
      currentDate: new Date(1993,1,1),
      msgId:"",//验证码消息id
      mediaId: "", //微信返回的服务器id
      countTime:60,
      showVerifyCode:true,
      timeShow:false,
      disableCode:false,
      option1: [
        { text: "用户", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 }
      ],
      sexOptions: [
        { text: "未知", value: 0 },
        { text: "男", value: 1 },
        { text: "女", value: 2 }
      ]
    };
  },
  components: {
    memnavbar,
    Cell
  },
  created() {
    this.getWxConfig();
  },
  mounted() {
    let userId = localStorage.getItem("id");
    console.log(localStorage.getItem("id"));
    if (userId == undefined || userId == null) {
      // this.uid = 22; //此处是为了测试
      this.$toast("请授权登录");
      this.$router.push({path:"/home"});
    } else {
      this.uid = userId;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.autoLogin();
    this.getUserInfo();
  },
  methods: {
    //微信验签配置
    getWxConfig() {
      let curUrl = window.location.href;
      let pageUrl = escape(window.location.href.split("#")[0]);

      this.$http
        .post("/newLzshApi/weixin/getSign", "data={'url':'" + pageUrl + "'}",
          {
            headers:{
              token:this.token
            }
          }
        )
        .then(res => {
          console.log(res);
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: "wx9ca6462d9bbc1478", // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: ["chooseImage","uploadImage","scanQRCode", "barCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
        });
    },

    //上传图片  调起微信选相册 和 拍照接口 -->  获取mediaId后上传到服务器
    afterRead(file) {
      alert("相册");
      let _this = this;
      const ua = navigator.userAgent.toLowerCase();
      const result = /micromessenger/.test(ua) ? true : false;
      if (result) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(_this.localIds);
            wx.uploadImage({
              localId: _this.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function(res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                _this.$http
                  .post(
                    "/newLzshApi/upload/wxAvatarImgUpload",
                    "data={'mediaId':'" + serverId + "'}",{
                      headers:{
                        token:_this.token
                      }
                    }
                  )
                  .then(res => {
                    _this.$toast("上传成功");
                    _this.userPic = res.data;
                    console.log(res);
                    console.log(_this.userPic);
                    alert(JSON.parse(JSON.stringify(this.userPic)));
                  });
              }
            });
          }
        });
      }else{
        //支付选择图片 上传图片
        AlipayJSBridge.call('chooseImage', {
          sourceType: ['camera', 'album'],
            count: 6
          }, function (result) {
            alert(JSON.stringify(result));
            
          });
        }
      
    },
    //指定来源是相机
    afterCamera() {
       alert("相机");
      let _this = this;
      const ua = navigator.userAgent.toLowerCase();
      const result = /micromessenger/.test(ua) ? true : false;
      if (result) {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(_this.localIds);
            alert(_this.localIds);
            wx.uploadImage({
              localId: _this.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function(res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                _this.$http
                  .post(
                    "/newLzshApi/upload/wxAvatarImgUpload",
                    "data={'mediaId':'" + serverId + "'}",
                    {
                      headers:{
                        token:this.token
                      }
                    }
                  )
                  .then(res => {
                    this.userPic = res.data;
                    console.log(res);
                    console.log(this.userPic);
                    alert(JSON.parse(JSON.stringify(this.userPic)));
                  });
              }
            });
          }
        });
      }else{
        //支付选择图片 上传图片
        AlipayJSBridge.call('chooseImage', {
          sourceType: ['camera', 'album'],
            count: 6
          }, function (result) {
            alert(JSON.stringify(result));
            
          });
      }
      
    },
    //发送验证码
    sendVerifyCode(){
     
    
      if(this.mobileCp == ""){
        this.$toast("请填写手机号码");
        return false;
      }
      if(this.mobileCp.length !== 11){
        this.$toast("请输入11位的手机号码"); 
        return false; 
      }
      if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.mobileCp))){ 
        this.$toast("请输入正确的手机号码"); 
        return false; 
      } 
      this.$http.post("/newLzshApi/userInfo/sendDynamicCode","data={'mobile':'" + this.mobileCp + "'}",
        {
          headers:{
            token:this.token
          }
        }
      ).then(res=>{
        this.disableCode = true;
        this.msgId = res.data.msgId;
        this.timeShow = true;
        this.startCountTime();
      })
    },
    //更改手机号
    handleMbSubmit() {
      let params = {
          "uid": this.uid + "",
          "mobile": this.mobileCp + "",
          "msgId":this.msgId+"",
          "validCode":this.sms+"",
          "password":this.password
        }
      this.$http.post("/newLzshApi/userInfo/bindMobile","data=" + JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
          this.mobileModel = false;
          this.getUserInfo();
          this.$toast("绑定手机号成功");
      })
    },
    //日期格式转化
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "date") {
        return `${value}日`;
      }
      return value;
    },
    //更改生日
    handleConfirm(value) {
      console.log(value);
      let Y = value.getFullYear();
      let M = value.getMonth() + 1;
      let D = value.getDate();
      let birthTime = Y + "-" + M + "-" + D;
      console.log(birthTime);
      this.birthModel = false;
      let params = {
        uid: this.uid + "",
        newBirth: birthTime + ""
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/updateUserBirthByUid",
          "data=" + JSON.stringify(params),
          {
            headers:{
              token:this.token
            }
          }
        )
        .then(res => {
          this.birthDay = birthTime;
          this.$toast("更改生日成功");
        });
    },
    handleCancel() {
      this.birthModel = false;
    },
    //获取用户信息
    getUserInfo() {
      this.token = sessionStorage.getItem("redisTokenKey");
   
      this.$http
        .post(
          "/newLzshApi/userInfo/getUserInfoByUid",
          "data={'uid':'" + this.uid + "'}",
          {
            headers: {
              'token':this.token
            },
          }
        )
        .then(res => {
          if(res.code == "121"){
            this.autoLogin();
          }else{
            this.userPic = res.data.avatar;
            if(res.data.userName == ""){
              this.userName ="未设置昵称";
            }else{
              this.userName = res.data.userName;
            }
          
            if (res.data.mobile == null || res.data.mobile == "") {
              this.mobile = "请绑定手机号";
            } else {
              this.mobile = res.data.mobile;
            }
            
            if (res.data.sex == null) {
              this.sexModel = 0;
            } else {
              this.sexModel = parseInt(res.data.sex);
            }
            if (res.data.birth == null) {
              this.currentDate = new Date();
              this.birthDay = "2019-01-01";
            } else {
              this.currentDate = res.data.birth;
              this.birthDay = res.data.birth;
            }
            localStorage.setItem("id", res.data.id);
            


          }
          
        });
    },
    //更换性别
    changeSex(value) {
      let params = {
        uid: this.uid + "",
        newSex: value + ""
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/updateUserSexByUid",
          "data=" + JSON.stringify(params),
          {
            headers:{
              token:this.token
            }
          }
        )
        .then(res => {
          this.$toast("更改性别成功");
        });
    },
    //更换用户名
    changeUserName() {
      if(this.userName.trim() == ""){
        this.$toast("请输入用户名");
        return;
      }else if(this.userName.trim().length>8){
        this.$toast("请输入长度小于8的名字");
        return;
      }
      this.infoModel = false;
      let params = {
        uid: this.uid + "",
        newUserName: this.userName.trim() + ""
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/updateUserNameByUid",
          "data=" + JSON.stringify(params),
          {
            headers:{
              token:this.token
            }
          }
        )
        .then(res => {
          this.$toast("更改用户名成功");
        });
    },
    getVal: function(val) {
      console.log("1");
      this.selected = val;
    },
    showPopup() {
      this.picModel = true;
    },
    showInfo() {
      this.infoModel = true;
    },
    showMobile() {
      // this.mobileModel = true;
      this.$router.push({path:'/changeMobile'});


    },

    showBirth() {
      this.birthModel = true;
    },
    onClickLeft() {
      this.infoModel = false;
    },
    closeMobile() {
      this.mobileModel = false;
    },
    //倒计时结束时触发
    finished(){

      this.showVerifyCode = true;
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
         
              this.getUserInfo();
          })
    },
    //倒计时
    startCountTime(){
      let _this = this;
      let timer =  setInterval(()=>{
        if( _this.countTime > 0){
          _this.countTime--;
        }else{
          this.disableCode = false;
          this.timeShow =false;
          clearInterval(timer);
        }
        
      },1000)
    },
    clearCache(){
      this.$toast("缓存已经清除");
      localStorage.clear();
    }
  },
  filters: {
    formDate(val) {
      console.log(val);

      let Y = val.getFullYear();
      let M = val.getMonth() + 1;
      let D = val.getDate();
      let birthTime = Y + "-" + M + "-" + D;
      return birthTime;
    }
  }
};
</script>
<style scoped>
.nav-cont {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e7e7e7;
}
.cell-box {
  padding: 0.14rem 0.3rem;
  border-bottom: 0.01rem solid #ccc;
  overflow: hidden;
  font-size: 0.29rem;
  line-height: 1rem;
  background: #fff;
  margin-bottom: 0.1rem;
}
.cell-box:nth-of-type(2n-1) {
  margin-bottom: 0;
}
.cell-box:nth-of-type(2n) {
  border: none;
}
.cell-left {
  display: block;
  float: left;
}
.pic-right {
  float: right;
  display: flex;
  align-items: center;
  color: #ccc;
  position: relative;
}
.pic-right img {
  width: 0.76rem;
  height: 0.76rem;
}
.pic-upload-container {
  width: 6.25rem;
  margin: 0 auto;
  border-radius: 0.03rem;
  border: 0.01rem solid #ccc;
}
.pic-list {
  font-size: 0.32rem;
  color: #666666;
  border-bottom: 0.01rem solid #ff3333;
  text-align: left;
  padding: 0.1rem 0.32rem;
  position: relative;
}
.pic-list:first-child img {
  width: 0.31rem;
  height: 0.27rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.pic-list:nth-child(2) img {
  width: 0.32rem;
  height: 0.24rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.pic-list:last-child {
  border-bottom: none;
}
.van-popup--bottom {
  display: flex;
  align-items: center;
}
.van-cell-group {
  width: 100%;
  padding: 0 0.44rem;
}
.van-cell-group > span {
  color: #666;
  font-size: 0.29rem;
  text-align: left;
  display: block;
  padding-left: 0.3rem;
  padding-top: 0.31rem;
}
.van-button--danger {
  background: #ff3333;
  width: 95%;
  margin: 0.5rem auto;
  padding: 0;
  display: block;
  height: 0.83rem;
  border-radius: 0.07rem;
}
.van-popup--right {
  width: 100%;
}
.van-nav-bar {
  background: #f7f7f8;
  font-size: 0.32rem;
}
.van-nav-bar .van-icon {
  color: #ff3636;
}
.van-nav-bar__text {
  color: #666;
}
.van-cell {
  padding: 0.1rem 0.3rem;
}
.van-cell__value--alone {
  /* border-bottom:0.01rem solid #FF3636; */
}
.van-cell__value--alone .van-field__control {
  border: none;
}
.van-popup--right {
  margin-top: -1px;
}
.cell-mb {
  margin-top: 0.53rem;
  margin-bottom: 1rem;
}
.van-field__control {
  border-left: 0.01rem solid #ff3636;
  text-indent: 0.2rem;
}
.van-popup .van-button--primary {
  background: #ceccd3;
  color: #ff3333;
  border: none;
  outline: none;
  font-size: 0.32rem;
  width: 2.06rem;
  height: 0.73rem;
  line-height: 0.73rem;
}
.van-cell:not(:last-child)::after {
  width: 6.9rem;
  border-bottom: 1px solid #ccc;
}
.van-dropdown-menu {
  width: 1rem;
}
.van-dropdown-menu__title::after {
  top: 39%;
}
.van-picker {
  width: 100%;
}
.van-uploader {
  width: 100%;
  font-size: 0.32rem;
}
.van-uploader__input-wrapper {
  width: 100%;
  text-align: left;
}

.van-uploader__input-wrapper .van-button--primary {
  background: #fff;
  width: 100%;
  color: #666;
  padding-left: 0.4rem;
  text-align: left;
}
.count-time{
  width: 2.06rem;
  height: 0.63rem;
  line-height: 0.63rem;
  font-size: 0.32rem;
  position: absolute;
  top: 2.5rem;
  right: 0.7rem;
  background: #ff3333;
 
  color: #fff;
}
</style>
