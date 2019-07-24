<template>
  <div class="mem-nav">
    <van-nav-bar
      :title="pageTitle"
      left-text
      right-text
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>
<script>
export default {
  props: {
    pageTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      console.log("右边");
    }
  }
};
</script>
<style scoped>
.van-nav-bar {
  background: #f7f7f8;
  color: #000;
}
.van-nav-bar .van-icon {
  color: #ff3333;
}
.van-nav-bar__title {
  color: #000;
  font-size: 0.32rem;
}
</style>
