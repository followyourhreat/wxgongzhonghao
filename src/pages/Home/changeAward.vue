<template>
  <div class="order_list">
    <memnavbar :pageTitle="title"></memnavbar>
    <!-- <van-dropdown-menu  active-color="#FF3636" overlay="false">
            <van-dropdown-item v-model="value1" :options="option1" />
    </van-dropdown-menu>-->
    <div class="order-container">
      <div class="order-list-desc">
        <div class="order-list-date">
          <span>{{dates2}}</span>

          <van-icon name="arrow-down" @click="showPopup"/>
        </div>
        <div class="order-sale-buy">
          <span>￥{{totalCoupon | fixTotal }}</span>
        </div>
      </div>

      <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
        <ul>
          <li class="list-box" v-for="item in CouponRecordList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_integer.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费券领取-来自积分兑换</div>
              <div class="list-order-time">{{item.crtTime}}</div>
            </div>
            <div class="list-number">￥{{item.couponMoney}}</div>
          </li>
        </ul>
        </van-list>
        <!-- <div class="mall-ads" v-show="noCounpon">
          没有更多了
        </div> -->
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
       
        :formatter="formatter"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      />
    </van-popup>
  </div>
</template>
<script>
import memnavbar from "../../components/memnavbar";
export default {
  name: "orderList",
  data() {
    return {
      show: false,
      title: "我的积分",
      minHour: 10,
      maxHour: 20,
      uid:"",
      dates:new Date().toLocaleDateString().replace(/\//g,"-").substring(0,6),
      dates2:"",
      currentDate: new Date(),
      loading:false,//滚动到底部
      finished:false,//判断数据是否全部加载完毕
      page:1,//默认第一页
      hasMore:"",//是否有更多
      totalCoupon:"",
      CouponRecordList:[],
      noCounpon:false,
      loadingShow:false,
      nodata:false,
    };
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    },
    fixMonth(val){
      let newVal = val.replace(/\-/g,"年")+"月";
      return newVal;
    },
    fixTotal(val){
      
      if(val == null || val == undefined || val == ""){
        let newVal
        return newVal = 0;
      }else{
        return val;
      }
    }
  },
  mounted() {
    let curYear = new Date().getFullYear();
    let curMonth = new Date().getMonth()+1;
    if(curMonth>10){
      this.dates2 = curYear+"年" + curMonth+"月";
    }else{
      this.dates2 = curYear+"年" + curMonth+"月";
    }
    if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
      this.uid = localStorage.getItem("id");
    }else{
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      // this.uid = 145;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getCouponRecord()
  },
  methods: {
  
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    handleConfirm(value) {
      console.log(value);
      this.show = false;
      this.loadingShow = true;
      console.log(value.getMonth()+1);
      let valTime=""
      let valArr=""
      let currentDay="" 
      let selectTime=""
      // if(value.getMonth()+1 < 10){
      //   valTime = value.toLocaleDateString().replace(/\//g,"-").substring(0,6);
      //   valArr = valTime.split("");
      //   currentDay = valArr.splice(5,0,"0");
      //   selectTime = valArr.join("");
      //   this.dates = selectTime;
      // }else{
      //   valTime = value.toLocaleDateString().replace(/\//g,"-").substring(0,7);
      //   valArr = valTime.split("");
      //   selectTime = valArr.join("");
      //   this.dates = selectTime;
      //   console.log(this.dates);
      // }

      let dYear = value.getFullYear();
      let dMonth = value.getMonth()+1;

      // selectTime = dYear+dMonth;
    
      if(dMonth>10){
        this.dates2 = dYear+"年"+ dMonth+"月";
        selectTime = dYear+dMonth;
      }else{
        this.dates2 = dYear+"年"+ dMonth+"月";
        selectTime = dYear+"-0"+dMonth;
      }
      let params = {
        uid:this.uid+ "",
        type:"1",
        dates:selectTime,
        page:1,
        limit:10
      }
      this.$http.post( "/newLzshApi/score/getScoreRecord", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.loadingShow = false;
        this.totalCoupon = res.data.totalMoney;
        this.CouponRecordList = res.data.resultList;
        if(res.data.resultList.length == 0){
          this.nodata = true;
        }else{
          this.nodata =false;
        }
        
      })



    },
    handleCancel() {
      this.show = false;
    },
    showPopup() {
      this.show = true;
    },
    getCouponRecord(){
      this.token = sessionStorage.getItem("redisTokenKey");
      this.loadingShow = false;
     

      let cYear = this.dates2.split("年")[0];
      let cMonth = this.dates2.split("月")[0].split("年")[1];
      let ctDay;
   
     if(cMonth>10){
        ctDay =  cYear +"-"+cMonth;
      }else{
         ctDay =  cYear +"-0"+cMonth;
      }
      let params ={
          uid:this.uid+"",
          type:"2",
          dates:ctDay,
          page:this.page,
          limit:10
        };
      this.$http.post( "/newLzshApi/score/getScoreRecord", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        console.log(res.code);
        this.loadingShow = false;
        if(res.code == "121"){
          this.autoLogin();
        }else{
          this.CouponRecordList = res.data.resultList;
          this.hasMore = res.data.hasMore;
          this.totalCoupon = res.data.totalMoney;
         
          if(res.data.resultList.length == 0){
            this.nodata = true;
          }else{
            this.nodata =false;
          }
        }
      })
    },
    onLoad(){
      let _this = this;  
      setTimeout(() => {
          if( _this.hasMore !== undefined){
            let cYear = this.dates2.split("年")[0];
            let cMonth = this.dates2.split("月")[0].split("年")[1];
            let ctDay;
            //如果大于10就不加0;
            if(cMonth>10){
              ctDay =cYear +"-"+cMonth;
            }else{
              ctDay = cYear +"-0"+cMonth;
            }

            let params = {
              uid:_this.uid+ "",
              type:"1",
              dates:ctDay,
              page:++_this.page,
              limit:10
            }
            _this.$http.post( "/newLzshApi/score/getScoreRecord", "data="+JSON.stringify(params),{
                  headers: {
                    'token':_this.token
                  },
            }).then(res=>{
              _this.CouponRecordList.push(...res.data.resultList);
              _this.hasMore = res.data.hasMore;
              // 加载状态结束
              _this.loading = false;
            })
          }else{
             _this.loading = false;
            _this.finished = true;
          }       
      }, 500);
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
          
           this.getCouponRecord()
        })
    }
  },
  components: {
    memnavbar
  },
}
</script>
<style scoped>
.order_list {
  color: #333;
}
.van-cell__value {
  position: absolute;
  right: 0.4rem;
}
.van-dropdown-menu {
  height: auto;
}
.van-dropdown-menu__title {
  font-size: 0.28rem;
}
.van-cell {
  font-size: 0.28rem;
}
.order-container {
  position: relative;
  background: #e5e4e4;
  padding: 0.2rem 0 0;
}
.order-list-desc {
  position: relative;
  background: #fff;
  height: 1.28rem;
  padding: 0.26rem;
  margin-bottom: 0.2rem;
}
.order-list-date {
  color: #333;
  font-size: 0.32rem;
  text-align: left;
  padding: 0 0.22rem;
  margin-bottom: 0.1rem;
}
.order-sale-buy {
  font-size: 0.25rem;
  color: #999;
  text-align: left;
  padding: 0 0.22rem;
  position: relative;
}
.order-sale-buy > span:first-child {
  margin-right: 0.3rem;
}
.sort-order {
  position: absolute;
  right: 0.1rem;
  top: 0rem;
}
.sort-order span {
  margin-right: 0.1rem;
}

.order-list-content {
  padding: 0 0.21rem;
  background: #fff;
}
.order-list-content ul li {
  position: relative;
  overflow: hidden;
  padding: 0.28rem 0;
  border-bottom: 0.01rem solid #ccc;
}
.order-list-content ul li:last-child {
  border-bottom: none;
}
.list-img {
  float: left;
  width: 0.83rem;
  height: 0.83rem;
  border-radius: 50%;
  margin: 0 0.19rem 0 0.14rem;
}
.list-img img {
  width: 0.83rem;
  height: 0.83rem;
}
.list-content {
  width: calc(100% - 2.1rem);
  float: left;
  position: relative;
  text-align: left;
}
.list-order-title {
  position: relative;
  font-size: 0.25rem;
  color: #333;
  overflow: hidden;
  width: 100%;
  display: block;
  margin-bottom: 0.2rem;
}
.list-order-time {
  position: relative;
  font-size: 0.21rem;
  color: #999;
  overflow: hidden;
}
.list-number {
  position: absolute;
  top: 50%;
  right: 0;
  width: 1.2rem;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
  color: #333;
  transform: translateY(-50%);
}
.van-picker__cancel,
.van-picker__confirm {
  color: #ff3636;
}
.mall-ads{
  color:#333;
  font-size: 0.4rem;
  line-height: 1rem;
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

</style>

