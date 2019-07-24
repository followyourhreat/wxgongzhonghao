<template>
  <div class="search-body">
    <div class="go_back" @click="goBack()">
      <img src="../assets/images/backarrow.png">
    </div>
    <!-- <form action="/"> -->
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
      @cancel="onCancel"
    >
      <!-- </form> -->
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
  </div>
</template>
<script>
import Moreshops from "../pages/Home/moreshops";
export default {
  data() {
    return {
      value: "",
      searStatus: 1
    };
  },
  methods: {
    onSearch() {},
    onCancel() {
      //    this.searStatus = this.searStatus === 0 ? 1 : 0 ;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="stylus">
</style>
