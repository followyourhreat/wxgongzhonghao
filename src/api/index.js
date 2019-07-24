/*
 *网络请求
 */
import Vue from "vue"
import axios from "axios"
// import { Toast } from 'vant';
import qs from 'qs'
import md5 from 'js-md5'
// 模拟后台接口数据,若不需要,请注释
// import './mock.js'
// 基础URL
const baseUrl = process.env.NODE_ENV == "production" ? "http://www.lizsh.net" : "http://www.lizsh.net";
var http = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'code':md5("LZSHlzsh123")
  },
  withCredentials: true
});

//闭包函数自调用
(function() {
  //添加一个请求拦截器
  http.interceptors.request.use(function(config) {
    //在请求发出之前的数据进行处理
    // 头部添加信息
    // config.headers.zwtUserId='49b0559c-a383-460f-8428-b9522d05ee41';
    // 数据添加字段
    // config.data = {
      // uid: window.localStorage.getItem('uid'),
      // token: window.localStorage.getItem('token'),
    //   uid: '38',
    //   token: '2f2f205c69418fc1d02cd7d7358bcba5',
       
    //   ...config.data
    // };
    //将数据对象格式用QS序列化Form Data,再提交
    // config.data = qs.stringify(config.data);
    console.log(config.data);
    return config;
  }, function(err) {
    // Toast.fail({
    //   message: '系统维护中...'
    // });
    return err;
  });

  //添加一个响应拦截器
  http.interceptors.response.use(function(response) {
    //在这里对返回的数据进行处理
    const { status, statusText, data } = response;
    console.log(data)
      // 网络请求不通
    if (status != 200) {
      // Toast.fail({
      //   message: '系统维护中...'
      // });
    }
    // 接口出错
    if (data.errcode != 0) {
      // Toast(data.errmsg);
    }
    // 登录失效
    if (data.errcode == '400006') {
      window.DTCJSObject.tokenInvalid()
    }
    return data;
  }, function(err) {
    // Toast.fail({
    //   message: '系统维护中...'
    // });
    return err;
  });

  //使用axios
  Vue.prototype.$http = http;

  //自定义POST请求,添加拦截功能
  // Vue.prototype.$post = (url, params = {}) => {
  Vue.prototype.$post = (url, params ) => {
    return new Promise((resolve, reject) => {
      http.post(url, params).then(response => {
        if (response.errcode == '0') {
          resolve(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  };
})()
