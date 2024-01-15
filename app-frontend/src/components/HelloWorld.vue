<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      This website is running on a custom-configured Debian web server.
    </h3>
  </div>
</template>
