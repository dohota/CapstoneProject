import { createRouter, createWebHistory } from 'vue-router'
//先引入对应文件
import HomeView from '../views/HomeView.vue'
import Zong from '../views/Zong.vue'
import Total from '../views/Total.vue'
import Map from '../views/Map.vue'
import Data from '../views/Data.vue'
import Create from '../views/Create.vue'
import Game from '../views/Game.vue'
import Other from '../views/Other.vue'
//router-link能跳转到相对应的页面，然后在这个文件里配置就能跳转到相对应的组件
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',//路径
      name: 'home',
      component:HomeView,//组件
      meta: { title: '首页' }//网页名字
    },
    {
      path:'/author',
      name:'zong',
      component:Zong,
      meta: { title: '作者' }
    },
    {
      path:'/total',
      name:'total',
      component:Total,
      meta: { title: '总纲' }
    },
    {
      path:'/map',
      name:'map',
      component:Map,
      meta: { title: '地图' }
    },
    {
      path:'/data',
      name:'data',
      component:Data,
      meta: { title: '数据库' }
    },
    {
      path:'/create',
      name:'create',
      component:Create,
      meta: { title: '游戏创作' }
    },
    {
      path:'/playing',
      name:'play',
      component:Game,
      meta: { title: '游戏创作' }
    },
    {
      path:'/a1',
      name:'a1',
      component:Other,
      meta: { title: 'other' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let a = String(to.meta.title);
  document.title = a;
  next()
})

export default router

