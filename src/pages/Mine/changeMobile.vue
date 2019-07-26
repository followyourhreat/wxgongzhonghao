<template>
    <div class="mobile-body">
        <memnavbar :pageTitle="title"></memnavbar>
        <van-cell-group>
            <span class="cell-mb">输入手机号：</span>
            <van-field v-model="mobileCp" label="+86" type="tel" placeholder="请输入手机号"/>

            <van-field v-model="sms" center clearable type="number" label="短信验证码" placeholder="请输入短信验证码">
                <van-button slot="button" size="small" type="primary" v-show="showVerifyCode" @click="sendVerifyCode" :disabled="disableCode" >发送验证码</van-button>
                <van-button slot="button" size="small" type="primary" class="bt-core" v-show="timeShow"  >{{countTime}}S后请重新发送</van-button>
                
            </van-field>
            <!-- <div class="count-time" v-show="timeShow"></div> -->
            <van-field v-model="password" type="password" label="密码" placeholder="请输入\设置密码"/>
            <van-button type="danger" @click="handleMbSubmit">确定</van-button>
         </van-cell-group>
    </div>
</template>
<script>
import md5 from 'js-md5'
import memnavbar from "../../components/memnavbar";
export default {
    data(){
        return{
            title:"绑定手机号",
            countTime:60,
            mobileCp:"",
            sms:"",
            password:"",
            showVerifyCode:true,
            timeShow:false,
            disableCode:false,
            uid:"",


        }
    },
    components: {
        memnavbar,
    
    },
    mounted(){
        if (localStorage.getItem("id") == undefined || localStorage.getItem("id") == null) {
            // this.uid = 126; //此处是为了测试
            this.$toast("请授权登录");
            this.$router.push({path:"/home"});
        } else {
            this.uid = localStorage.getItem("id");
        }
        console.log(this.uid);
        this.token = sessionStorage.getItem("redisTokenKey");
    },
    methods:{
        //发送验证码
        sendVerifyCode(){
        this.token = sessionStorage.getItem("redisTokenKey");
        
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
        this.$http.post("/newLzshApi/userInfo/sendDynamicCode","data={'mobile':'" + this.mobileCp + "'}").then(res=>{
            this.disableCode = true;
            this.msgId = res.data.msgId;
            this.showVerifyCode = false;
            this.timeShow = true;
            this.countTime = 60;
            this.startCountTime();
        })
        },
        //更改手机号
        handleMbSubmit() {
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
        if(this.password == ""){
            this.$toast("请输入密码");
            return false;
        }
        if(this.password.length < 6){
            this.$toast("请输入长度大于6的密码");
            return false;
        }
        let params = {
            "uid": this.uid + "",
            // "uid":  "126",
            "mobile": this.mobileCp + "",
            "msgId":this.msgId+"",
            "validCode":this.sms+"",
            "password":md5(this.password)
            }
            this.$http.post("/newLzshApi/userInfo/bindMobile","data=" + JSON.stringify(params),{
                headers: {
                'token':this.token
                },
            }).then(res=>{
                if(res.code == "121"){
                    this.autoLogin()
                }else if(res.code == "130"){
                    this.$toast("验证码已过期");
                }else if(res.code == "160"){
                    this.$toast("您已绑定过手机号");
                }else if(res.code == "3"){
                    this.$toast("参数错误");
                }else if(res.code == "500"){
                    this.$toast("未知错误");
                }else{
                    this.$toast("更改手机号成功");
                    this.$router.push({path:"setting"});
                }
                this.uid = res.data.id;
                localStorage.setItem("id",res.data.id);
                
                
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
                 this.showVerifyCode = true;
                this.timeShow =false;
                clearInterval(timer);
                }
                
            },1000)
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
                
                this.handleMbSubmit();
            })
        }
    }
}
</script>
<style scoped>
.van-hairline--top-bottom::after{
    display: none;
}
.van-cell__title{
    font-size: 0.3rem;
}
 .van-button--primary {
  background: #ff3333;
  color: #fff;
  border: none;
  outline: none;
  font-size: 0.32rem;
  width: 2.06rem;
  height: 0.73rem;
  line-height: 0.73rem;
}
.van-button--danger {
  background: #ff3333;
  width: 93%;
  margin: 0.5rem auto;
  padding: 0;
  display: block;
  height: 0.83rem;
  border-radius: 0.07rem;
  line-height: 0.83rem;
}
.cell-mb {
     margin-top: 0.53rem;
    margin-bottom: 1rem;
    font-size: 0.42rem;
    text-align: left;
    display: block;
    padding-left: 0.3rem;
}
.van-cell{
    padding-left:0.35rem;
    padding-right:0.35rem;
}
.count-time{
  width: 2.06rem;
    height: 0.67rem;
    line-height: 0.67rem;
  font-size: 0.20rem;
  position: absolute;
  top: 2.59rem;
  right: 0.35rem;
  background: #f33;
  color: #fff;
}
.bt-core{
    font-size: 0.18rem;
    padding:0 0;
}
</style>

