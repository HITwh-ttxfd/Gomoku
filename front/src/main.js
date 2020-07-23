// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
/*引入第三方图标 css*/
/*全局引入css文件 图标使用userpwd icon-****/
import './assets/css/userpwd.css'
//import logo from './assets/logo.png'
import axios from 'axios'
import GoEasy from 'goeasy'

/*axios拦截器 登录时token还没有存储 token存储后的其他页面就可以拦截到token*/
axios.interceptors.request.use(config => {
  //console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$http = axios
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

//创建全局GoEasy对象
Vue.prototype.$goEasy = new GoEasy({
    host:'hangzhou.goeasy.io', //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
    appkey: "BC-2ba7043f485f4a738335fba6c3182be2", //替换为您的应用appkey
    onConnected: function() {
        console.log('连接成功！')
    },
    onDisconnected: function() {
        console.log('连接断开！')
    },
    onConnectFailed: function(error) {
        console.log('连接失败或错误！')
    }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
