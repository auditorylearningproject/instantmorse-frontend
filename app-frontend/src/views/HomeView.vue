<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TheWelcome from '../components/TheWelcome.vue'
import type { AxiosResponse } from 'axios';
import axios from 'axios';

const currentStatus = ref("");

onMounted(async () => {

const baseUrl: string = window.location.origin;
const response = await axios.get(
  baseUrl + '/api/authentication/profile',
).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      currentStatus.value = "You are currently not logged in."

    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });

if(response && response.data['username']){
  currentStatus.value = `Welcome, ${response.data['username']}!`
}else{
  currentStatus.value = "You are currently not logged in."
}
});

</script>

<template>
  <main>
    <TheWelcome />
    <p style="text-align: center; margin: auto; font-size: 2rem;"> {{ currentStatus }}</p>
  </main>
</template>
