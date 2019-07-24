<template>
  <div class="getCounpon-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <span>通过你的努力，获得利达众平台奖励的消费券￥15</span>
    <van-button type="default" @click="getCounponDetail">查看详情</van-button>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "消费券"
    };
  },
  methods: {
    getCounponDetail() {
      this.$router.push({ path: "/counpon/csmCounponDetail" });
    }
  },
  components: {
    Memnavbar
  }
};
</script>

