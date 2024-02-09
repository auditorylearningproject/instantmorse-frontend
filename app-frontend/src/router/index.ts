import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecordView from '@/views/RecordView.vue'
import AudioPlayerVue from '@/views/AudioPlayer.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import RegistrationView from '@/views/RegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { layout: 'AppLayout', pageTitle: "Home"},
      components:{ default: HomeView },
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
      meta: { layout: 'BlankLayout', pageTitle: "Recorder Widget"},
      component: RecordView
    },
    {
      path: '/cw-widget',
      name: 'playcw',
      meta: { layout: 'BlankLayout'},
      component: AudioPlayerVue
    },
    {
      path: '/Authentication',
      name: 'authentication',
      meta: {layout: 'BlankLayout', pageTitle: "Authentication Page"},
      component: AuthenticationView
    },
    {
      path: '/static/NewUsers.html',
      name: 'registration',
      meta: { layout: 'BlankLayout', pageTitle: "Registration Page" },
      component: RegistrationView
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import ('../views/404.vue'),
      meta: { layout: 'BlankLayout', pageTitle: "404 Not Found" }
    }
  ]
})

export default router
