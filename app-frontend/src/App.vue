<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { provide, shallowRef } from 'vue';
import router from "./router"
import layouts from "./layouts"
const layout = shallowRef('div')

router.afterEach((to) => {
    //layout.value = layouts[to.meta.layout] || 'div'
    //layout.value = (layouts as Record<string, string>)[to.meta.layout] || 'div';
    const metaLayout = to.meta.layout;

    if (typeof metaLayout === 'string') {
      layout.value = (layouts as Record<string, string>)[metaLayout] || 'div';
    } else {
      // Handle the case where 'to.meta.layout' is not a string
      console.error("to.meta.layout should be a string");
    }

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
