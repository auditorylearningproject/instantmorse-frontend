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
        <v-select :options="lessons" label="lesson_name" v-model="selectedItem"></v-select>
        <!-- <ul>
            <li v-for="lesson in lessons" :key="lesson._id">
                {{ lesson.lesson_name }}
                {{ lesson.array_o_chars }}
            </li>
        </ul> -->
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

<script setup lang="ts">
    import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
    // import { ref } from 'vue'
interface Lesson {
  _id: number;
  lesson_name: string;
  array_o_chars: string[];
  group: object;
}

        let lessons: Lesson[] = [{_id: -1, lesson_name: "Please wait...", array_o_chars: [], group: {} }];

        const selectedItem = ref()
                // dropdownOptions: ['Option 1', 'Option 2', 'Option 3'], // Populate dropdown options

        onMounted(() => {
            fetchData();
        });

        const goToHome = async () => {
                console.log("Ladies and Gentlemen, we got him");
                try {
                    router.push('/');
                } catch(error) {
                    console.error("Error switching to home page", error);
                }
            };
            const fetchData = async () => {
                console.log("Popping open a selection");
                try {
                    // Make sure a dropdown item is selected --> This doesn't make sense, isn't this the method that populates the items in the first place?
                //    if (!selectedItem.value) return;

                    // Make a request to backend with selected item
                    // await axios.get(`/api/lesson/select?dropdownItem=${this.selectedItem}`)
                    await axios.get('/api/lesson/select')
                    .then(response => lessons = response.data);
                    // axios.get(location.origin+"/api/lesson/select")
                    // .then(response => this.lessons = response.data);
                } catch(error) {
                    console.error("Error switching to lesson page", error);
                }
            };
            const selecting = async () => {
                try {
                    // Call the lesson selected and load the page needed
                    // fetchLesson();
                    // const response = await axios.get(location.origin+"/api/lesson/select")
                    router.push('/lesson');
                } catch(error) {
                    console.error("Error switching to lesson page", error);
                }
            };
    import 'vue-select/dist/vue-select.css'
    
</script>

<style scoped>

header {
    height: 70px;
    text-align: center;
}

option.name {
    text-decoration-color: rgb(0, 0, 0);
}


</style>