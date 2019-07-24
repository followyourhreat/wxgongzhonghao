<template>
  <div class="guide-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="guide-content">
      <img src="../../assets/images/guide1.jpg" alt="">
      <img src="../../assets/images/guide2.jpg" alt="">
      <img src="../../assets/images/guide3.jpg" alt="">
      <img src="../../assets/images/guide4.jpg" alt="">
    </div>
  </div>
  
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "新手指南"
    };
  },
  components: {
    Memnavbar
  }
};
</script>
<style scoped>
.guide-content{
  position: relative;
}
.guide-content img{
  width:100%;
  height: auto;
  display: block;
}
</style>
