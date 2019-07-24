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
          <span>支出￥{{sumOrderMoney}}</span>
          <!-- <span>收入￥0</span> -->
          <!-- <div class="sort-order">
            <van-dropdown-menu active-color="#FF3636">
              <van-dropdown-item v-model="value1" :options="option1"/>
            </van-dropdown-menu>
          </div> -->
        </div>
      </div>

      <div class="order-list-content">
        <div class="order-list-nodata" v-show="nodata">
          <img src="../../assets/images/nodata.png" alt="">
          <span>暂无数据</span>
        </div>
        <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
        <ul>
          <li class="list-box" @click="viewOrderDetail(item.order_no)" v-for="item in userOrderInfoList" :key="item.index">
            <div class="list-img">
              <img src="../../assets/images/ic_tab_status_active.png" alt>
            </div>
            <div class="list-content">
              <div class="list-order-title">{{item.shopName}}</div>
              <div class="list-order-time">{{item.created_time | fixDate}}</div>
            </div>
            <div class="list-number">-{{item.order_money}}</div>
          </li>
        </ul>
         </van-list>

      </div>
    </div>
    <van-popup v-model="show" position="bottom">
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
</template>
<script>
import memnavbar from "../../components/memnavbar";
export default {
  name: "orderList",
  data() {
    return {
      show: false,
      title: "我的账单",
      value1: 0,
      option1: [
        { text: "全部账单", value: 0 },
        { text: "个人账单", value: 1 },
        { text: "商家账单", value: 2 }
      ],
      minDate:new Date(1950, 1, 1),
      currentDate: new Date(),
      dates:new Date().toLocaleDateString().replace(/\//g,"-").substring(0,6),
      dateParams:new Date().toLocaleDateString().replace(/\//g,"-").substring(0,10),
      date2:"",
      uid:"",//登录用户id
      loading:false,//滚动到底部
      finished:false,//判断数据是否全部加载完毕
      page:1,//默认第一页
      token:"",
      userOrderInfoList:[],//用户订单列表
      currentPage:"1",//普通分页
      onLoadPage:"1",//加载更多的分页
      conFirmPage:"1",//日期选择分页
      pageSize:"10",
      checkList:[],//查看分页是否有值
      sumOrderMoney:"",//支出
      loadingShow:false,//加载中
      nodata:false,
    };
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    },
    fixMonth(val){
      if(val.length>7){
        let valArr = val.split("-");
        valArr.splice(1,0,"年");
        valArr.splice(3,0,"月");
        let newVal =valArr.join("")+"日";
        return newVal;
      }else{
        let newVal = val.replace(/\-/g,"年")+"月";
        return newVal;
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
      // this.uid = 4;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getUserOrderInfoList();

  },
  methods: {
    //获取用户订单列表
    getUserOrderInfoList(){
     
        this.loadingShow = true;
        this.token = sessionStorage.getItem("redisTokenKey");
        let params = {
          uid:this.uid,
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          searchDate:""
        }
        this.$http.post("/newLzshApi/order/getOrderInfoList","data=" + JSON.stringify(params),{
          headers:{
            token:this.token
          }
        }).then(res=>{
          if(res.code == '121'){
            this.autoLogin()
          }else{
            this.userOrderInfoList = res.data.userOrderInfoList;
            this.checkList = res.data.userOrderInfoList;
            this.sumOrderMoney = res.data.sumOrderMoney;
            this.loadingShow = false;
            if(res.data.userOrderInfoList.length == 0){
              this.nodata = true;
            }else{
              this.nodata =false;
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
      }else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    handleConfirm(value) {
      this.show = false;
      let valTime=""
      let valArr=""
      let currentDay="" 
      let selectTime=""
      // if(value.getMonth()+1 < 10){
      //   valTime = value.toLocaleDateString().replace(/\//g,"-").substring(0,9);
      //   valArr = valTime.split("");
       
      //   selectTime = valArr.join("");
      //   this.dates = selectTime;
      //   console.log(this.dates);
      // }else{
      //   valTime = value.toLocaleDateString().replace(/\//g,"-").substring(0,9);
      //   valArr = valTime.split("");
      //   selectTime = valArr.join("");
      //   this.dates = selectTime;
      //   console.log(this.dates);
      // }

      let dYear = value.getFullYear();
      let dMonth = value.getMonth()+1;
      let aDate = value.getDate();

      // selectTime = dYear+dMonth;
    
      if(dMonth>10){
        this.dates2 = dYear+"年"+ dMonth+"月"+aDate+"日";
        selectTime = dYear+"-"+dMonth+"-"+aDate;
      }else{
        this.dates2 = dYear+"年"+ dMonth+"月"+aDate+"日";
        selectTime = dYear+"-0"+dMonth+"-"+aDate;
      }



      this.loadingShow = true;
        let params = {
          uid:this.uid,
          currentPage:this.conFirmPage,
          pageSize:this.pageSize,
          searchDate:selectTime
        }
        this.$http.post("/newLzshApi/order/getOrderInfoList","data=" + JSON.stringify(params),{
          headers:{
            token:this.token
          }
        }).then(res=>{
          if(res.code == '121'){
            this.autoLogin()
          }else{
            this.userOrderInfoList = res.data.userOrderInfoList;
            this.checkList = res.data.userOrderInfoList;
            this.onLoadPage = "1";
            this.loadingShow = false;
            this.sumOrderMoney = res.data.sumOrderMoney;
            if(res.data.userOrderInfoList.length == 0){
              this.nodata = true;
            }else{
              this.nodata =false;
            }
           


          }
          

        })
      







    },
    handleCancel() {
      this.show = false;
    },
    showPopup() {
      this.show = true;
    },
    viewOrderDetail(billNO){
        this.$router.push({path:"/order-detail",query:{
          orderNo:billNO
        }});
    },
    //加载更多
    onLoad(){
      let _this = this;  
      setTimeout(() => {
          if( _this.checkList.length >= _this.pageSize){
           
            // console.log();
            // if(_this.dates.length<=7){
            //   _this.dateParams = ""; 
            // }else{
            //   _this.dateParams = new Date().toLocaleDateString().replace(/\//g,"-").substring(0,10); 
            // }
            let cYear = this.dates2.split("年")[0];
            let cMonth = this.dates2.split("月")[0].split("年")[1];
            let cDate = this.dates2.split("日")[0].split("月")[1];;
            let ctDay;
            if(cMonth>10){
              ctDay =  cYear +"-"+cMonth +"-"+ cDate;
            }else{
              ctDay =  cYear +"-0"+cMonth +"-"+cDate;
            }

        
            let params = {
              uid:_this.uid,
              currentPage:++_this.onLoadPage,
              pageSize:_this.pageSize,
              searchDate:ctDay
            }
            _this.$http.post( "/newLzshApi/order/getOrderInfoList", "data="+JSON.stringify(params),{
                  headers: {
                    'token':_this.token
                  },
            }).then(res=>{
              _this.checkList = res.data.userOrderInfoList
              _this.userOrderInfoList.push(...res.data.userOrderInfoList);
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
          
          this.getUserOrderInfoList();
        })
    }



  },
  components: {
    memnavbar
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

