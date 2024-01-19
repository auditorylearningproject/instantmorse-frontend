import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {nextTick} from 'vue';

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.mount('#app')

const DEFAULT_TITLE = "InstantMorse App";
router.afterEach((to) => {
    nextTick(() => {
        document.title = to.meta.pageTitle as string || DEFAULT_TITLE;
    });
});
