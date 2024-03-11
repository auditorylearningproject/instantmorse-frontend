import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecordView from '@/views/RecordView.vue'
import AudioPlayerVue from '@/views/AudioPlayer.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import LessonViewVue from '@/views/LessonView.vue'
import LessonSelect from '@/components/LessonSelect.vue'

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
      path: '/lesson',
      name: 'lesson-page',
      meta: { layout: 'BlankLayout', pageTitle: "Lesson Page"},
      component: LessonViewVue
    },
    {
      path: '/cw-widget',
      name: 'playcw',
      meta: { layout: 'BlankLayout'},
      component: AudioPlayerVue
    },
    {
      path: '/authentication',
      name: 'Authentication',
      meta: {layout: 'BlankLayout', pageTitle: "Authentication Page"},
      component: AuthenticationView
    },
    {
      path: '/registration',
      name: 'Registration',
      meta: { layout: 'BlankLayout', pageTitle: "Registration Page" },
      component: RegistrationView
    },
    {
      path: '/lessonSelect',
      name: 'SelectLesson',
      meta: { layout: 'BlankLayout', pageTitle: "Select Lesson Page" },
      component: LessonSelect
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
