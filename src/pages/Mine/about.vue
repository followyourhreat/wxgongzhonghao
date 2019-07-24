<template>
  <div class="cont-text">
    <Memnavbar :pageTitle="title"></Memnavbar>
    <div class="content_desc">
      <!-- <img src="../../assets/images/about.png" /> -->
      <p >利达众</p>
      <p class="title">利人利己利达众  精明生活更金彩</p>
      <p>利达众出生于深圳英乾科技，是大众消费者和实体商家必备的有利武器。</p>
      <p class="sub-title">利达众——用户生活省钱、捞金的法宝</p>
      <p>利达众是一个刚需消费省钱和赚钱的平台。用户使用利达众平台消费支付时，可同时获得平台所赠积分和消费券，积分和消费券可以直接当钱花，积分累积还可换成钱。这一新的支付购物体验让人们在平常生活少花钱还以可赚钱。</p>
      <p class="sub-title">利达众——店家商战的利器</p>
      <p>利达众是实体店家经营生意的好帮手好伙伴。店家入驻利达众平台，可享受利达众多码合一聚合收款服务，同时还可获得平台独有的积分和消费券补贴，广告宣传、营销推广等服务。我们借助互联网为店家赋能，助商户轻松营销，提升商店竞争力，实现营收。</p>
      
      <!-- <p class="content-p">利达众是由深圳英乾科技全力打造的品牌产品，这是一个刚需消费省钱和赚钱的平台。用户使用利达众平台消费支付时，即可以同时获得平台所赠积分和消费券，积分和消费券可以直接当钱花，积分累积还可换成钱。这一新的支付购物体验让人们在平常生活少花钱还可赚钱。</p>
      <p class="content-p">中国自古以来的良好传统以节约为美，利达众奉承这一传统美德。节俭对于提高自身道德的修养有着重要的作用，古人有云：“静以修身，俭以养德”。人们需修身养德，品牌更加需要，而高尚的道德情操来源于俭朴的生活。利达众反对浪费，珍惜大有限的资源，让其发挥更大的作用，同时创造出一些附加价且可用的价值。</p>
      <p class="content-p">利达众倡导轻松优质，精明惠购生活理念，并秉承“崇尚节俭、无私奉献”的品牌精神。为促进社会物质和精神文明的进步和发展，利达众以免费赠送积分和消费券的形式回馈大众。</p>
      <p class="content-p">俗话说得好，在享乐上花费最少的人，是最富足的人。享乐生活需节俭更要精明，利达众平台让大众享受原有生活质量时既省钱还赚钱，从而使得大家享乐人生的同时越来越富足。</p>
     -->
    </div>
  </div>
</template>
<script>
import Memnavbar from "../../components/memnavbar";
export default {
  data() {
    return {
      title: "关于我们"
    };
  },
  components: {
    Memnavbar
  }
};
</script>
<style lang='stylus'>
.content_desc {
  width: 100%;

  p {
    font-size: 0.3rem;
    font-weight: 400;
    color: #333;
    text-align: left;
    padding: 0.1rem;
    text-indent:0.6rem;
  }
  p:nth-child(1){
    font-weight:bold;
    text-align:center;
    font-size:0.5rem;
    margin-top:0.2rem;
   
  }
  .content-p{
    position relative
    text-indent:0.4rem;
    line-height:0.6rem;
  }
  .footer {
    font-size: 0.3rem;
    font-weight: 700;
    color: #333;
    text-align: center;
  }
}
.content_desc .title{
  color:#333;
  font-size:0.3rem;
  font-weight:700;
  text-align:center;
}
.content_desc .sub-title{
  font-weight:700;
}
</style>