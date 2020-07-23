import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/index/home'
import login from '@/components/index/login'
import index from '@/components/index/index'
import users from '@/components/user/users'
import warhall from "../components/war/warhall";
import histroy from "../components/user/histroy";
import message from "../components/user/message";
import myfri from "../components/friend/myfri";
import addfri from "../components/friend/addfri";
import reqfri from "../components/friend/reqfri";
import register from "../components/index/register";
import waitHall from "../components/war/waitHall";

var axios = require('axios')
/*请求根路径*/
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: homePage,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: index},
        {path: '/userinfo', component: users},
        {path: '/waithall', component: waitHall},
        {path: '/history', component: histroy},
        {path: '/message', component: message},
        {path: '/myfri', component: myfri},
        {path: '/addfri', component: addfri},
        {path: '/reqfri', component: reqfri}
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      chiledren: [
        {path: '/register', component: register}
      ]
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/warhall',
      component: warhall
    }
  ]
})

// // 挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   // to 将要访问的
//   // from 代表从哪个路径跳转而来
//   // next是放行函数
//   // next('/login') 强制跳转
//
//   //登录页直接放行
//   if (to.path === '/login') return next()
//   const token = window.sessionStorage.getItem('token')
//   if (!token) return next('/login')
//   next()
// })

export default router
