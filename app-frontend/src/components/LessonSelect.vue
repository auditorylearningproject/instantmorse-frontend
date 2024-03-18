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
        <select v-model='fetchLesson'>
            <option disabled value="">Select a Lesson</option>
            <option v-for="lesson in lessons" :key="lesson.id" value="">{{ lesson.lesson_name }}</option>
        </select>
        <form @submit.prevent='selecting'>
            <button class='selectionMade' @click='selecting'>Go to This Lesson</button> <br><br>
        </form>
    </div>
    </template>

<!-- https://www.bezkoder.com/vue-node-express-mongodb-mevn-crud/ -->

<script lang="ts">
    import axios from 'axios';
    export default {
        data() {
            return {
                lessons : []
            };
        },
        fetchLesson() {
            console.log("Popping open a selection");
            try {
                axios.get(location.origin+"/api/lesson/select")
                .then(response => this.lessons = response.data);
            } catch(error) {
                console.error("Error switching to lesson page", error);
            }
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
                try {
                    // Call the lesson selected and load the page needed
                    // fetchLesson();
                    // const response = await axios.get(location.origin+"/api/lesson/select")
                    this.$router.push('/lesson');
                } catch(error) {
                    console.error("Error switching to lesson page", error);
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