import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecordView from '@/views/RecordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { layout: 'AppLayout'},
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      meta: { layout: 'BlankLayout'},
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/record',
      name: 'record',
      meta: { layout: 'BlankLayout'},
      component: RecordView
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import ('../views/404.vue'),
      }
  ]
})

export default router
