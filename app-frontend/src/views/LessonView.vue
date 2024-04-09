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
  const micSensitivity = ref(0.003);  
  const lesson = ref<LessonDto | null>(null);
  const hasSettings = ref(false);

  
  watch(() => props.lessonID, (newId, oldId) => {
    console.log("LESSON ID CHANGED!");
  });

  watch(lesson, async (newLesson, oldLesson) => {
  if (newLesson instanceof LessonDto) {
    const numGroups = 20;

    const settingsDidLoad = await hasSettings;
    if(!settingsDidLoad){
      console.error("Settings for the user didn't load, aborting lesson load.");
      return
    }
    if(hasSentences(newLesson)){
      let shuffleSentences: string[] = shuffle(newLesson.array_o_chars);
      shuffleSentences = extractWords(shuffleSentences, numGroups);
      arrayOfLetters.value = shuffleSentences
    }else{
      const shuffleSentences = newLesson.array_o_chars.slice(0, numGroups);
      arrayOfLetters.value = shuffleSentences;
    }
    //arrayOfLetters.value = lesson.value!.array_o_chars;
    currentState.value = "Lesson load complete."
  }
  console.error(arrayOfLetters.value);
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
                }else if(str.toLocaleLowerCase("en-US") === currentLetter.value){
                  newStat.code = currentLetter.value;
                  return true;
                }else{
                  newStat.code = str;
                  return false;
                }
              })){
                  newStat.accuracy = true;
                  currentState.value = `Correct! The answer was: ${currentLetter.value}`

              }else{
                  currentState.value = (`Incorrect. You said "${transcription[0]}". The answer was: ${currentLetter.value}`)
              }
              voiceStatus.value = "Play the audio to begin recording."

              if(currentID.value < arrayOfLetters.value.length-1){
                  currentID.value++;
                  //voiceStatus.value = "Play the audio to begin recording."

              }else{
                  recorderController.stopSilenceDetection();
                  recorderController.stopRecording();
                  console.log("HALTED!");
                  
                  currentState.value += " | Lesson complete."
                  /*                  setTimeout(() => {
                      voiceStatus.value = ("Waiting for voice...")
                      }, 1000);
                  */
                  showStatistics.value = true;
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
        currentState.value = "Play the audio to begin recording."
  }catch(error){
      recorderController?.stopRecording();
      recorderController?.stopSilenceDetection();
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
      voiceStatus.value = "No voice detected. Ending recording..."
    }
  })

  function cwStoppedPlaying(){
    if(currentLetter.value !== currentLetterAtEndOfPlay){
      recorderController.beginRecording();
      currentLetterAtEndOfPlay = currentLetter.value; //preventing user from calling startRecording after pressing play again on same letter
    }
    voiceStatus.value = "Speak now!";

  }

  let currentLetterAtEndOfPlay: string | undefined;

  watch(micSensitivity, async (newValue) => {
    recorderController.micSensitivity = newValue;
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

</script>

<template>
  <header>
    <NavigationHeader/>
  </header>
    <div v-if="loggedIn">
      <main>
    <h1>Lesson Page</h1>
    <h2>Name: {{ lesson?.lesson_name }}, Group: {{ lesson?.group.name ?? "Unknown" }}</h2>
      <p id="voicestatus">{{ voiceStatus }}</p>
      <p id="currentstate">{{ currentState }}</p>  

      <!-- <p id="currentletter">{{ currentLetter }}</p> -->
      <div>Adjust microphone sensitivity: <input v-model="micSensitivity" type="range" min="0.001" max="0.01" step="0.001" id="mic-sensitivity"></div>
      <div v-if="!currentLetter">Loading lesson text...</div>
      <div v-else>
        <AudioPlayer @playbackFinished="cwStoppedPlaying" :current-text="currentLetter" v-if="hasSettings"></AudioPlayer>
      </div>


    <!-- //TODO: Manually adjust lesson results before submission to allow for the correction of any errors in the speech-to-text recognition -->
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
  
    </main>
    </div>
  <div v-else>
    <p>Error: You are not logged in, so you cannot complete this lesson.</p>
  </div>
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
  font-size: 2em; /* Adjust the size as needed */
  text-align: center;
}
#voicestatus {
  font-size: 4em; /* Adjust the size as needed */
  text-align: center;
}

/* Style the letter text */
#currentletter {
  font-size: 8em; /* Adjust the size as needed */
  text-align: center;
}
</style>
  