<template>
  <div class="itemWrap" @click="fn">
    <span v-show="bol">
      <slot name="activeImg"></slot>
    </span>
    <span v-show="!bol">
      <slot name="normalImg"></slot>
    </span>
    <span :class="{active: bol}">{{txt}}</span>
  </div>
</template>

<script>
export default {
  name: "item",
  props: ["txt", "mark", "sel"],
  computed: {
    bol: function() {
      if (this.mark === this.sel) {
        return true;
      }
      return false;
    }
  },
  methods: {
    fn: function() {
      this.$emit("change", this.mark);
      if (this.mark == "counpon") {
        this.$toast("敬请期待");
        return;
      } else {
        this.$router.push("/" + this.mark);
      }
    }
  }
};
</script>

<style scoped>
.itemWrap {
  width: 33.3%;
  float: left;
  text-align: center;
  height: auto;
  padding: 0.2rem 0;
}

.itemWrap img {
  display: block;
  margin: auto;
}
.itemWrap:nth-child(1) img {
  width: 0.47rem;
  height: 0.42rem;
}
.itemWrap:nth-child(2) img {
  width: 0.47rem;
  height: 0.42rem;
}
.itemWrap:nth-child(3) img {
  width: 0.4rem;
  height: 0.4rem;
}
.itemWrap:nth-child(4) img {
  width: 0.38rem;
  height: 0.41rem;
}

.itemWrap span {
  font-size: 0.2rem;
  color: #666;
  display: block;
  text-align: center;
}

.itemWrap .active {
  color: #d6131b;
}
</style>
