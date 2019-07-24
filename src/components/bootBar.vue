<template>
  <div class="bootBar">
    <van-tabbar v-model="active" @change="toggleTab">
      <van-tabbar-item replace to="/home">
        <span>首页</span>
        <img slot="icon" slot-scope="props" :src="props.active ? home.normal : home.active">
      </van-tabbar-item>
      <van-tabbar-item replace to="/team">
        <span>我的团队</span>
        <img slot="icon" slot-scope="props" :src="props.active ? team.active : team.normal">
      </van-tabbar-item>
      <van-tabbar-item replace to="/counpon">
        <span>优惠券</span>
        <img slot="icon" slot-scope="props" :src="props.active ? counpon.active : counpon.normal">
      </van-tabbar-item>
      <van-tabbar-item replace to="/mine">
        <span>我的</span>
        <img slot="icon" slot-scope="props" :src="props.active ? mine.active : mine.normal">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      home: {
        normal: "/static/home.png",
        active: "/static/home-active.png"
      },
      team: {
        normal: "/static/team.png",
        active: "/static/team-active.png"
      },
      counpon: {
        normal: "/static/counpon-normal.png",
        active: "/static/counpon-active.png"
      },
      mine: {
        normal: "/static/mine.png",
        active: "/static/mine-active.png"
      }
    };
  },
  methods: {
    toggleTab(value) {
      console.log(value);
    }
  }
};
</script>

