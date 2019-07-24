<template>
  <div class="map-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <van-cell-group>
      <van-field v-model="keyword" label="关键字"/>
      <van-field v-model="location" label="城市"/>
    </van-cell-group>
    <baidu-map @ready="handler">
      <bm-view class="map" center="深圳"></bm-view>
      <!-- <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location"></bm-local-search> -->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-marker :position="autoLocationPoint" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from "vue-baidu-map";
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "地图",
      start: "深圳比克科技大厦",
      end: "深大地铁站",
      location: "深圳",
      keyword: "深圳比克科技大厦",
      autoLocationPoint: ""
    };
  },
  components: {
    Memnavbar
  },
  created() {
    // let self = this;
    // self.getParams();
  },

  mounted() {
    console.log(this.$route.query.key);
    this.getParams();
  },
  methods: {
    handler({ BMap, map }) {
      const _this = this;
      console.log(BMap, map);
      var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //     console.log(r);
      //     _this.center =  {lng:r.longitude,lat:r.latitude};
      //     _this.autoLocationPoint = {lng:r.longitude,lat:r.latitude};
      //     _this.initLocation = true;
      //     console.log("center",_this.center);
      // },{enableHighAccurcy:true})
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            // alert('您的位置：'+r.point.lng+','+r.point.lat);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    getParams() {
      this.keyword = this.$route.query.key;
      console.log(this.keyword);
    }
  }
};
</script>
<style>
.map {
  position: relative;
  width: 100%;
  height: 6rem;
  overflow: hidden;
}
.map-body {
  position: relative;
  width: 100%;
}
.map-body label {
  font-size: 0.3rem;
  display: block;
  overflow: hidden;
  margin: 0.2rem auto;
}
.map-key,
.map-address {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 0.5rem;
  padding: 0 0.2rem;
}
.map-key span,
.map-address span {
  display: block;
  float: left;
  width: 1.2rem;
  text-align: left;
}
.map-key input,
.map-address input {
  display: block;
  float: left;
}
</style>

