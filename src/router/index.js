import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@/components/rank'
import Recommend from '@/components/recommend'
import Search from '@/components/search'
import Singer from '@/components/singer'
import SingerDetail from '@/components/singer-detail'
import Disc from '@/components/disc'
import TopList from '@/components/top-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
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
