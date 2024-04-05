<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from 'vue';
import TheWelcome from '../components/TheWelcome.vue'
import type { AxiosResponse } from 'axios';
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from "../components/HelloWorld.vue"
import axios from 'axios';
const notLoggedInMessage = "You are currently not logged in.";
const currentStatus = ref("");
const loggedIn: ComputedRef<boolean> = computed(() => { if(currentStatus.value === "" || currentStatus.value === notLoggedInMessage){ return false } else { return true }});

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
      currentStatus.value = notLoggedInMessage;

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
    <header>
    <img alt="InstantMorse logo" class="logo" src="@/assets/morse-code.png" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="InstantMorse.Codes - Learn Morse Code By Speaking!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/authentication" v-if="!loggedIn">Login</RouterLink>
        <RouterLink to="/registration" v-if="!loggedIn">Register</RouterLink>
        <RouterLink to="/lessonSelect">Select Lesson</RouterLink>
        <RouterLink to="/statistics">User Statistics</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>

      </nav>
    </div>
  </header>

  <!--<RouterView /> -->
  <main>
    <TheWelcome />
    <p style="text-align: center; margin: auto; font-size: 2rem;"> {{ currentStatus }}</p>
  </main>
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    /* display: flex; */
    /* place-items: center; */
    /* padding-right: calc(var(--section-gap) / 2); */
  }


  header .wrapper {
    /* display: flex; */
    /* place-items: flex-start; */
    /* flex-wrap: wrap; */
  }

  nav {
    text-align: left;
    margin-left: 10rem;
    font-size: 1.5rem;

    /* padding: 1rem 0; */
    margin-top: 1rem;
  }
}
.logo {
    display: block;
    margin: 2rem auto 2rem;
      /*margin: 0 2rem 0 0;*/
    filter: invert(100%) brightness(98%) contrast(102%);
  }

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

/* @media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
} */

</style>
