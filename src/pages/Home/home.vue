<template>
  <div class="index-home">
    <lzheader></lzheader>

    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in images" :key="index">
        <a :href="item.skip_url" alt="" title="">
           <img :src="item.img_path">
        </a>
      </van-swipe-item>
    </van-swipe>
    <van-notice-bar mode="link" color="#FF3333" left-icon="volume-o" v-show="noticeShow">
      <a href="#"> <span v-for="item in noticeList" :key="item.index">{{item.content}}</span></a>
    </van-notice-bar>
    <!-- <van-row type="flex" justify="center">
      <van-col span="6">span: 6</van-col>
      <van-col span="6">span: 6</van-col>
      <van-col span="6">span: 6</van-col>
    </van-row>-->
   
    <div class="category-brands">
      <ul>
        <li>
          <a @click="toIntegral">
            <img src="../../assets/images/integral.png" alt>
            <span>我的积分</span>
          </a>
        </li>
        <li>
          <a @click="toConsumerCounpon">
            <img src="../../assets/images/coupon.png" alt>
            <span>消费券</span>
          </a>
        </li>
        <li>
          <a @click="toService">
            <img src="../../assets/images/business.png" alt>
            <span>商家服务</span>
          </a>
        </li>
      </ul>
    </div>
     <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bd-map"></baidu-map>
    <div class="line-split">利达众商家</div>
    <div class="mall-recommend">
      <div class="recommend-header">
        <span>利达众推荐</span>
        <span @click="getMore">更多></span>
      </div>
      <div class="line"></div>
      <div class="recommendmall-list" >
        <div class="mall-box" v-for="item in bestList" :key="item.index">
          <!-- <span class="mall-tag-new"></span> -->
          <div class="mall-img">
            <img :src="item.cover" alt="">
          </div>
          <div class="mall-container">
            <div class="mall-title" >
              <span>{{item.name}}</span>
              
            </div>
            <div class="mall-tag">
              <span>{{item.categoryName}}</span>
            </div>
      
            <div class="mall-adress" >
              <i></i>
              <span>{{item.addr}}</span>
            </div>
          </div>
         
        </div>
     
      </div>
    </div>
    <div class="normalmall-container">
      <div class="mall-ads" v-if="noShop">
        本区域暂无店铺，敬请期待
      </div>
      <div class="mall-list" v-for="item in shopsInfo" :key="item.index">
        <div class="mall-image" >
          <img src="../../assets/images/food1.png" alt>
          <!-- <span></span> -->
        </div>
        <div class="mall-content">
          <div class="mall-noramal-title title-fix">
            <span>{{item.title}}</span>
            <span>{{item.tags}}</span>
          </div>
          <div class="mall-noramal-tag">
            <span>距离{{distant}}m</span>
          </div>
          <div class="mall-coup2">满30减10</div>
          <div class="mall-adress address-fix" >
            <i></i>
            <span>{{item.address | fixAddress}}</span>
          </div>
        </div>
      </div>
    
    </div>
    <van-loading type="spinner" color="#FF3B30"  v-show="loadingShow" />
    <!-- <bootBar></bootBar> -->
    <tabbar></tabbar>
  </div>
</template>

<script>
import axios from "axios";
import lzheader from "../../components/lzheader";
import banner1 from "../../assets/images/banner1.png";
import md5 from "js-md5";
import { mapGetters } from "vuex";
import BaiduMap from "vue-baidu-map/components/Map/Map.vue";
import bootBar from "../../components/bootBar";
import tabbar from "../../components/tabbar";
export default {
  name: "home",
  data() {
    return {
      code: "",
      appId:"",
      domain:"",//域名
      auth_code: "",
      uid:"",//用户id
      remember: true,
      users: {},
      aliUser: {},
      access_token: "",
      code: "",
      images: [],
      noticeList:[],//公告列表
      mapAddressList: {},
      address: "湖南省岳阳市岳阳楼区南湖街道758号",
      item: {
        lng: 110,
        lat: 30
      }, //目标位置
      center: { lng: 0, lat: 0 },
      zoom: 3,
      curLocation: {
        lng: "",
        lat: ""
      }, //当前位置 目前是浏览器定位
      distant: "",
      shopsInfo:[],//附近店铺信息,
      noShop:false,
      loadingShow:false,//加载中,
      userNotice:"",//用户公告
      bannerList:[],//banner
      noticeShow:true,
      bestList:[],//推荐位
      picUrlRelative:"",//图片文件夹
      picUrl:"",
    };
  },
  components: {
    lzheader,
    BaiduMap,
    bootBar,
    tabbar
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  filters:{
    fixAddress(val){
      if(val == null | val == undefined){
        return val = "暂无该店铺地址"
      }
    }
  },
  created(){
    //初始化信息
     this.getSystemInfo();
  },
  mounted() {
    console.log(sessionStorage.getItem("redisTokenKey"));
    //1.授权登录只在首页做   以缓存的shopid来区分  如果为空则走入支付  如果不为空  则判断是否有登录过  没登录过还需登录在跳回支付
    this.getBest();//推荐位
    this.getSilde(1,1);//获取轮播图
    this.getSilde(2,2);//获取公告
    
  },
  methods: {
   
    //获取用户信息
    wxGetUserInfo(params) {
      console.log("111");

    },
    toIntegral() {
      this.$router.push({ path: "integer" });
    },
    toConsumerCounpon() {
      this.$router.push({ path: "/cousumer-counpon" });
    },
    toService() {
      this.$toast("请到应用市场下载利达众生活app");
    },
    mapAddress() {
      this.$router.push({ path: "/map", query: { key: "深圳南山书城" } });
    },
    getMore() {
      this.$router.push({ path: "moreshops" });
    },
    handleDetail(curId) {
      this.$router.push({
        path: "/detail",
        query: { id: curId }
      });
    },
    //地图初始化  获取当前经纬度  以及一些店铺信息
    handler({ BMap, map }) {
      let _this = this;
      console.log(BMap);
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            // alert('您的位置：'+r.point.lng+','+r.point.lat);
            _this.curLocation.lng = r.point.lng;
            _this.curLocation.lat = r.point.lat;
            console.log(_this.curLocation);
            //获取附近店铺
            _this.getShopsInfo();
            //这里面也可以执行测距操作
            _this.distant = _this.getDistant(_this.item);
            console.log(_this.getDistant(_this.item));
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    //测距
    getDistant(item) {
      let mp = new BMap.Map("");
      let PointA = new BMap.Point(
        parseFloat(this.curLocation.lng),
        parseFloat(this.curLocation.lat)
      );
      let pointB = new BMap.Point(parseFloat(item.lng), parseFloat(item.lat));
      let distance = parseInt(
        (mp.getDistance(PointA, pointB) / 1000).toFixed(2)
      );

      return distance;
    },
    //跳转支付页面
    handlePay() {
      this.$router.push({ path: "/payment" });
    },
    //获取附近店铺信息
    getShopsInfo(){
      this.loadingShow = true;
      let params = {
        location:this.curLocation.lng+","+this.curLocation.lat+"",
        // location:"113.95067244858,22.549869237594",//测试数据
        page:0+"",
        size:10+"",
        shopName:""
      };
      this.$http.post("/newLzshApi/shopInfo/getNearbyShopInfo","data=" + JSON.stringify(params)).then(res=>{
       this.loadingShow = false;
        if(res.data.contents.length>0){
           this.shopsInfo = res.data.contents;
        }else{
          this.noShop = true;
        }
      })
    },
    //获取轮播图
    getSilde(codeType,markType){
      this.token = sessionStorage.getItem("redisTokenKey");
      let params = {
        appEnv:"0",
        code:codeType+"",
        mediaType:markType+"",
      }
      this.$http.post("/newLzshBusinessApi/banner/getBannerAndNoticeInfo","data=" + JSON.stringify(params),{
        headers:{
          token:this.token
        }
      }).then(res=>{
        if(res.code == "121"){
           let params ={
              uid:this.uid+""
            };
              this.$http
              .post(
                "/newLzshApi/userInfo/userAutoLoginByUid",
                "data=" + JSON.stringify(params),
                
              ).then(res=>{
              if(res.code == "150"){
                this.$toast("用户不存在");
                localStorage.clear();
                this.userReset(); 
              }else{
                  sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
                  this.getSilde(1,1);
                  this.getSilde(2,2);
              }
                
              })
        }else{
          if(codeType == 1){
            let imageList =  res.data.result;
            imageList.forEach(item=>{
              item.img_path = this.picUrl + item.img_path;
            })
            this.images = imageList;
          }else{
            if( res.data.result.length == 0){
              this.noticeShow = false;
            }else{
              this.userNotice = res.data.userNotice.replace(/"/g,"");
              this.noticeList = res.data.result;
            }
            
          }
        }
      })
    },
    //自动登录
    autoLogin(){
      if( localStorage.getItem("id") !== undefined && localStorage.getItem("id") !== null){
        this.uid = localStorage.getItem("id");
        
      }else{
        //没有uid应该提示去登录  此处为了本地测试先放uid= 22
        console.log("本地测试");
        // this.uid = 148;
      }
      let params ={
        uid:this.uid+""
      };
        this.$http
        .post(
          "/newLzshApi/userInfo/userAutoLoginByUid",
          "data=" + JSON.stringify(params),
          
        ).then(res=>{
         if(res.code == "150"){
           this.$toast("用户不存在");
          //  localStorage.clear();
           this.userReset(); 
         }else{

            sessionStorage.setItem("redisTokenKey", res.data.redisTokenKey);;
            this.getSilde(1,1);
            this.getSilde(2,2);
         }
          
        })
    },
    ///获取推荐位店铺
    getBest(){
      this.$http.post("/newLzshApi/shopInfo/getRecommendShopInfo").then(res=>{
        let newShopList = res.data.shopList;
        console.log(newShopList);
        console.log(this.picUrl);
        newShopList.forEach(item => {
          if(item.cover){
            item.cover =  this.picUrl + item.cover;
          }
        });
        this.bestList = newShopList;
        console.log(":12123");
        console.log(this.bestList);
      })
    }
  }
};
</script>

<style scoped>
.swiper-container {
  width: 7.5rem;
  height: 3rem;
}
.mall-ads{
  color:#333;
  font-size: 0.4rem;
  line-height: 1rem;
}
.mall-img{
  float: left;
  width: 0.98rem;
  height: 0.98;
}
.mall-img img{
  width:0.98rem;
  height: 0.98rem;
  display: block;
  float: left;
}
.mall-container{
  float: left;
  padding-left: 0.1rem;
  width: calc(100% - 1rem);
}
.mall-tag{
  text-align: left;
  font-size: 0.22rem;
}
.mall-box:nth-of-type(odd) .mall-tag{
  color:#2C709F;
}
.mall-box:nth-of-type(even) .mall-tag{
  color:#9D4432
}
</style>

