import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'
import Signup from './views/Signup.vue'
import store from './store'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    { 
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      //登陆状态（路由元信息）
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      //登录状态（没有登录的时候用户不允许访问）（路由元信息）
      meta: { requiredLogin: true}
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { redirectAlreadyLogin: true}
    },
  ]
})
//to：要到达的路由
//from：要离开的路由
router.beforeEach((to, from, next) => {
  //获取用户信息和token值
  const { user, token } = store.state
  //获取元信息
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  //首先是没有登录的
  if (!user.isLogin) {
    //如果存在token
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      //发送请求获取用户信息
      store.dispatch('fetchCurrentUser').then(() => {
        //判断登录状态
        if (redirectAlreadyLogin) {
          //跳转到登陆状态
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        //失败就清空token值 到登陆页面
        console.error(e)
        store.commit('logout')
        next('login')
      })
      //如果token不存在
    } else {
      //requiredLogin就是进入这个路由需要路由
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
    //已经登录的
  } else {
    //判断注册和登录页面元信息redirectAlreadyLogin为true
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  } 
}) 

export default router
