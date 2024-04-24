<template>
  <header>
    <div class="wrapper">
      <nav class="flex items-center justify-between bg-gray-800 p-4">
        <div class="flex items-center">
          <RouterLink to="/" class="text-white hover:text-gray-300 mr-4">Home</RouterLink>
          <RouterLink to="/lessonSelect" class="text-white hover:text-gray-300 mr-4">Select Lesson</RouterLink>
          <RouterLink to="/statistics" class="text-white hover:text-gray-300 mr-4">User Statistics</RouterLink>
          <RouterLink to="/settings" class="text-white hover:text-gray-300 mr-4">Settings</RouterLink>
        </div>
        <div class="flex items-right">
          <RouterLink to="/authentication" v-show="!loggedIn" class="text-white hover:text-gray-300 px-4">Login</RouterLink>
          <RouterLink to="/registration" v-show="!loggedIn" class="text-white hover:text-gray-300 px-1">Register</RouterLink>
          <button v-show="loggedIn" @click="logout" class="text-white hover:text-gray-300 px-4">Logout</button> <!-- @click=""  -->
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, getCurrentInstance, type ComponentInternalInstance } from 'vue';
import { useRouter } from 'vue-router';

const loggedIn = ref(false);
const router = useRouter()
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
onMounted(() => {
  instance = getCurrentInstance();
});
let instance: ComponentInternalInstance | null = null;
function logout(){
  let cookie = document.cookie.match("Authorization")?.pop() ?? null;
  if(cookie){
    console.log("Logging you out.");
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;";
  }
  router.go(0);
  router.push({path: "/", force: true});
  instance!.proxy!.$forceUpdate();
}
</script>

<style scoped>
  
</style>