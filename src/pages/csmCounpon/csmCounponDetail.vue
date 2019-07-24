<template>
  <div class="csmCounponDetail-body">
    <van-nav-bar
      title="消费券"
      left-text
      right-text
      left-arrow
      @click-left="onClickLeft"
     
    />
    <div class="csm-detail-header">
      <span>今日消费入账</span>
      <span>￥{{curCounpon}}</span>
      <van-button disabled type="default">已领取</van-button>
    </div>
    <div class="csm-detail-list">
      <div class="counpon-box-header">
        <span>今日领取记录</span>
        <span @click="checkAll('/counpon/receive-list')">查看所有记录>></span>
      </div>
      <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <ul>
          <li class="list-box" v-for="item in currenCounponList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">支付-{{item.name}}</div>
              <div class="list-order-time">{{item.crtTime | fixDate }}</div>
            </div>
            <div class="list-number">+{{item.money}}</div>
          </li>
     
        </ul>
        
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
      uid:"",
      token:"bc1d578c323e3fc5044ca46e1c743691",
      curCounpon:"",
      currenCounponList:[],
      nodata:false,
    };
  },
 
  components: {
    Memnavbar
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    },
  },
  mounted(){
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
      
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 
      console.log("本地测试");
      this.uid = 128;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    // this.getCoupon();
    this.curCounpon = this.$route.query.curCounpon;
    this.queryCouponDetail()

  },
   methods: {
    checkAll(params) {
      this.$router.push({ path: params });
    },
    //领取消费券
    // getCoupon(){
    //   let params = {
    //     uid:this.uid
    //   }
    //    this.$http.post( "/newLzshApi/coupon/receiveCoupon", "data="+JSON.stringify(params),{
    //     headers: {
    //       'token':this.token
    //     },
    //   }).then(res=>{
    //     this.curCounpon = res.data;
    //   })
    // },
    //查询消费券领取详情
    queryCouponDetail(){
      let params = {
        uid:this.uid
      }
       this.$http.post( "/newLzshApi/coupon/queryCouponDetail", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.currenCounponList = res.data.resultList;
        if(res.data.resultList.length == 0){
          this.nodata = true;
        }
      })
    },
    onClickLeft(){
      this.$router.push({path:"/cousumer-counpon"});
    }
  },
};
</script>
<style>
.csm-detail-header {
  padding: 0.4rem 0;
  border-bottom: 0.01rem solid #ccc;
}
.csm-detail-header span {
  display: block;
  font-size: 0.3rem;
  
}
.csm-detail-header span:nth-child(2){
  color:#FF3636;
  font-size: 0.36rem;
  margin-top:0.25rem;
}
.van-button--default {
    background: #333;
    color: #fff;
    width: 1.6rem;
    height: .56rem;
    line-height: .56rem;
    font-size: 0.3rem;
    padding: 0;
}
.counpon-box-header {
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
.list-number{
  color:#FF3636;
}
.order-list-nodata{
  position:relative;
  margin-top:0.3rem;
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

