<script setup lang="ts">
import type { AttemptDto } from '@/dto/attempt.dto';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

onMounted(async () => {
    const baseUrl: string = window.location.origin;
    const response: AxiosResponse = await axios.get(
    baseUrl + '/api/attempt/get-all',
    );
    attempts.value = response.data;

});
const attempts = ref<AttemptDto[]>([]);
const groupedAttempts = computed(() => {
      const grouped = attempts.value.reduce((acc, attempt) => {
        const lessonId = attempt.lesson_id.toString(); // Convert ObjectId to string
        if (!acc[lessonId]) {
          acc[lessonId] = [];
        }
        acc[lessonId].push(attempt);
        return acc;
      }, {} as { [key: string]: AttemptDto[] }); //error here
      return grouped;
    });
// return Object.values(groups);
// });
  

</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Lesson ID</th>
        <th>Character Speed</th>
        <th>Effective Speed</th>
        <th>Accuracy</th>
        <th>Time Spent (seconds)</th>
        <th>Date & Time</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="attemptGroup in groupedAttempts" :key="attemptGroup.lesson_id">
        <tr v-for="attempt in attemptGroup" :key="attempt.date_time.toString()">
          <td>{{ attemptGroup[0].lesson_id }}</td>
          <td>{{ attempt.char_speed }}</td>
          <td>{{ attempt.eff_speed }}</td>
          <td>{{ attempt.accuracy }}</td>
          <td>{{ attempt.time_spent/1000 }}</td>
          <td>{{ attempt.date_time }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
  <style scoped>
    /* Optional styling for the table */
  </style>
  
