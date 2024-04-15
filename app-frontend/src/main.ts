import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {nextTick} from 'vue';

import App from './App.vue'
import router from './router'
import VueSelect from 'vue-select';
import PrimeVue from 'primevue/config';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue);
app.component("v-select", VueSelect);
app.mount('#app')

const DEFAULT_TITLE = "InstantMorse App";
router.afterEach((to) => {
    nextTick(() => {
        document.title = to.meta.pageTitle as string || DEFAULT_TITLE;
    });
});
