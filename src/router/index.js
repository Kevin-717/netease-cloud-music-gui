import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue')
  },
  {
    path: '/top',
    name: 'top',
    component: () => import(/* webpackChunkName: "about" */ '../views/Top.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
