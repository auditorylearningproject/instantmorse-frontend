<script setup lang="ts">
  
import { computed, ref, watch } from "vue";
import { Transcriber, useRecorder } from "@/components/speech_to_text"
  const arrayOfLetters = ['a', 'b', 'c', 'd', 'e', 'f'];
  const transcriber = new Transcriber()
  const currentState = ref("Waiting for voice...");
  let currentID = ref(0);
  let currentLetter = computed(() => {return arrayOfLetters[currentID.value]})
  const recorderController = useRecorder(currentLetter);

  watch(recorderController.allClips, async (newValue, oldValue) => {
    currentState.value = "Letter detected! Checking correctness...";
    if(newValue.some(clip => clip.name?.includes(arrayOfLetters[currentID.value]) ?? false)){ //newValue.length > oldValue.length && 
        //const res = await fetch(recorderController.getAudioURL(recorderController.currentStore.getRecording(currentID.value)!.audio))
        try{
            const transcription = await transcriber.transcribe(currentID.value);
            if(transcription === undefined){
                currentState.value = ("Transcription service couldn't figure out what you said...")
            }
            else if(transcription.toLocaleLowerCase("en-US") === currentLetter.value){
                currentState.value = "CORRECT! Moving onto the next letter."

            }else{
                currentState.value = (`Incorrect. You said "${transcription}", the letter is ${currentLetter.value}`)
            }


            if(currentID.value < arrayOfLetters.length-1){
                currentID.value++;
                setTimeout(() => {
                    currentState.value = ("Waiting for voice...")
                    }, 1000);
            }else{
                recorderController.stopSilenceDetection();
                recorderController.stopRecording();
                console.log("HALTED!");
                currentState.value = "No more letters! Congrats."
            }
        }catch(error){
            console.error('Error during transcription:', error);
            currentState.value = ("Error in transcription Request... app is shutting down.");
            recorderController.stopSilenceDetection();
            recorderController.stopRecording();
        }
        //todo: delete blob from memory
    }else{
        console.log("No new letter found in the database...");
        console.log("newlen", newValue.length);
        console.log("oldlen", oldValue.length);

    }
})

</script>

<template>
    <!-- <div class="wrapper"> -->
      <header>
        <h1>Lesson Page</h1>
      </header>
      <main>
      <!-- <section class="main-controls"> -->
        <!--<canvas class="visualizer" height="60px"></canvas> -->
        <!-- <div id="buttons">
          <button class="record" @click="recorderController.startRecording">Record</button>
          <button class="stop" @click="recorderController.stopRecording">Stop</button>
        </div>
      </section> -->
      <p id="currentstate">{{ currentState }}</p>
      <p id="currentletter">{{ currentLetter }}</p>
  
      <!-- <section v-show="showSoundClips" class="sound-clips" ref="pElementRef">
        <span v-if="recorderController.allClips.length === 0">You have no sound clips recorded.</span>
        <article v-for="(clip, index) in recorderController.allClips" :key="index" class="clip">
          <audio controls :src="recorderController.getAudioURL(clip.audio)"></audio>
          <p>{{ clip.name }}</p>
          <span v-if="clip.transcription">{{ clip.transcription }}</span>
          <button @click="recorderController.deleteRecording(index)">Delete</button>
          <button @click="transcriber.transcribe(index)">Transcribe</button>
        </article>
      </section> -->
      
      <!-- <button @click="showSoundClips = !showSoundClips">
          {{ showSoundClips ? 'Hide sound clips' : 'Show sound clips' }}
      </button> -->
    <!--</div> -->
    </main>
  </template>

<style>
/* Apply styles to the container */
.lesson-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Make the container take the full height of the viewport */
}

/* Style the title */
header {
  text-align: center;
}

/* Style the state text */
#currentstate {
  font-size: 4em; /* Adjust the size as needed */
  text-align: center;
}

/* Style the letter text */
#currentletter {
  font-size: 8em; /* Adjust the size as needed */
  text-align: center;
}
</style>
  