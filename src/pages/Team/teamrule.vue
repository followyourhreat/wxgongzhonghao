<template>
  <div class="teamrule-body">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <van-tabs @click="onClick">
      <van-tab title="奖励说明">
        <div class="teamrule-box">
          <span>消费券</span>
          <p>由用户推荐的直推用户和间推用户消费的现金部分产生， 赠送比例为直推1%、间推0.1%</p>
        </div>
        <div class="teamrule-box">
          <span>商家数</span>
          <p>由用户推荐的直推用户和间推用户消费的现金部分产生， 赠送比例为直推1%、间推0.1%</p>
        </div>
      </van-tab>
      <van-tab title="团队说明">
        <div class="teamrule-box">
          <span>用户数</span>
          <p>推荐成功的用户总数，此处不分直推和间推，用户只要注 册成功，商家只要入驻（通过审批）成功，即可计算。</p>
        </div>
        <div class="teamrule-box">
          <span>商家数</span>
          <p>推荐成功的商家总数，此处不分直推和间推，用户只要注 册成功，商家只要入驻（通过审批）成功，即可计算。</p>
        </div>
        <div class="teamrule-box">
          <span>商家数</span>
          <p>指直推用户的消费及直推用户的线上推荐两个动作，此处 不计算两个动作的执行总数，只计算是否有这两个动作， 每个动作只要动</p>
        </div>
        <div class="teamrule-box">
          <span>商家数</span>
          <p>商家的消费、收款、线上推荐的三个动作，计算方式与用户 活跃度一致，每个动作只要动作成功即为1，如只有一个动 作成功则即</p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "我的团队"
    };
  },
  components: {
    Memnavbar
  },
  methods: {
    onClick(index, title) {
      this.$toast(title);
    }
  }
};
</script>
<style scoped>
.teamrule-body {
  position: relative;
}
.teamrule-box {
  width: 100%;
  border-bottom: 0.01rem solid #ccc;
  font-size: 0.31rem;
  padding: 0.24rem 0.31rem;
}
.teamrule-box span {
  display: block;
  text-align: left;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.teamrule-box p {
  margin: 0;
  padding: 0;
  line-height: 0.4rem;
  font-size: 0.26rem;
  text-align: left;
  color: #666;
}
.van-tabs__content {
  margin-top: 0.15rem;
  overflow: hidden;
  position: relative;
}
</style>
