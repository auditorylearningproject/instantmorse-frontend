<template>
<main>
<header>Select the Lesson You Would Like to Work On</header><br>
<div class="container">
    <div style="background: #282c32; color: white;  padding: 3rem; border-radius: 0.3rem; margin-left: 5rem">
        <div class="lesson">
            <label class="lessonLettering">Select a Lesson:</label>
        </div>
        <div class="lessonSelect">
            <v-select :options="groups" label="groupName" v-model="groupSelected" v-if="groups"></v-select>
            <v-select v-else :options="['Please wait...']"></v-select>
        </div>
        <div v-if="groupSelected">
            <v-select :options="groupSelected.lessons" label="lesson_name" v-model="lessonSelected"></v-select>
            <form v-if="lessonSelected" @submit.prevent='selecting'>
                <button class='selectionMade'>Go to This Lesson</button> <br><br>
            </form>
        </div>
    </div>
</div>
</main>
</template>

<script setup lang="ts">
    import 'vue-select/dist/vue-select.css'
    import axios from 'axios';
    import { onMounted, ref, type Ref, computed, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    import NavigationHeader from '../components/NavigationHeader.vue';
    import { LessonDto } from '@/dto/lesson.dto';
    


    const router = useRouter()
        // import { ref } from 'vue'
    // interface Lesson { use LessonDTO object instead
    //     _id: number;
    //     lesson_name: string;
    //     array_o_chars: string[];
    //     group: object;
    // }
    
    let lessons: Ref<Array<LessonDto>> = ref([])//= ref([{id: "74b5359a", lesson_name: "Please wait...", array_o_chars: [], group: {name: "GroupName", order: 1} }]);

    const lessonSelected: Ref<LessonDto | undefined> = ref();
    const groupSelected: Ref<Groups | undefined> = ref();

    interface Groups {
        groupName: string;
        lessons: LessonDto[];
    }

    watch(lessons, (newValue) => {
        console.log("New lessons.");
        const computedGroups: Groups[] = [];
        if(lessons.value.length < 1){
            return [];
        }
        lessons.value.forEach(lesson => {
            const existingGroupIndex = computedGroups.findIndex(g => g.groupName === lesson.group.name); // looking to see if the group already exists
            if (existingGroupIndex === -1) {
            computedGroups.push({
                groupName: lesson.group.name,
                lessons: [lesson]
            });
            } else {
            computedGroups[existingGroupIndex].lessons.push(lesson);
            }
        });

          // Sort lessons within each group based on their order
        computedGroups.forEach(group => {
            group.lessons.sort((a, b) => a.group.order - b.group.order);
        });

        groups.value = computedGroups;
    })
    const groups: Ref<Array<Groups>> = ref([])

    let selectedItemThing = "";
    
    const fetchData = async () => {
        console.log("Popping open a selection");
        try {
            await axios.get('/api/lesson/select')
            .then(response => lessons.value = response.data);
        } catch(error) {
            console.error("Error switching to lesson page", error);
        }
    }; 
    const selecting = async () => {
        try {
            selectedItemThing = lessonSelected.value!._id;
            router.push('/lesson/'+selectedItemThing);
        } catch(error) {
            console.error("Error switching to lesson page", error);
        }
    };

       // onMounted(() => {
        fetchData();
   // });
</script>

<style scoped>
header {
    text-align: center;
    font-size: xx-large;
}
.lessonLettering {
    color: rgb(79 185 227);
}
option.name {
    text-decoration-color: rgb(0, 0, 0);
}
div.v-select {
    margin-top: 1%;
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
.container {
  column-rule: 4px solid rgb(79 185 227);
}
.selectionMade {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: solid;
    text-align: center;
    color: white;
    border-color: black;
    border-color: rgb(61, 139, 248);
    max-width: 50rem;
    margin-right: 85%;
    border-width: .18rem;
}
</style>