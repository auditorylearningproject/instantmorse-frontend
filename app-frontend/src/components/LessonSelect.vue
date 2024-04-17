<template>
    <div style="background: #282c32; color: white;  padding: 3rem; border-radius: 0.3rem">
<main>
<div class="lessonSelect">
        <h1>Select the Lesson You Would Like to Do</h1><br>
        <form @submit.prevent='goToHome'>
            <button class="homePage">Go to the Home Page</button> <br><br>
        </form>
    </div>
    <div>
        <v-select :options="lessons" label="lesson_name" v-model="selectedItem"></v-select>
        <form @submit.prevent='selecting'>
            <button class='selectionMade'>Go to This Lesson</button> <br><br>
        </form>
    </div>
</main>
</div>
</template>

<script setup lang="ts">
    import 'vue-select/dist/vue-select.css'
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

    onMounted(() => {
        fetchData();
    });

    let selectedItemThing = "";
    
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
            await axios.get('/api/lesson/select')
            .then(response => lessons = response.data);
        } catch(error) {
            console.error("Error switching to lesson page", error);
        }
    }; 
    const selecting = async () => {
        try {
            selectedItemThing = selectedItem.value._id;
            router.push('/lesson/'+selectedItemThing);
        } catch(error) {
            console.error("Error switching to lesson page", error);
        }
    };
</script>

<style scoped>
header {
    height: 70px;
    text-align: center;
}

option.name {
    text-decoration-color: rgb(0, 0, 0);
}
div.v-select {
  --vs-controls-color: rgb(61, 139, 248);
  --vs-border-color: rgb(61, 139, 248);

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: rgb(61, 139, 248);

  --vs-selected-bg: #c3954c;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>