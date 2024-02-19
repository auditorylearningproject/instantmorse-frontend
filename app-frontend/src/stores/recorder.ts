import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue'


export interface Clip {
  id?: number;
  audio: Blob;
  transcription?: string;
  name?: string;
}

export const useAudioStore = defineStore('recordings', () => {
    const recordings: Ref<Clip[]> = ref([])
    
    function clearRecordings() {
      recordings.value.length = 0;
    }
    function addRecording(recording: Clip) {
        if (recording.id === undefined) {
          recording.id = recordings.value.length;
        }
        recordings.value.push(recording); //{name:"", audio:recording.audio}
    }

    function getRecording(id: number): Clip | undefined {
      return recordings.value[id]
    }
  
    return { recordings, clearRecordings, addRecording, getRecording }
  });
