<template>
  <div class="apply-body" v-html="apply">{{apply}}</div>
</template>
<script>
export default {
  data() {
    return {
      apply: ""
    };
  },
  mounted() {
    console.log("1111");
    let form = this.$router.query.html;
    console.log(form);
    this.apply = form;
    this.$nextTick(() => {
      document.form[0].submit();
    });
  }
};
</script>

