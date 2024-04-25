<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef } from 'vue';
import TheWelcome from '../components/TheWelcome.vue';
import NavigationHeader from '../components/NavigationHeader.vue';
import type { AxiosResponse } from 'axios';
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
const notLoggedInMessage = "You are currently not logged in.";
const currentStatus = ref("");
const loggedIn: ComputedRef<boolean> = computed(() => { if(currentStatus.value === "" || currentStatus.value === notLoggedInMessage){ return false } else { return true }});

 onMounted(async () => {

const baseUrl: string = window.location.origin;
const response = await axios.get(
  baseUrl + '/api/authentication/profile',
).catch(function (error) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      currentStatus.value = notLoggedInMessage;
      console.log('Error', error);
  });

if(response && response.data['username']){
  currentStatus.value = `Welcome, ${response.data['username']}!`
}else{
  currentStatus.value = "You are currently not logged in."
}
});

</script>

<template>
  <NavigationHeader/>

  <!--<RouterView /> -->
  <main>
    <img alt="InstantMorse logo" class="logo" src="@/assets/morse-code.png" width="125" height="125" />
   
    <div class="greetings"> <h1 class="green"> InstantMorse.Codes - Learn Morse Code by Speaking!</h1></div>
    <div class="explanations"> <h3>This project was inspired by Dr. Rogers and his interests in LCWO and learning morse code in new ways.
      This website was a reimplementation to the work already done by a Benedictine College Graduate, who used MATLAB to code a similar project.
      Although there are already websites that help individuals learn Morse Code, our website is different in that it trains the individual by voice
      instead of by typing characters or words.
    </h3></div><br>
    <p style="text-align: center; margin: auto; font-size: 2rem;"> {{ currentStatus }}</p>
  </main>
</template>


<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}


/* nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
} */

nav a.router-link-exact-active {
  color: var(--color-text);
}

/* nav a.router-link-exact-active:hover {
  background-color: transparent;
} */

/* nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
} */

/* nav a:first-of-type {
  border: 0;
} */

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

  /* nav {
    text-align: left;
    margin-left: 10rem;
    font-size: 1.5rem;

    /* padding: 1rem 0;//
    margin-top: 1rem;
  } */
}
.logo {
    display: block;
    margin: 2rem auto 2rem;
      /*margin: 0 2rem 0 0;*/
    filter: invert(50%) brightness(98%) contrast(102%);
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
  margin: auto;
}

/* @media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
    margin: auto;
  }
} */

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

.explanations h3 {
  border: solid;
  border-width: .4vb;
  border-color: #4680d1;
  text-align: center;
  border-radius: 10%;
  margin-left: 30%;
  margin-right: 30%;
  background-color: rgb(40, 44, 50);
  -webkit-text-fill-color: #4680d1;
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
