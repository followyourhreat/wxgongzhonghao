<template>
  <div>
    <Memnavbar :pageTitle="title"></Memnavbar>
    <p class="inte_title">积分如何获取</p>
    <p class="inte_conte">一:用户消费成功，用户所得积分比例为消费中现金部分的1.5%。</p>
    <p class="inte_conte">二:推荐的用户消费成功，用户所得积分比例为被推荐用户消费中现金部分的1%。</p>
    <p class="inte_conte">三:被推荐的用户再次推荐用户消费成功，用户所得的积分比例为再次推荐用户消费中现金部分的0.1%。</p>
    <p class="inte_title">积分奖励规则(消费券可在与利达众合作商家中支付时抵扣)</p>
    <p class="inte_conte">100积分奖励利达众消费券¥10</p>
    <p class="inte_conte">200积分奖励利达众消费券¥20</p>
    <p class="inte_conte">500积分奖励利达众消费券¥50</p>
    <p class="inte_conte">1000积分奖励利达众消费券¥150</p>
    <p class="inte_conte">5000积分奖励利达众消费券¥1000</p>
    <p class="inte_conte">10000积分奖励利达众消费券¥3000</p>
    <p class="inte_conte">120000积分奖励利达众消费券¥50000</p>
    <p class="inte_title">积分的有效时间</p>
    <p class="inte_conte">积分获取后系统自动计入用户账号的积分池进行累积，积分池累积至12W分且用户领取积分奖励后，积分中的12W分随即清掉，积分池开始下一轮累积。</p>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "积分说明"
    };
  },
  components: {
    Memnavbar
  }
};
</script>
<style lang="stylus">
.inte_title {
    width: 100%;
    font-size: 0.3rem;
    text-align: left;
    margin: 0.2rem auto;
    border-top: 0.01rem solid #ccc;
    border-bottom: 0.01rem solid #ccc;
    padding: 0.15rem;
    padding-left: 0.29rem;
    color:#333;
}
.inte_title:nth-child(2){
  margin-top:0;
  border-top:none;
}
.inte_conte {
  width: 100%;
    font-size: 0.26rem;
   
    color: #666;
    text-align: left;
    padding: 0.09rem 0.3rem;
}
</style>

