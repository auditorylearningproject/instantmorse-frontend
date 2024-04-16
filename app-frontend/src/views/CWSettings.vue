

<template>
  <header>
    <NavigationHeader/>
  </header>
  <main>
  <h2>Random Checkbox</h2>
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">Checked: {{ checked }}</label>


  <h2>Choose the languages you want to use:</h2>
  <select v-model="languages" multiple style="width:100px">
    <option>English</option>
  </select>
  <span>Selected: {{ languages }}</span>


  <div class="cw-settings">
    <h2>CW Settings</h2>
    <div v-if="isLoading">
      Loading settings...
    </div>
    <div v-else-if="isError">
      <p>Error: {{ isError }}</p>
    </div>
    <div v-else>
      <form @submit.prevent="saveSettings">
        <div class="setting">
          <label for="charSpeed">Character Speed (wpm):</label>
          <input v-model.number="settings.char_speed" type="number" id="charSpeed" min="1" max="100">
        </div>
        <div class="setting">
          <label for="effectiveSpeed">Effective Speed (wpm):</label>
          <input v-model.number="settings.effective_speed_wpm" type="number" id="effectiveSpeed" min="1" max="100">
        </div>
        <div class="setting">
          <label for="tone">Tone (Hz):</label>
          <input v-model.number="settings.playback_tone_hz" type="number" id="tone" min="400" max="1000">
        </div>
        <div class="setting">
          <label for="sessionLength">Session Length (number of code groups):</label>
          <input v-model.number="settings.session_length" type="number" id="sessionLength" min="1">
        </div>
        <button type="submit" :disabled="isLoading">Save Settings</button>
      </form>
    </div>
  </div>
</main>
</template>

<script setup lang="ts">
import NavigationHeader from '../components/NavigationHeader.vue';
import type { CWSettings } from "src/dto/cwsettings.dto";
import { ref, reactive, type Ref } from 'vue';
import axios from 'axios';

const checked = ref(true);
const languages = ref(['English']);
const baseUrl: string = window.location.origin;


  let settings = ref<CWSettings>({
    user_id: '0', // Set to 0 for testing
    char_speed: 0,
    effective_speed_wpm: 0,
    playback_tone_hz: 0,
    session_length: 0,
  });

    const isLoading = ref(false);
    const isError: Ref<string | null> = ref(null);

    
    async function fetchSettings(){
      isLoading.value = true;
      isError.value = null;
      try {
        const response = await axios.get('/api/settings');//, { params: { userID: settings.user_id } }); (not needed b/c already in the cookie)
        settings.value = response.data
        console.log(settings.value)
      } catch (error) {
        isError.value = (error as Error).message;
      } finally {
        isLoading.value = false;
      }
    };

    async function saveSettings(){
      isLoading.value = true;
      isError.value = null;
      try {
        await axios.put('/api/settings', settings.value);
        // Show success message (optional)
      } catch (error) {
        isError.value = (error as Error).message;
      } finally {
        isLoading.value = false;
      }
    };

    fetchSettings();


</script>