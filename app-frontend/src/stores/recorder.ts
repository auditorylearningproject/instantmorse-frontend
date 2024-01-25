import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue'


export interface Clip {
  name: string;
  audio: Blob;
}

export const useAudioStore = defineStore('recordings', () => {
    const recordings: Ref<Clip[]> = ref([])

    function clearRecordings() {
      recordings.value.length = 0;
    }
    function addRecording(recording: Clip) {
        recordings.value.push({name:"", audio:recording.audio});
    }

    function getRecording(id: number): Clip | undefined {
      return recordings.value[id]
    }
  
    return { recordings, clearRecordings, addRecording, getRecording }
  });
