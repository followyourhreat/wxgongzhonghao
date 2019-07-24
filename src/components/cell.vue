<template>
  <div class="cell_wrap" :class="{hots:hots}" @click="memPagesRouter()">
    <div class="cell-div">
      <span>
        <slot name="show"></slot>
      </span>
      {{title}}
    </div>
    <div>
      <slot name="cell-right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    hots: {
      type: Boolean,
      default: false
    },
    memberRoute: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // memberRoutes:this.memberRoute
    };
  },
  methods: {
    memPagesRouter() {
      console.log(this.memberRoute);
      this.$router.push({ path: this.memberRoute });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cell_wrap {
  position: relative;
  height: 1.09rem;
  border-bottom: 1px solid #dddddd;
  box-shadow: 0px -2px 6px #fafdf8;
  line-height: 1.09rem;
 
  text-align: left;
  font-size: 0.31rem;
  font-weight: 400;
  color: #666;
  .cell-div{
    position relative
    padding-left:1.01rem;
  }
}

.cell_img {
    width: 0.49rem;
  height: 0.49rem;
  position: absolute;
  top: 50%;
  left: 0.22rem;
  transform: translateY(-50%);
}

.cell_right_img {
  width: 0.46rem;
  height: 0.46rem;
  position: absolute;
  top: 50%;
  right: 0.16rem;
  transform: translateY(-50%);
}

.hots {
  border-bottom: none;

  &:after {
    content: '';
    width: 5px;
    height: 20px;
    background: orange;
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 0px;
  }
}
</style>
