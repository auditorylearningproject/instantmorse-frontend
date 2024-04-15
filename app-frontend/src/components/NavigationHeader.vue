<template>
    <header>

    <div class="wrapper">

      <nav class="flex items-center justify-between bg-gray-800 p-4">

      <div class="flex items-center">
      <RouterLink to="/" class="text-white hover:text-gray-300 mr-4">Home</RouterLink>
      <RouterLink to="/authentication" v-show="!loggedIn" class="text-white hover:text-gray-300 mr-4">Login</RouterLink>
      <RouterLink to="/registration" v-show="!loggedIn" class="text-white hover:text-gray-300 mr-4">Register</RouterLink>
      <RouterLink to="/lessonSelect" class="text-white hover:text-gray-300 mr-4">Select Lesson</RouterLink>
      <RouterLink to="/statistics" class="text-white hover:text-gray-300 mr-4">User Statistics</RouterLink>
      <RouterLink to="/settings" class="text-white hover:text-gray-300 mr-4">Settings</RouterLink>
    </div>

    
    <button v-show="loggedIn" class="text-white hover:text-gray-300 px-4">Logout (broken)</button> <!-- @click=""  -->
  </nav>
    </div>
  </header>
  </template>

  <script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';

const loggedIn = ref(false);

onMounted(async () => {

const baseUrl: string = window.location.origin;
const response = await axios.get(
 baseUrl + '/api/authentication/profile',
).catch(function (error) {
   if (error.response) {
     // The request was made and the server responded with a status code
     // that falls out of the range of 2xx
     
     loggedIn.value = false;

   } else if (error.request) {
     // The request was made but no response was received
    loggedIn.value = false;
 }});

if(response && response.data['username']){
    loggedIn.value = true;
}});

</script>