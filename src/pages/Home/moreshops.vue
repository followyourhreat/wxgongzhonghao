<template>
  <div class="shops-body">
    <div class="search-body">
      <!-- <div class="go_back" @click="goBack()" >
        <img src="../../assets/images/backarrow.png">
      </div>-->
      <div
        class="van-icon van-icon-arrow-left van-nav-bar__arrow"
        style="position:absolute;left:0.16rem;top:0.34rem;color:#FD3636;"
        @click="goBack()"
      ></div>
      <!-- <form action="/"> -->
      <van-search
        v-model="params.keyword"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        @blur="onBlur"
        @clear="onClear"
        @keypress="onKeyPress"
      >
        <!-- </form> -->
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <div class="normalmall-container2" v-show="showList">
        <div class="mall-list2" v-for="item in shopsInfo" :key="item.key">
          <div class="mall-image">
            <img src="../../assets/images/food1.png" alt>
            <!-- <span>New</span> -->
          </div>
          <div class="mall-content">
            <div class="mall-noramal-title">{{item.title}}</div>
            <div class="mall-noramal-tag">
              <span>{{item.tags}}</span>
              <span>
                <img src="../../assets/images/ic_location.png" alt>
                距离{{distant}}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <div class="normall-nshop" v-show="noShop">

      暂无店铺
    </div>

    <div class="search_list" v-show="showItems">
      <ul class="result-ul">
        <li>
          <span class="s_title">热门搜索</span>
        </li>
        <li class="s_cell">
          <a href="#">
            <span>利达众餐厅</span>
          </a>
          <a href="#">
            <span>麻辣烫</span>
          </a>
          <a href="#">
            <span>快餐店</span>
          </a>
          <a href="#">
            <span>蛋糕</span>
          </a>
        </li>
        <li class="s_cell">
          <a href="#">
            <span>水果</span>
          </a>
          <a href="#">
            <span>东北饺子馆</span>
          </a>
          <a href="#">
            <span>美甲</span>
          </a>
          <a href="#">
            <span>百果园</span>
          </a>
        </li>
      </ul>
    </div>
    <van-loading type="spinner" color="#FF3B30" v-show="loadingShow"/>
    <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bd-map"></baidu-map>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        keyword: ""
      },
      showList: true,
      showItems: false,
      value: "",
      center: { lng: 0, lat: 0 },
      zoom: 3,
      item: {
        lng: 110,
        lat: 30
      }, //目标位置
      curLocation: {
        lng: "",
        lat: ""
      }, //当前位置 目前是浏览器定位
      distant: "",
      shopsInfo: [], //店铺列表
      loadingShow: false, //加载中
      noShop: false, //无店铺
      loading: false, //滚动到底部
      finished: false, //判断数据是否全部加载完毕
      page: 1, //默认第一页
      total: "", //附近店铺总数
      size: 10 //每页显示个数
    };
  },
  methods: {
    onFocus() {
      console.log("12323");
      this.showList = false;
      this.noShop = false;
      this.showItems = true;
    },
    onBlur() {},
    onSearch() {
      this.showList = true;
      this.showItems = false;
      this.noShop = false;
      this.shopsInfo = [];
      this.getShopsInfo();
    },
    onKeyPress() {
      this.showItems = true;
    },
    onCancel() {
      // this.showItems = true;
      //    this.searStatus = this.searStatus === 0 ? 1 : 0 ;
    },
    onClear() {
      this.showList = true;
    },
    goBack() {
      this.$router.go(-1);
    },
    //地图初始化  获取当前经纬度
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
            //获取店铺信息
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
    //获取附近店铺信息
    getShopsInfo() {
      this.loadingShow = true;
      let params = {
        location:this.curLocation.lng+","+this.curLocation.lat+"",
        // location: "113.95067244858,22.549869237594", //测试数据
        page: this.page + "",
        size: this.size + "",
        shopName: this.params.keyword
      };
      this.$http
        .post(
          "/newLzshApi/shopInfo/getNearbyShopInfo",
          "data=" + JSON.stringify(params)
        )
        .then(res => {
          this.loadingShow = false;
          if (res.data.contents.length > 0) {
            this.shopsInfo = res.data.contents;
            this.total = res.data.total;
          } else {
            this.noShop = true;
          }
        });
    },
    //下拉加载
    onLoad() {
      let _this = this;
      setTimeout(() => {
        if (_this.size * _this.page < _this.total) {
          let params = {
            // location:this.curLocation.lng+","+this.curLocation.lat+"",
            location: "113.95067244858,22.549869237594", //测试数据
            page: _this.page++ + "",
            size: _this.size + "",
            shopName: _this.params.keyword
          };
          _this.$http
            .post(
              "/newLzshApi/shopInfo/getNearbyShopInfo",
              "data=" + JSON.stringify(params)
            )
            .then(res => {
              _this.shopsInfo.push(...res.data.contents);
              // 加载状态结束

              _this.loading = false;
            });
        } else {
          _this.loading = false;
          _this.finished = true;
        }
      }, 500);
    }
  }
};
</script>
<style scoped>
.van-search {
  margin-bottom: 0.35rem;
  width: 95%;
  float: right;
}
.search-body {
  position: relative;
  overflow: hidden;
}
.go_back {
  position: absolute;
  top: -0.1rem;
  left: 0.1rem;
  display: flex;
  height: 1.08rem;
  justify-content: center;
  align-items: center;
}
.go_back > img {
  width: 0.22rem;
  height: 0.38rem;
  transform: translateY(15%);
}
.normalmall-container2 {
  position: relative;
  overflow: hidden;
  background: #e3e3e3;
  padding-top: 0.16rem;
}
.mall-list2 {
  position: relative;

  border-bottom: 0.05rem solid #e3e3e3;
  padding: 0.25rem 0.5rem;
  overflow: hidden;
  background: #fff;
}
.mall-list2:last-child {
  border-bottom: none;
}
.mall-noramal-tag img {
  width: 0.2rem;
  height: 0.26rem;
  display: block;
  float: left;
  margin-right: 0.1rem;
}
.mall-noramal-tag {
  margin-top: 0.2rem;
}
.search_list {
  position: relative;
  font-size: 0.28rem;
  color: #868686;
  text-align: left;
  padding: 0 0.3rem;
}
.result-ul > li:nth-child(2) {
  position: relative;
  margin-top: 0.6rem;
  overflow: hidden;
}
.result-ul > li.s_cell a {
  display: block;
  float: left;
  color: #999;
  padding: 0.1rem 0.24rem;
  background: #e1e1e1;
  margin-right: 0.3rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  border-radius: 0.1rem;
}
.normall-nshop {
  color: #333;
  font-size: 0.4rem;
  line-height: 1rem;
}
</style>


