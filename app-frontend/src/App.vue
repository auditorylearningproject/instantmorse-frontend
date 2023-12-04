<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { provide, shallowRef } from 'vue';
import router from "./router"
import layouts from "./layouts"
const layout = shallowRef('div')

router.afterEach((to) => {
    layout.value = layouts[to.meta.layout] || 'div'
})

provide('app:layout', layout)
</script>
<template>
    <!-- <header class="p-3 has-background-light">

    </header> -->
    <main>
        <component :is="layout || 'div'">
            <RouterView />
        </component>
    </main>
</template>