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
        <select v-model="selectedItem" @change="fetchData">
            <option v-for="lesson in dropdownOptions" :value="lesson">{{ lesson }}</option>
        </select>
        <ul>
            <li v-for="lesson in lessons" :key="lesson._id">
                {{ lesson.lesson_name }}
                {{ lesson.array_o_chars }}
            </li>
        </ul>
        <!-- <select v-model="fetchLesson"> -->
        <!-- <v-select :options="lessons" label="name">
            <template #option="option">
                <span>{{ option.name }}</span>
            </template>
            <option disabled value="">Select a Lesson</option>
            <option v-for="lesson in lessons" :key="lesson.id" value="{{ lesson.name }}">{{ lesson.name + ": " +  lesson.content }}</option> -->
        <!-- </v-select> -->
        <form @submit.prevent='selecting'>
            <button class='selectionMade'>Go to This Lesson</button> <br><br>
        </form>
    </div>
    </template>

<!-- https://www.bezkoder.com/vue-node-express-mongodb-mevn-crud/ -->

<script lang="ts">
    import axios from 'axios';
    // import { ref } from 'vue'

    export default {
        data() {
            return {
                selectedItem: null,
                dropdownOptions: ['Option 1', 'Option 2', 'Option 3'], // Populate dropdown options
                lessons : [] as { _id: number, lesson_name: string, array_o_chars: string, group: object }[]
            };
        },
        mounted() {
            // Fetch initial data
            this.fetchData();
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
            async fetchData() {
                console.log("Popping open a selection");
                try {
                    // Make sure a dropdown item is selected
                    if (!this.selectedItem) return;

                    // Make a request to backend with selected item
                    await axios.get(`/api/lesson/select?dropdownItem=${this.selectedItem}`)
                    .then(response => this.lessons = response.data);
                    // axios.get(location.origin+"/api/lesson/select")
                    // .then(response => this.lessons = response.data);
                } catch(error) {
                    console.error("Error switching to lesson page", error);
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
    @import "../../node_modules/vue-select/dist/vue-select.css";

header {
    height: 70px;
    text-align: center;
}

option.name {
    text-decoration-color: rgb(0, 0, 0);
}


</style>