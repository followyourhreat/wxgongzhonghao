<template>
  <div class="mine-body">
    <div class="headerWrap">
      <div class="login-user">
        <div class="avatar" @click="togglePic">
          <!-- <img style="border:none;" src="../../assets/images/mem-pic.png" > -->
          <img style="border:none;" :src="memPic" >
        </div>
        <!-- <img class="avatar"  style="border:none;" src="../../assets/images/logo.png"> -->
        <div class="Login-phone">
          <span>{{userName}}</span>
         
          <Span class="phone" @click="setPhone">手机号：{{mobile}}</Span>
        </div>
      </div>
      <div class="leftImg" @click="goMesCenter" v-if="showMes">
        <img src="../../assets/images/mesnotread.png">
      </div>
      <div class="leftImg" @click="goMesCenter">
        <img src="../../assets/images/mesread.png">
      </div>
      <div class="rightImg" @click="goSetting">
        <img src="../../assets/images/ic_settings.png">
      </div>
      
    </div>
    <div class="integral">
        <div class="int-content">
          <div class="con-left">
            <div class="mem-bd">
              <img src="../../assets/images/ic_count.png">
              <span class="int-count">积分</span>
            </div>
            
           <div class="mem-num">
              <span class="num">{{totalScore}}</span>
            </div>
          </div>
          <!-- <img class="con-middle" src="../../assets/images/vertical_line.png"> -->
          <div class="con-right">
            <div class="mem-bd">
              <img src="../../assets/images/ic_collect.png">
              <span class="consume">消费券</span>
            </div>
            <div class="mem-num">
              <span class="num">{{couponMoney}}</span>
            </div>
            
          </div>
        </div>
      </div>
    <div class="content-cell">
      <Cell title="我的账单" :memberRoute="orderlist">
        <img src="../../assets/images/ic_me_bill.png" slot="show" class="cell_img">
        <img
          src="../../assets/images/ic_arrow_gray_small.png"
          slot="cell-right"
          class="cell_right_img"
        >
      </Cell>
      <Cell title="新手指南" :memberRoute="guide">
        <img src="../../assets/images/ic_green_hands_companion.png" slot="show" class="cell_img">
        <img
          src="../../assets/images/ic_arrow_gray_small.png"
          slot="cell-right"
          class="cell_right_img"
        >
      </Cell>
      <Cell title="联系我们" :memberRoute="contact">
        <img src="../../assets/images/ic_relation_phone.png" slot="show" class="cell_img">
        <img
          src="../../assets/images/ic_arrow_gray_small.png"
          slot="cell-right"
          class="cell_right_img"
        >
      </Cell>
      <Cell title="关于我们" :memberRoute="about">
        <img src="../../assets/images/ic_about_we.png" slot="show" class="cell_img">
        <img
          src="../../assets/images/ic_arrow_gray_small.png"
          slot="cell-right"
          class="cell_right_img"
        >
      </Cell>
    </div>
    <tabbar></tabbar>
  </div>
</template>

<script>
import Cell from "../../components/cell";
import Contact from "../../components/contact";
import bootBar from "../../components/bootBar";
import tabbar from "../../components/tabbar";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      orderlist: "order-list",
      guide: "finger-guide",
      contact: "contact-us",
      about: "about-us",
      userName: "",
      mobile: "",
      showMes: false,
      uid: "",
      openId: "", //用来测试下单的数据  上线需删除
      token:"",
      totalScore:"",//积分总额
      couponMoney:"",//消费券总额
      memPic:"",//用户头像
      domain:"",
      picUrlRelative:"",
      picUrl:"",
      appId:"",
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  created(){
    this.commonSystemInfo();
  },
  mounted() {
     
    if (localStorage.getItem("id") == undefined || localStorage.getItem("id") == null) {
      this.$toast("请授权登录");
      this.$router.push({path:"/home"})
    } else {
      this.uid = localStorage.getItem("id")
    }
    this.userName = localStorage.getItem("user_name");
    this.token = sessionStorage.getItem("redisTokenKey");
    // this.userReset();
    this.getUserInfo();
  },
  components: {
    Cell,
    bootBar,
    tabbar
  },
  methods: {
    goMesCenter() {
      this.$router.push({ path: "message" });
    },
    goSetting() {
      this.$router.push({ path: "setting" });
    },
    togglePic() {
      console.log("123");
    },
    setPhone() {
      this.$router.push({ path: "setting" });
    },
    //获取用户信息
    getUserInfo() {
      this.token = sessionStorage.getItem("redisTokenKey");
      this.$http
        .post(
          "/newLzshApi/userInfo/getUserInfoByUid",
          "data={'uid':'" + this.uid + "'}",
          {
           headers:{
             token:this.token
           }
          },
        )
        .then(res => {
          if(res.code == '121'){
            this.autoLogin()
          }else{
            if (res.data.userName == null || res.data.userName == "" || res.data.userName == undefined) {
            this.userName = "用户";
            } else {
              this.userName = res.data.userName;
              localStorage.setItem("user_name",res.data.userName);
              this.$store.dispatch("setUserInfoAction", res.data);
            }
            if (res.data.mobile == 0 || res.data.mobile == null) {
              this.mobile = "请绑定手机号";
            } else {
              this.mobile = res.data.mobile;
            }
            if(res.data.consumerScore == null || res.data.consumerScore == ""){
               this.totalScore  = "0";
            }else{
              this.totalScore = res.data.consumerScore;
            }
            if( res.data.consumerCoupon == null ||  res.data.consumerCoupon == ""){
              this.couponMoney ="0";
            }else{
               this.couponMoney = res.data.consumerCoupon;
            }
            if(res.data.avatar == null || res.data.avatar == ""){
              this.memPic = "../../assets/images/mem-pic.png";
            }else{
               this.memPic =this.picUrl+res.data.avatar;
            }
           
            this.uid = res.data.id;
            // localStorage.setItem("id", res.data.id);
          }
          

        });
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
    }



  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
.headerWrap {
  position: relative;
  width: 100%;
  height:2.72rem;
  background: #ea0f0f;
  

  padding:0.6rem 0.40rem;
  .login-user {
    height: 1.51rem;
    display: flex;
    align-items: center;
    .avatar {
      position: relative;
      width: 1.51rem;
      height: 1.51rem;
      border-radius: 50%;
      float:left;
      img {
        width: 1.51rem;
        height: 1.51rem;
        position: relative;
       
      }
    }

    .Login-phone {
      display: block;
      width: 3.4rem;
      position: relative;
      
      overflow:hidden;
      text-overflow: ellipsis;

      span {
       
        font-size: 0.42rem;
        color: #fff;
        font-weight: 400;
        text-align:left;
        display:block;
        text-indent:0.2rem;
            white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
      }

      .phone {
        display: block;
        
        font-size: 0.28rem;
        color: #fff;
        margin-top:0.1rem;
       
      }
    }
  }

  .rightImg {
    position: absolute;
    top: 0rem;
    right: 0.34rem;

    img {
      width: 0.46rem;
      height: 0.46rem;
    }
  }

  .leftImg {
    position: absolute;
    top: 0rem;
    right: 1.33rem;

    img {
      width: 0.46rem;
      height: 0.46rem;
    }
  }
}

.integral {
  width: 100%;
  height: 2.32rem;
  background: #fff;

  box-shadow: 0px 0.01rem 0.1rem #d7d7d7;
  position: relative;
     margin: 0.15rem 0;
    overflow: hidden;
}

.int-content {
  margin: 0 auto;
  display flex;
  align-items center;
  justify-content cener;
  height 2.32rem;
  .con-left {
    display: inline-block;
  
    width: 49%;
    

  }
  
  .con-middle {
    display: inline-block;
    height: 1.1rem;
    position: relative;
    top: 0rem;
  }

  .con-right {
    display: inline-block;
    border-left:0.01rem solid #ccc;
    width: 49%;
   
 
  }

  img {
    width: 0.49rem;
    height: 0.49rem;
   
  }

  span {
    display: inline-block;
    font-size: 0.31rem;
    vertical-align: middle;
    color: #666;
    margin-left:0.1rem;
  }

  .num {
    display: block;
    color: #fdb150;
    font-size:0.53rem;
  }
}

.content-cell {
  position: relative;
 
}
.mine-body{
  position:absolute;
  width:100%;
  height:100%;
  background:#E7E7E7;  
}
.cell_wrap{
  background #fff
}
.int-content::after{
    width:0.01rem;
    height:0.7rem;
    display:block;
    background:#000;
    position absolute;
    top:50%;
    right:0;
  }
.mem-bd{
  display:flex;
  align-items:center;
  justify-content center;
}
.mem-num{
  margin-top:0.1rem;
}
</style>

