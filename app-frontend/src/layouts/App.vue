<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="InstantMorse logo" class="logo" src="@/assets/morse-code.png" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="InstantMorse.Codes - Learn Morse Code By Speaking!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/authentication">Login</RouterLink>
        <RouterLink to="/registration">Register</RouterLink>
        <RouterLink to="/lesson">Default course lesson: Letters A-F</RouterLink>
        <RouterLink to="/lessonSelect">Select Lesson (UNFINISHED)</RouterLink>
        <RouterLink to="/statistics">User Statistics</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
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
