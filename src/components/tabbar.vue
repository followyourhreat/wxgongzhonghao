<template>
  <div class="tabbar">
    <Item txt="首页" mark="home" :sel="selected" @change="getVal">
      <img src="../assets/images/home-active.png" slot="activeImg">
      <img src="../assets/images/home.png" slot="normalImg">
    </Item>
    <Item txt="团队" mark="team" :sel="selected" @change="getVal">
      <img src="../assets/images/team-active.png" slot="activeImg">
      <img src="../assets/images/team.png" slot="normalImg">
    </Item>
   
    <Item txt="我的" mark="mine" :sel="selected" @change="getVal">
      <img src="../assets/images/mine-active.png" slot="activeImg">
      <img src="../assets/images/mine.png" slot="normalImg">
    </Item>
  </div>
</template>

<script>
import Item from "./item";
// import Home from '../pages/Home/home'

export default {
  name: "Tabbar",
  components: {
    Item
  },
  data: function() {
    return {
      selected: ""
    };
  },
  mounted() {
    let hashUrl = this.$route.name;
    this.getVal(hashUrl);
  },
  methods: {
    getVal: function(val) {
      this.selected = val;
      console.log(val);
    }
  }
};
</script>

<style scoped>
.tabbar {
  width: 100%;
  height: auto;
  border-top: 0.01rem solid #ccc;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
}
</style>
