import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecordView from '@/views/RecordView.vue'
import StatisticsVue from '@/views/StatisticsView.vue'
import SettingsView from '@/views/CWSettings.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import LessonViewVue from '@/views/LessonView.vue'


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
      component: () => import('../views/RecordView.vue')
    },
    {
      path: '/lesson/:lessonID',
      name: 'lesson-page',
      meta: { layout: 'BlankLayout', pageTitle: "Lesson Page"},
      component: () => import('../views/LessonView.vue'),
      props: true,
    },
    {
      path: '/authentication',
      name: 'Authentication',
      meta: {layout: 'BlankLayout', pageTitle: "Authentication Page"},
      component: () => import('../views/AuthenticationView.vue')
    },
    {
      path: '/registration',
      name: 'Registration',
      meta: { layout: 'BlankLayout', pageTitle: "Registration Page" },
      component: () => import('../views/RegistrationView.vue')
    },
    {
      path: '/lessonSelect',
      name: 'SelectLesson',
      meta: { layout: 'BlankLayout', pageTitle: "Select Lesson Page" },
      component: () => import('../views/LessonSelect.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      meta: { layout: 'BlankLayout', pageTitle: "User Statistics" },
      component: () => import('../views/StatisticsView.vue')
    },
    {
      path: '/settings',
      name: 'cwsettings',
      meta: { layout: 'BlankLayout', pageTitle: "CW Settings"},
      component: () => import('../views/CWSettings.vue')
    },
    {
      path: '/:catchAll(.*)',
      name: 'notFound',
      component: () => import ('../views/404.vue'),
      meta: { layout: 'BlankLayout', pageTitle: "404 Not Found" }
    }
  ]
});

// https://www.digitalocean.com/community/tutorials/vuejs-advanced-vue-routing
// router.beforeEach((to, from, next) => {
//   if (to.name !== 'Authentication') {
//     next({ name: 'Authentication' });
//   } else {
//     next();
//   }
// });

export default router
