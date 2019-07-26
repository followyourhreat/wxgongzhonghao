<template>
  <div class="receiveList-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="order-container">
      <div class="order-list-desc">
        <div class="order-list-date">
          <span>{{ dates2 }}</span>

          <van-icon name="arrow-down" @click="showPopup"/>
        </div>
        <div class="order-sale-buy">
          <span>支出￥{{totalPay}}</span>
        
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
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">消费券领取-来自积分兑换</div>
              <div class="list-order-time">{{item.crtTime}}</div>
            </div>
            <div class="list-number">-{{item.money}}</div>
          </li>
          
        </ul>
        </van-list>
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
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "消费券使用",
      show: false,
      value1: 0,
      option1: [
        { text: "全部账单", value: 0 },
        { text: "个人账单", value: 1 },
        { text: "商家账单", value: 2 }
      ],
      minHour: 10,
      maxHour: 20,
      currentDate: new Date(),
      uid:"",
      token:"",
      dates:new Date().toLocaleDateString().replace(/\//g,"-").substring(0,6),
      dates2:"",
      page:1,
      CouponRecordList:[],
      totalPay:"",
      loading:false,//滚动到底部
      finished:false,//判断数据是否全部加载完毕
      hasMore:"",//是否有更多
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
    fixMonth(val){
      let newVal = val.replace(/\-/g,"年")+"月";
      return newVal;
    } 
  },
  mounted(){
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
      //没有uid应该提示去登录  此处为了本地测试先放uid= 
      console.log("本地测试");
      this.uid = 3;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getCouponRecord();
  },
  methods: {
    getCouponRecord(){
      this.token = sessionStorage.getItem("redisTokenKey");
      // let arr = this.dates.split("");
      // let currentDay = arr.splice(5,0,"0");
      // let ctDay = arr.join("")
      // console.log(ctDay);
      // this.dates = ctDay;
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
      this.$http.post( "/newLzshApi/coupon/getCouponRecord", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        if(res.code == "121"){
          this.autoLogin()
        }else{
          this.totalPay = res.data.totalCoupon;
          this.CouponRecordList = res.data.resultList;
          this.hasMore = res.data.hasMore;
          if(res.data.resultList.length == 0){
            this.nodata = true;
          }else{
            this.nodata = false;
          }
        }
        
      })
    },

    onClickLeft() {},
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
    },
    handleCancel() {
      this.show = false;
    },
    showPopup() {
      this.show = true;
    },
    onLoad(){
      let _this = this;  
      setTimeout(() => {
          if( _this.hasMore !== undefined){
            // let arr = _this.dates.split("");
            // let currentDay = arr.splice(5,0,"");
            // let ctDay = arr.join("");
            // // let nextPage = _this.page++;
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
              type:"2",
              dates:ctDay,
              page:++_this.page,
              limit:10
            }
            _this.$http.post( "/newLzshApi/coupon/getCouponRecord", "data="+JSON.stringify(params),{
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
    //时间筛选
    handleConfirm(value) {
      console.log(value);
      this.show = false;
      console.log(value.getMonth()+1);
      let valTime=""
      let valArr=""
      let currentDay="" 
      let selectTime=""
  
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
        type:"2",
        dates:selectTime,
        page:1,
        limit:10
      }
      this.$http.post( "/newLzshApi/coupon/getCouponRecord", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.totalPay = res.data.totalCoupon;
        this.CouponRecordList = res.data.resultList;
        if(res.data.resultList.length == 0){
          this.nodata = true;
        }else{
          this.nodata = false;
        }
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
       
          this.getCouponRecord()
        })
    }


  }
};
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

