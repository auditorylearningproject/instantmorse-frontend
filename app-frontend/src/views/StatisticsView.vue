<script setup lang="ts">
import type { AttemptDto } from '@/dto/attempt.dto';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import NavigationHeader from '../components/NavigationHeader.vue';

onMounted(async () => {
    const baseUrl: string = window.location.origin;
    const response: AxiosResponse = await axios.get(
    baseUrl + '/api/attempt/get-all',
    );
    attempts.value = response.data;
    console.error(response.data);

});
const attempts = ref<Array<AttemptDto& { lesson_name: string }>>([]);
const groupedAttempts = computed(() => {
  const grouped = attempts.value.reduce((acc, attempt) => {
    const lessonId = attempt.lesson_id.toString(); // Convert ObjectId to string
    if (!acc[lessonId]) {
      acc[lessonId] = [];
    }
    acc[lessonId].push(attempt);
    return acc;
  }, {} as { [key: string]: Array<AttemptDto& { lesson_name: string }> });
  return grouped;
});
// return Object.values(groups);
// });
</script>

<template>
  <header>
    <NavigationHeader/>
  </header>
  <main>
    <div class="head">
      <header>
        Your Statistics
      </header>
    </div>
      <table class="table">
        <thead>
          <tr>
            <th class="columnHeader">Lesson Name</th>
            <th class="columnHeader">Character Speed</th>
            <th class="columnHeader">Effective Speed</th>
            <th class="columnHeader">Accuracy</th>
            <th class="columnHeader">Time Spent (seconds)</th>
            <th class="columnHeader">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="attemptGroup in groupedAttempts" :key="attemptGroup.lesson_id">
            <tr class="rows" v-for="attempt in attemptGroup" :key="attempt.date_time.toString()">
              <td class="columns">{{ attemptGroup[0].lesson_name }}</td>
              <td class="columns">{{ attempt.char_speed }}</td>
              <td class="columns">{{ attempt.eff_speed }}</td>
              <td class="columns">{{ attempt.accuracy }}</td>
              <td class="columns">{{ attempt.time_spent/1000 }}</td>
              <td class="columns">{{ attempt.date_time }}</td>
            </tr>
          </template>
        </tbody>
      </table>
  </main>
</template>
<style scoped>
  .table {
    border: solid;
    border-width: .4cap;
    border-color: black;
    margin-left: 20%;
    margin-right: 20%;
  }
  .columnHeader {
    border: solid;
    border-color: black;
  }
  .rows {
    border: solid;
    border-color: #4680d1;
  }
  .columns {
    border: solid;
    border-color: #4680d1;
  }
  .head {
    margin-bottom: 2rem;
    text-align: center;
    font-size: xx-large;
  }
</style>
  
