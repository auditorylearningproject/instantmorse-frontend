<script setup lang="ts">
import NavigationHeader from '../components/NavigationHeader.vue';
import { computed, ref, watch, type Ref, onBeforeMount } from "vue";
import { Transcriber, useRecorder, RecorderEventType, type Clip } from "@/components/speech_to_text"
import AudioPlayer from "@/components/AudioPlayer.vue";
import { type AttemptDto } from "@/dto/attempt.dto";
import type { AxiosResponse } from "axios";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { useRoute, useRouter } from 'vue-router'
import { LessonDto } from "@/dto/lesson.dto";
import { shuffle } from 'lodash-es'
import type { CWSettings } from '@/dto/cwsettings.dto';
import { useSettingsStore } from '@/stores/settings';

const router = useRouter()
const route = useRoute()
const cwSettings = useSettingsStore()

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
  const arrayOfLetters: Ref<string[]> = ref([]);
  const transcriber = new Transcriber()
  const currentState = ref("Loading lesson..."); //The currentState describes the current status of the question you're on. It tells you if you got it right, wrong, or if there was an error 
  const voiceStatus = ref("")

  let currentID = ref(0);
  let currentLetter = computed(() => {return arrayOfLetters.value[currentID.value]});
  const showStatistics = ref(false);
  const micSensitivity = ref(0.007);  
  const lesson = ref<LessonDto | null>(null);
  const hasSettings = ref(false);
  const waitingPeriod = ref(false);

  
  watch(() => props.lessonID, (newId, oldId) => {
    console.log("LESSON ID CHANGED!");
  });

  function waitForSettings() {
  return new Promise<boolean>((resolve) => {
    // Check the value of hasSettings at regular intervals
    const intervalId = setInterval(() => {
      if (hasSettings.value === true) {
        // If hasSettings is true, resolve the Promise and clear the interval
        clearInterval(intervalId);
        resolve(true);
      }
    }, 100); // Check every 100 milliseconds
  });
}

  watch(lesson, async (newLesson, oldLesson) => {
  if (newLesson instanceof LessonDto) {

    const settingsDidLoad = await waitForSettings();
    if(!settingsDidLoad){
      console.error("Settings for the user didn't load, aborting lesson load."); // this will never happen unless we add a timeout
      return
    }
    const numGroups = cwDefaults.value.session_length; // this loaded in now since we waited for settings to load
    console.log(`Default session length: ${cwDefaults.value.session_length}`)

    if(hasSentences(newLesson)){
      let shuffleSentences: string[] = shuffle(newLesson.array_o_chars);
      shuffleSentences = extractWords(shuffleSentences, numGroups);
      arrayOfLetters.value = shuffleSentences
    }else{
      if (numGroups > newLesson.array_o_chars.length) {
        // If numGroups is greater than the length of array_o_chars,
        // create a new array with random selections from array_o_chars
        let shuffleChars = Array.from({ length: numGroups }, () => {
            const randomIndex = Math.floor(Math.random() * newLesson.array_o_chars.length);
            return newLesson.array_o_chars[randomIndex];
        });
        arrayOfLetters.value = shuffleChars;

    } else {
        // Otherwise, shuffle and slice the array as before
        let shuffleChars = shuffle(newLesson.array_o_chars).slice(0, numGroups);
        arrayOfLetters.value = shuffleChars;
      }
    }
    //arrayOfLetters.value = lesson.value!.array_o_chars;
    currentState.value = "Lesson load complete."
  }
  console.log(`This lesson's array: ${arrayOfLetters.value}`);
});

function extractWords(sentences: string[], numWords: number): string[] {
    const result: string[] = [];
    let wordCount = 0;

    for (const sentence of sentences) {
        const words = sentence.split(/\s+/); // Split sentence into words
        for (const word of words) {
            //const matches = word.match(/\b\w+\b/g); // Match words with punctuation
           // if (matches) {
            //    for (const match of matches) {
                    result.push(word); // Push individual words into result array
                    wordCount++;
                    if (wordCount >= numWords) return result; // Return when word count reaches numWords
            //    }
           // }
        }
    }

    return result;
}

function hasSentences(obj: LessonDto): boolean {
  if (obj.extras && obj.extras.sentences) {
    return true;
  } else {
    return false;
  }
}

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
          voiceStatus.value = "Recording finished.";
          if(event[0].name?.includes(arrayOfLetters.value[currentID.value]) ?? false){
            currentState.value = "Checking correctness...";
            const newStat: singleCodeStat = {
              code: "",
              accuracy: false,
              timeToAnswer: event[1]
            };
            try{
              const transcription = await transcriber.transcribe(currentID.value);
            // newValue[currentID.value].transcription = "placeholder"
              if(transcription === undefined){
                  currentState.value = ("Transcription service couldn't figure out what you said.")
                  newStat.accuracy = false;
                  newStat.code = "N/A";
              } else if(transcription.some(str => { // str is one of the possible transcription possibilities (there may be many).
                  // we will check all the possibilities and say it's ok if any of them match the real word.
                let lowerString = str.toLocaleLowerCase("en-US");
                if(phoneticToAlphabetMap.has(lowerString)){
                  newStat.code = phoneticToAlphabetMap.get(lowerString) ?? "Error";
                  return true;
                }else if(str.toLocaleLowerCase("en-US") === currentLetter.value.toLocaleLowerCase("en-US")){
                  newStat.code = currentLetter.value;
                  return true;
                }else if(!newStat.code){
                  newStat.code = str; // do not run this line of code more than once!
                }
                return false;
              })){
                  newStat.accuracy = true;
                  currentState.value = `Correct! The answer was: ${currentLetter.value}`

              }else{
                  currentState.value = (`Incorrect. You said "${transcription[0]}". The answer was: ${currentLetter.value}`)
              }

        }catch(error){

          if (error instanceof TranscriptionError) {
                console.error('Transcription Error:', error.message);
                currentState.value = "Error in transcription, moving on.";
                newStat.code = currentLetter.value;
                newStat.accuracy = false;
          }
          else{
            console.error(`Error: halting lesson.`);
            console.error(error);
            recorderController.stopSilenceDetection();
            recorderController.stopRecording();
          }
        }finally{
          alreadyPlayed.value = false;
          voiceStatus.value = "Play the audio to begin recording."
          waitingPeriod.value = false;

          if(currentID.value < arrayOfLetters.value.length-1){
              currentID.value++;
              //voiceStatus.value = "Play the audio to begin recording."
              
          }else{
              recorderController.stopSilenceDetection();
              recorderController.stopRecording();
              console.log("HALTED!");
              
              voiceStatus.value = "Lesson complete.";
              /*                  setTimeout(() => {
                  voiceStatus.value = ("Waiting for voice...")
                  }, 1000);
              */
             // waitingPeriod.value = false; // remove the last loading character from the sidebar
              showStatistics.value = true;
              
          }

          lessonStatistics.value.push(newStat);
        }
      }else{
        console.error("A new clip was saved, but it doesn't correspond to the current letter!");
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
          {lessonID: props.lessonID},
        ).then(response => {
          const lessonDto = new LessonDto("", "", [""], {name: "", order: -1});
          Object.assign(lessonDto, response.data);
          lesson.value = lessonDto;
         // lesson.value = new LessonDto({...response.data});
         // const lessonDto = new LessonDto({...lessonDto} as Required<typeof lessonDto>);
      }).catch((error) => {
          arrayOfLetters.value = [];
          currentState.value = "ERROR: The lesson you have requested is not found. Please go back.";
      // if(response.status === HttpStatusCode.NotFound){
          //throw new Error("Lesson not found in DB!");
          return Promise.reject(error)
        });
        //currentState.value = "Play the audio to begin recording."
  }catch(error){
      recorderController?.stopRecording();
      recorderController?.stopSilenceDetection();
      console.error("Error: could not load lesson.");
      console.log(error)
  }   
 
    });
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

  watch(recorderController.noiseDetected, async (newValue, oldValue) => {
    if(newValue){
      voiceStatus.value = "Voice detected, listening...";
    }else{
      voiceStatus.value = "No voice detected. Ending recording...";
      waitingPeriod.value = true;
    }
  })

  async function cwStoppedPlaying(){
    if(!alreadyPlayed.value){
      recorderController.beginRecording();
      //currentLetterAtEndOfPlay = currentLetter.value; //preventing user from calling startRecording after pressing play again on same letter
      alreadyPlayed.value = true;
      voiceStatus.value = "Speak now!";
    }
    console.log("Audio stopped! Recording begun.")

  }

  //let currentLetterAtEndOfPlay: string | undefined;
  const alreadyPlayed = ref(false);

  watch(micSensitivity, async (newValue) => {
    recorderController.micSensitivity = 0.01 - newValue;  //inverted to make the slider go more sensitive when moved to the right
  });

  const loggedIn = ref(false)
  async function checkLoggedIn() {
    const baseUrl: string = window.location.origin;

  try {
      await axios.get(baseUrl + '/api/authentication/profile');
      loggedIn.value = true;
  } catch (error) {
    if ((error as AxiosError).status === HttpStatusCode.Unauthorized){
      loggedIn.value = false;
    }
  }
}

checkLoggedIn();

const cwDefaults = ref<CWSettings>({
    user_id: '0', // Set to 0 for testing
    char_speed: 0,
    effective_speed_wpm: 0,
    playback_tone_hz: 0,
    session_length: 0,
  });

    const settingsLoadError: Ref<string | null> = ref(null);
    
    async function fetchSettings(){
      settingsLoadError.value = null;
      try {
        const response = await axios.get('/api/settings');
        cwDefaults.value = response.data;
        cwSettings.updateUserSettings(cwDefaults.value.char_speed, cwDefaults.value.effective_speed_wpm, cwDefaults.value.playback_tone_hz);

        hasSettings.value = true;
      } catch (error) {
        settingsLoadError.value = (error as Error).message;
        hasSettings.value = false;
      }
    };
    fetchSettings();

    const sidebarLettersBesidesCurrent = computed(() => {
      const currentIndex = currentID.value;
      const startIndex = Math.max(0, currentIndex - 9);
      //use the above value for the last 9 letters
      const endIndex = currentIndex === arrayOfLetters.value.length-1 ? (currentIndex+1) : currentIndex; //if the lesson is done, go ahead and throw the current letter in the sidebar too.
      return arrayOfLetters.value.slice(0, endIndex); //arrayOfLetters used to be lessonStatistics with currentIndex+1, but I want the actual value shown in the sidebar, not what the user said.
    });

    async function saveStatistics(){
      showStatistics.value = false; // stop the user from trying to save many times

      const attempt: AttemptDto = {
          lesson_id: props.lessonID as string,
          char_speed: cwSettings.getWPM,
          eff_speed: cwSettings.getEFF,
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
</script>

<template>
  <header>
    <NavigationHeader/>
  </header>
    <div v-if="loggedIn">
  <main>
  <div class="lesson-info-container">
    <h1 id="title">Lesson Page</h1>
    <h2 id="lessonInfo">Name: {{ lesson?.lesson_name }}, Group: {{ lesson?.group.name ?? "Unknown" }}</h2>
      <p id="voicestatus">{{ voiceStatus }}</p>
      <p id="currentstate">{{ currentState }}</p>  

      <!-- <p id="currentletter">{{ currentLetter }}</p> -->
      <div class="player">
        <div id="micAdjust">Adjust microphone sensitivity: <input v-model="micSensitivity" type="range" min="0.001" max="0.010" step="0.001" id="mic-sensitivity"></div>
        <div v-if="!currentLetter">Loading lesson text...</div>
        <div v-else>
          <AudioPlayer @playbackFinished="cwStoppedPlaying" :current-text="currentLetter" v-if="hasSettings"></AudioPlayer>
        </div>
      </div>

      <button id="saveStats" v-show="showStatistics" @click="saveStatistics">Save Statistics</button>

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
    </div>
      <div class="sidebar">
      <ul>
        
        <li v-for="(item, index) in sidebarLettersBesidesCurrent" :key="index">
            <button v-if="lessonStatistics[index]" @click="lessonStatistics[index].accuracy = !lessonStatistics[index].accuracy">
              {{ item }}
              <span v-if="lessonStatistics[index] && lessonStatistics[index].accuracy">✔️</span> <!-- It will try to access the statistics for the last value before its stats have been calculated-->
              <span v-else-if="lessonStatistics[index]">❌</span>
            </button>
        </li>
        <li v-if="currentID < arrayOfLetters.length && waitingPeriod">
         {{  currentLetter }} <span>⌛</span>
        </li>
      </ul>
    </div>
  
    </main>
    </div>
  <div v-else>
    <p>Error: You are not logged in, so you cannot complete this lesson.</p>
  </div>
  </template>

<style scoped>

  header {
    text-align: center;
    margin-bottom: 20px;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* height: 50vh; Adjust as needed */
  }
  h1, h2 {
    text-align: center;
  }
  #voicestatus,
  #currentstate {
    text-align: center;
  }
  #mic-sensitivity {
    margin-top: 10px;
  }
  .sidebar {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    overflow-y: auto;
    max-height: calc(100vh - 100px); /* Adjust as needed */
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sidebar li {
    margin-bottom: 5px;
  }
  /* Styling for AudioPlayer component (assuming it's a separate component) */
  .audio-player-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px; /* Adjust as needed */
  }
  /* Additional styling for AudioPlayer component elements if needed */
  .audio-player-controls {
    /* Your styles here */
  }
  #title{
    font-size: 2em;
  }
  #lessonInfo {
    font-size: 2em;
  }
  #micAdjust {
    font-size: 1em;
  }
  #voicestatus{
    font-size: 2em;
  }
  #currentstate {
    font-size: 2em;
  }
  .lesson-info-container {
  overflow-y: auto;
  padding: 0 20px; /* Add padding as needed */
  text-align: center;
  }
  .player {
    border: solid;
    background-color: rgb(40, 44, 50);
    -webkit-text-fill-color: white;
  }
</style>
  