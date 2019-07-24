<template>
  <div class="receiveList-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="order-container">
      <div class="order-list-desc">
        <div class="order-list-date">
          <span>{{dates2}}</span>
          <van-icon name="arrow-down" @click="showPopup"/>
        </div>
        <div class="order-sale-buy">
          <span>积分:{{totalMoney}}</span>
          <!-- <div class="sort-order">
                        <van-dropdown-menu active-color="#FF3636">
                            <van-dropdown-item v-model="value1" :options="option1" />
                        </van-dropdown-menu>
                      
          </div>-->
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
            <li class="list-box" v-for="item in scoreLogList" :key="item.index">
              <div class="list-img">
                <img src="../../assets/images/ic_integer.png" alt>
              </div>
              <div class="list-content">
                <div class="list-order-title">消费积分-来自{{item.userName}}</div>
                <div class="list-order-time">{{item.crtTime | fixDate}}</div>
              </div>
              <div class="list-number">+{{item.score}}</div>
            </li>
          </ul>
        </van-list>
      </div>
      <van-loading type="spinner" color="#ff3636" v-show="loadingShow" />
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
      title: "我的积分",
       token:"bc1d578c323e3fc5044ca46e1c743691",//查询用户积分的token
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
      dates:new Date().toLocaleDateString().replace(/\//g,"-").substring(0,6),
      dates2:"",
      uid:"",//登录用户id
      totalMoney:"",//当月积分总额
      scoreLogList:[],//积分列表
      loading:false,//滚动到底部
      finished:false,//判断数据是否全部加载完毕
      page:1,//默认第一页
      hasMore:"",//是否有更多
      loadingShow:false,//加载中
      nodata:false,
    };
  },
  components: {
    Memnavbar
  },
  created(){
    
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
      //没有uid应该提示去登录  此处为了本地测试先放uid= 3
      console.log("本地测试");
      // this.uid = 170;
    }
    this.token = sessionStorage.getItem("redisTokenKey");
    this.getIntegralLog();
   
  },
  filters:{
    fixDate(val){
      let newVal = val.substring(5);
      return newVal;
    },
    fixMonth(val){
      var ua = navigator.userAgent.toLowerCase();
      var result = /micromessenger/.test(ua) ? true : false;
      if(result){
        let newVal = val.replace(/\-/g,"年")+"月";
        return newVal;
      }else{
        return val;
      }
      
    } 
  },
  methods: {
     //获取积分记录
    getIntegralLog(){
      this.token = sessionStorage.getItem("redisTokenKey");
      this.loadingShow = true;
      
      // let arr = this.dates.split("");
      // let currentDay = arr.splice(5,0,"0");
      // let ctDay = arr.join("")
      // this.dates = ctDay;
      let cYear = this.dates2.split("年")[0];
      let cMonth = this.dates2.split("月")[0].split("年")[1];
      let ctDay;
      //如果大于10就不加0;
      // if(cMonth>10){
      //   ctDay =cYear +"-"+cMonth;
      // }else{
      //   ctDay = cYear +"-0"+cMonth;
      // }
      if(cMonth>10){
        ctDay =  cYear +"-"+cMonth;
      }else{
         ctDay =  cYear +"-0"+cMonth;
      }
      
      let params = {
        uid:this.uid+ "",
        type:"1",
        dates:ctDay,
        page:this.page,
        limit:10
      }
      this.$http.post( "/newLzshApi/score/getScoreRecord", "data="+JSON.stringify(params),{
        headers: {
          'token':this.token
        },
      }).then(res=>{
        this.loadingShow = false;
        if(res.code == "121"){
          this.autoLogin()
        }else{
          this.totalMoney = res.data.totalMoney;
          this.scoreLogList = res.data.resultList;
          if(res.data.resultList.length == 0){
            this.nodata = true;
          }
          this.hasMore = res.data.hasMore;
          console.log(this.hasMore);
        }
        
        // this.scoreList = res.data.resultList;
      })
    },
    //加载更多
    onLoad(){
      let _this = this;  
      setTimeout(() => {
          if( _this.hasMore !== undefined){
            // let arr;
            // let ctDay;
            // var ua = navigator.userAgent.toLowerCase();
            // var result = /micromessenger/.test(ua) ? true : false;
            // if(result){
            //   ctDay = _this.dates;
            // }else{
            //   arr = _this.dates.split("");
            //   // let currentDay = arr.splice(5,0,"0");
            //   ctDay = arr.join("");
            //   // let nextPage = _this.page++;
            // }
            
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
              _this.scoreLogList.push(...res.data.resultList);
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
      this.show = false;
      console.log(value);
      let valTime="";
      let valArr="";
      let currentDay="";
      let selectTime="";
      // var ua = navigator.userAgent.toLowerCase();
      // var result = /micromessenger/.test(ua) ? true : false;
      // if(result){
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
      // }else{
      //   selectTime = this.dates;
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
        this.totalMoney = res.data.totalMoney;
        this.scoreLogList = res.data.resultList;
        if(res.data.resultList.length == 0){
          this.nodata = true;
        }else{
          this.nodata =false;
        }
        this.hasMore = res.data.hasMore;

      })



    },
    handleCancel() {
      this.show = false;
    },
    showPopup() {
      this.show = true;
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
          
          this.getIntegralLog();
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

