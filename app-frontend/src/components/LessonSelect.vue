<template>
    <div class="lessonSelect">
        <header>
            <h1>Select the Lesson You Would Like to Do</h1>
        </header>
            <form @submit.prevent='goToHome'>
                <button class="homePage">Go to the Home Page</button> <br><br>
            </form>
    </div>
    <div>
        <form @submit.prevent='selecting'>
            <select v-model='selecting'>
                <!-- <button class="selectLesson">Select a Lesson</button> <br><br> -->
                <!-- <option disabled value="">Select a Lesson</option>
                <option v-for="option in options" :value="option">{{option}}</option> -->
            </select>
            <button class='selectionMade' @click='selecting'>Go to This Lesson</button> <br><br>
        </form>
    </div>
    </template>

<script lang="ts">
    import axios from 'axios';
    export default {
        data() {
            return {
                selected: '',
                options: [
                    // selecting()
                ]
            };
        },
        methods: {
            async goToHome() {
                console.log("Ladies and Gentlemen, we got him");
                try {
                    this.$router.push('/');
                } catch(error) {
                    console.error("Error switching to home page", error);
                }
            },
            async selecting() {
                console.log("Popping open a selection");
                try {
                    const response = await axios.get(location.origin+"/api/authentication/login", {})

                } catch(error) {
                    console.error("Error switching to registration page", error);
                }
            },
        },
    };
</script>

<style scoped>
header {
    height: 70px;
    text-align: center;
}
</style>