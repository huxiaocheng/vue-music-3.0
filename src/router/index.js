import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/components/rank'
import Recommend from '@/components/recommend'
import Search from '@/components/search'
import Singer from '@/components/singer'
import SingerDetail from '@/components/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
