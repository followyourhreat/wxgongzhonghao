<template>
  <div :class="{headerWrap:true, red:bol}">
    <div class="login-user">
      <div @click="togglePic">
        <img class="avatar" style="border:none;" src="../assets/images/logo.png">
      </div>

      <div class="Login-phone">
        <span>Weaster</span>
        <br>
        <Span class="phone">手机号：152***0014</Span>
      </div>
    </div>
    <img src="../assets/images/ic_news_white.png" @click="goMesCenter" class="leftImg">
    <img src="../assets/images/ic_settings.png" class="rightImg">
  </div>
</template>

<script>
export default {
  props: ["txt", "bol", "urlParams"],
  data() {
    return {};
  },
  methods: {
    goMesCenter() {
      console.log("222222");
      this.$router.push({ path: "/message-center" });
    },
    togglePic() {
      console.log("113232");
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.headerWrap {
  width: 100%;
  height: 154px;
  box-shadow: 0px -2px 16px #ea0f0f;
  background: #ea0f0f;
  text-align: center;
  line-height: 154px;
  position: relative;

  span {
    display: inline-block;
    font-size: 0.42rem;
    color: #fff;
    font-weight: 400;
    position: fixed;
    left: 2.12rem;
  }

  .phone {
    display: block;
    position: fixed;
    font-size: 0.28rem;
    color: #fff;
    top: 0.5rem;
  }

  .avatar {
    width: 1.51rem;
    height: 1.51rem;
    position: absolute;
    left: 0.38rem;
    top: 0.81rem;
    border-radius: 50%;
    background: rgb(250, 250, 250);
  }

  .Login-phone {
    display: block;
    width: 7rem;
    position: relative;
  }

  .rightImg {
    position: absolute;
    top: 0.56rem;
    right: 0.34rem;
    width: 0.46rem;
    height: 0.46rem;
  }

  .leftImg {
    position: absolute;
    top: 0.56rem;
    right: 1.53rem;
    width: 0.46rem;
    height: 0.46rem;
  }
}
</style>
