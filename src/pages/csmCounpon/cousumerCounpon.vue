<template>
  <div class="counsumer-counpon-body">
    <van-nav-bar
      :title="title"
      left-text
      right-text
      left-arrow
      @click-left="onClickLeft"
     
    />
    <div class="counpon-cate-container">
      <div class="counpon-cate-left">
        <span>￥{{couponMoney}}</span>
        <span>消费券余额</span>
      </div>
      <div class="counpon-cate-right">
        <span style="color:#FF7E00;font-size:0.3rem;">￥{{receivableCoupon}}</span>
        <span>可领取消费券</span>

        <van-button type="primary" :disabled="canGot" @click="getCsmCounpon" >领取</van-button>
      </div>
    </div>
    <div class="counpon-box-receive">
      <div class="counpon-box-header">
        <span>消费券领取记录</span>
        <span @click="checkAll('/counpon/receive-list')">查看所有记录>></span>
      </div>
      <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <ul>
          <li class="list-box" v-for="item in incomeList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费券领取-来自积分兑换</div>
              <div class="list-order-time">{{item.crtTime | fixDate }}</div>
            </div>
            <div class="list-number">+{{item.money}}</div>
          </li>
        </ul>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
      </div>
    </div>
    <div class="counpon-box-receive">
      <div class="counpon-box-header">
        <span>消费券使用记录</span>
        <span @click="checkAll('/counpon/use-list')">查看所有记录>></span>
      </div>
      <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata2">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <ul>
          <li class="list-box" v-for="item in payList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">支付-{{item.name}}</div>
              <div class="list-order-time">{{item.crtTime | fixDate}}</div>
            </div>
            <div class="list-number">-{{item.money}}</div>
          </li>
        </ul>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
      </div>
    </div>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "消费券",
      uid: "",
      token: "bc1d578c323e3fc5044ca46e1c743691",
      couponMoney: "",
      receivableCoupon: "",
      incomeList: [],
      payList: [],
      loadingShow:false,//加载中
      canGot:false,//是否能点击
      nodata:false,
      nodata2:false,
    };
  },
  components: {
    Memnavbar
  },
  filters: {
    fixDate(val) {
      let newVal = val.substring(5);
      return newVal;
    }
  },
  mounted() {
    if (
      localStorage.getItem("id") !== undefined &&
      localStorage.getItem("id") !== null
    ) {
      this.uid = localStorage.getItem("id");
    } else {
      //没有uid应该提示去登录  此处为了本地测试先放uid=
      console.log("本地测试");
      this.uid = 128;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getUserCounpon();
  },
  methods: {
    getUserCounpon() {
      this.token = sessionStorage.getItem("redisTokenKey");
      this.loadingShow = true;
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
           this.loadingShow = false;
          if (res.code == "121") {
            this.autoLogin();
          } else {
            this.incomeList = res.data.incomeList;
            this.payList = res.data.payList;
            this.couponMoney = res.data.couponMoney;
            this.receivableCoupon = res.data.receivableCoupon;
            if(this.receivableCoupon == "0"){
              this.canGot = true;
            }
            if(res.data.incomeList.length == 0){
              this.nodata = true;
            }else{
              this.nodata = false;
            }
            if(res.data.payList.length == 0){
              this.nodata2 = true;
            }else{
              this.nodata2 = false;
            }

          }
        });
    },
    checkAll(params) {
      this.$router.push({ path: params });
    },
    getCsmCounpon() {
      console.log("11111");
      this.$router.push({ path: "award" });
    },
    onClickLeft(){
      this.$router.push({path:"/home"});
    },
    //自动登录
    autoLogin() {
      let params = {
        uid: this.uid + ""
      };
      this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params)
        )
        .then(res => {
          sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
          
          this.getUserCounpon()
        });
    }
  }
};
</script>
 <style  scoped>
.counsumer-counpon-body {
  background: #e5e4e4;
}
.counpon-cate-container {
  position: relative;
  overflow: hidden;
  margin-bottom: 0.15rem;
  background: #fff;
}
.counpon-cate-container > div {
  float: left;
  width: 50%;
  font-size: 0.3rem;
  color: #333;
  padding: 0.38rem 0;
  height: auto;

  position: relative;
}

.counpon-cate-container > div span {
  text-align: center;
  display: block;
}
.counpon-cate-container > div span:nth-child(1) {
  margin-bottom: 0.32rem;
  font-size: 0.3rem;
}
.counpon-cate-right::before {
  content: " ";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 0;
  width: 0.03rem;
  height: 0.8rem;
  background: #d1d1d1;
  transform: translateY(-50%);
}
.counpon-cate-container > div.counpon-cate-left {
  color: #ff3636;
}

.van-button {
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.25rem;
  position: relative;
  width: 1.4rem;
  background: #ff3636;
  border: none;
  outline: none;
  margin-top: 0.2rem;
  border-radius: 0.16rem;
}
.counpon-box-header {
  background: #fff;
  font-size: 0.28rem;
  color: #333;
  height: auto;
  position: relative;
  overflow: hidden;
  padding: 0.2rem 0.21rem;
  border-bottom: 0.01rem solid #ccc;
}
.counpon-box-header span:first-child {
  display: block;
  float: left;
}
.counpon-box-header span:nth-child(2) {
  float: right;
}
.counpon-box-receive .order-list-content ul li:last-child {
  border-bottom: 0.01rem solid #ccc;
}
.order-list-nodata{
  position:relative;
  padding-top:0.3rem;
}
.order-list-nodata img{
  display:block;
  width:2.09rem;
  height:2.09rem;
  margin:auto;
}
.order-list-nodata span{
  display: block;
  font-size: 0.33rem;
  font-weight: 400;
  color: #666;
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

</style>
