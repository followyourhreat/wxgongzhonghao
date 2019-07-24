//rem适配方案
var html = document.querySelector('html');
console.log(html.offsetWidth)
if (html.offsetWidth > 750) {
  var rem = 750 / 7.5;
  document.getElementsByTagName('body')[0].style.width = 750 + "px"
} else {
  var rem = html.offsetWidth / 7.5;
}
console.log(rem)
html.style.fontSize = rem + "px";






// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from "axios"
import './api' //第三方网络请求
import Vant from 'vant'
import 'vant/lib/index.css';
import './style/style.css' //样式
import echarts from 'echarts'
import './mixin' //mixin
import { Toast } from 'vant'
import utils from './utils';   //获取url参数
import BaiduMap from 'vue-baidu-map'


// axios 配置

Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})


Vue.use(Vant)
Vue.use(Toast)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'mn1js6Kpnl0G2RCTHDDPZmvoxaBflsDf'
})
Vue.prototype.$utils = utils;
Vue.prototype.$echarts = echarts
axios.defaults.headers.post['Content-Type'] = 'application/json';
// Vue.prototype.$ajax = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
