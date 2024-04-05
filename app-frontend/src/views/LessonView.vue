<script setup lang="ts">
  
import { computed, ref, watch, type Ref, onBeforeMount } from "vue";
import { Transcriber, useRecorder, RecorderEventType, type Clip } from "@/components/speech_to_text"
import AudioPlayer from "@/components/AudioPlayer.vue";
import { type AttemptDto } from "@/dto/attempt.dto";
import type { AxiosResponse } from "axios";
import axios, { HttpStatusCode } from "axios";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

  const props = defineProps<{
    lessonID: string
  }>()


  const alphabetToPhoneticMap: Map<string, string> = new Map([
      ['A', 'alpha'],
      ['B', 'bravo'],
      ['C', 'charlie'],
      ['D', 'delta'],
      ['E', 'echo'],
      ['F', 'foxtrot'],
      ['G', 'golf'],
      ['H', 'hotel'],
      ['I', 'india'],
      ['J', 'juliett'],
      ['K', 'kilo'],
      ['L', 'lima'],
      ['M', 'mike'],
      ['N', 'november'],
      ['O', 'oscar'],
      ['P', 'papa'],
      ['Q', 'quebec'],
      ['R', 'romeo'],
      ['S', 'sierra'],
      ['T', 'tango'],
      ['U', 'uniform'],
      ['V', 'victor'],
      ['W', 'whiskey'],
      ['X', 'x-ray'],
      ['Y', 'yankee'],
      ['Z', 'zulu']
  ]);
  const phoneticToAlphabetMap: Map<string, string> = new Map([
    ['alpha', 'A'],
    ['bravo', 'B'],
    ['charlie', 'C'],
    ['delta', 'D'],
    ['echo', 'E'],
    ['foxtrot', 'F'],
    ['golf', 'G'],
    ['hotel', 'H'],
    ['india', 'I'],
    ['juliett', 'J'],
    ['kilo', 'K'],
    ['lima', 'L'],
    ['mike', 'M'],
    ['november', 'N'],
    ['oscar', 'O'],
    ['papa', 'P'],
    ['quebec', 'Q'],
    ['romeo', 'R'],
    ['sierra', 'S'],
    ['tango', 'T'],
    ['uniform', 'U'],
    ['victor', 'V'],
    ['whiskey', 'W'],
    ['x-ray', 'X'],
    ['yankee', 'Y'],
    ['zulu', 'Z']
]);

function isSpecialTuple(event: any): event is [Clip, number] {
  return Array.isArray(event) && event.length === 2 && isClip(event[0]);
}

function isClip(event: any): event is Clip {
  return event && typeof event.audio !== 'undefined';
}
  const arrayOfLetters: Ref<string[]> = ref([]); //TODO: fill using route.params.lessonID;
  const transcriber = new Transcriber()
  const currentState = ref("Waiting for voice...");
  let currentID = ref(0);
  let currentLetter = computed(() => {return arrayOfLetters.value[currentID.value]});
  const showStatistics = ref(false);
  const micSensitivity = ref(0.003);
  let loading = ref(true)
  
  watch(() => props.lessonID, (newId, oldId) => {
    console.log("LESSON ID CHANGED!");
  });



  const handleRecordingEvent = async (event: RecorderEventType | [Clip, number]) => {
    if (typeof event === 'string') {
        // Handle RecorderEventType
        switch (event) {
            case RecorderEventType.RecordingStarted:
                // Handle recording started event - do nothing
                break;
            case RecorderEventType.RecordingStopped:
                // See below: we are passing a blob as an indication that the recording stopped instead. Do nothing here.
                break;
            case RecorderEventType.RecordingPaused:
                // Handle recording paused event - do nothing
                break;
            default:
                // Handle other event types - do nothing
                break;
        }
    } else if (isSpecialTuple(event)) { // this is equivalent to RecordingStopped
          if(event[0].name?.includes(arrayOfLetters.value[currentID.value]) ?? false){
            currentState.value = "Letter matched to clip! Checking correctness...";
            const newStat: singleCodeStat = {
              code: "",
              accuracy: false,
              timeToAnswer: event[1]
            };
            try{
              const transcription = await transcriber.transcribe(currentID.value);
            // newValue[currentID.value].transcription = "placeholder"
              if(transcription === undefined){
                  currentState.value = ("Transcription service couldn't figure out what you said...")
                  newStat.accuracy = false;
                  newStat.code = "N/A";
              } else if(transcription.some(str => { // str is one of the possible transcription possibilities (there may be many).
                  // we will check all the possibilities and say it's ok if any of them match the real word.
                let lowerString = str.toLocaleLowerCase("en-US");
                if(phoneticToAlphabetMap.has(lowerString)){
                  newStat.code = phoneticToAlphabetMap.get(lowerString) ?? "Error";
                  return true;
                }else if(str.toLocaleLowerCase("en-US") === currentLetter.value){
                  newStat.code = currentLetter.value;
                  return true;
                }else{
                  newStat.code = str;
                  return false;
                }
              })){
                  newStat.accuracy = true;
                  currentState.value = "CORRECT! Moving onto the next letter."

              }else{
                  currentState.value = (`Incorrect. You said "${transcription[0]}", the letter is ${currentLetter.value}`)
              }


              if(currentID.value < arrayOfLetters.value.length-1){
                  currentID.value++;

                  setTimeout(() => {
                      currentState.value = ("Waiting for voice...")
                      }, 1000);
              }else{
                  recorderController.stopSilenceDetection();
                  recorderController.stopRecording();
                  console.log("HALTED!");
                  currentState.value = "No more letters! Congrats."
                                 
                  showStatistics.value = true;
                  const attempt: AttemptDto = {
                    lesson_id: props.lessonID as string,//TODO: fix this placeholder
                    char_speed: 0, //TODO: fix this placeholder
                    eff_speed: 0, //TODO: fix this placeholder
                    accuracy: averageAccuracy.value,
                    time_spent: totalTimeToAnswer.value, //seconds
                    date_time: new Date()
                  }
                  const baseUrl: string = window.location.origin;
                  const response: AxiosResponse = await axios.post(
                    baseUrl + '/api/attempt',
                    attempt
                  );
                  if (response.status == HttpStatusCode.Created){
                    currentState.value = "Attempt saved to database!";
                  }else if(response.status == HttpStatusCode.Unauthorized){
                    currentState.value = "ERROR: You weren't logged in when the lesson started. Not saved.";
                  }
                  else{
                    throw new Error('Error in transcription request... app is shutting down.');
                  }
              }
        }catch(error){
            let newError = error as Error;
            console.error('Error during transcription:', error);
          //  currentState.value = (newError.message);
            recorderController.stopSilenceDetection();
            recorderController.stopRecording();
        }finally{
          lessonStatistics.value.push(newStat);
        }
      }else{
        console.log("A new clip was saved, but it doesn't correspond to the current letter!");
    }
    }  };
  
    let recorderController = useRecorder(currentLetter, handleRecordingEvent);

    onBeforeMount(async () => {
    const baseUrl: string = window.location.origin;
    
    try{
      if(!props.lessonID){
        currentState.value = "ERROR: No lesson specified.";
        throw new Error("Lesson parameter not specified.");
      }

      await axios.post( //const response: AxiosResponse = 
          baseUrl + '/api/lesson/get',
          props.lessonID
        ).then(response => {
          arrayOfLetters.value = response.data;
      }).catch((error) => {
          arrayOfLetters.value = [];
          currentState.value = "ERROR: The lesson you have requested is not found. Please go back."; //TODO: Fix why this refuses to show up!
      // if(response.status === HttpStatusCode.NotFound){
          //throw new Error("Lesson not found in DB!");
          return Promise.reject(error)
        });
        loading.value = false;
  }catch(error){
      recorderController?.stopRecording();
      recorderController?.stopSilenceDetection();
    console.log(error)
  }   
 
    });

  //TODO: extract char_speed and effective_speed_wpm values from the player at the end of the session.
  const lessonStatistics = ref<Array<singleCodeStat>>([])
  interface singleCodeStat {
    code: string,
    accuracy: boolean,
    timeToAnswer: number
  }
  const averageAccuracy = computed(() => {
      if (lessonStatistics.value.length === 0) return 0;

      const totalCorrect = lessonStatistics.value.reduce((acc, stat) => {
        return acc + (stat.accuracy ? 1 : 0);
      }, 0);

      return (totalCorrect / lessonStatistics.value.length) * 100;
    });

    const totalTimeToAnswer = computed(() => {
      return lessonStatistics.value.reduce((acc, stat) => {
        return acc + stat.timeToAnswer;
      }, 0);
    });

  watch(recorderController.allClips, async (newValue, oldValue) => {
    console.log("new clip added to Pinia local database...") })

  function cwStoppedPlaying(){
    if(currentLetter.value !== currentLetterAtEndOfPlay){
      recorderController.beginRecording();
      currentLetterAtEndOfPlay = currentLetter.value; //preventing user from calling startRecording after pressing play again on same letter
    }
    // eslint-disable-next-line no-self-assign
    //currentID.value = currentID.value.valueOf(); // trigger the watcher by assigning the value to itself
  }
  let currentLetterAtEndOfPlay: string | undefined;

  watch(micSensitivity, async (newValue) => {
    recorderController.micSensitivity = newValue;
  });
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
      <div>Adjust microphone sensitivity: <input v-model="micSensitivity" type="range" min="0.001" max="0.01" step="0.001" id="mic-sensitivity"></div>
      <div v-if="loading">Loading lesson text...</div>
      <div v-else>
        <AudioPlayer @playbackFinished="cwStoppedPlaying" :current-text="currentLetter"></AudioPlayer>
      </div>

      <div v-if="showStatistics">
        <h2>Lesson Statistics:</h2>
        <ul>
          <li v-for="(stat, index) in lessonStatistics" :key="index">
            You said: {{ stat.code }}, Correct?: {{ stat.accuracy }}, Time to Answer (seconds): {{ stat.timeToAnswer/1000 }}
          </li>
        </ul>
        <p>Average accuracy: {{ averageAccuracy }}</p>
        <p>Total time to answer: {{ totalTimeToAnswer/1000 }}</p>
      </div>
  
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
  