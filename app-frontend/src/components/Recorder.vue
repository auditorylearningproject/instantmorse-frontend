<!-- TODO READ https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API -->

<template>
  <div class="wrapper">
    <header>
      <h1>Recorder</h1>
    </header>

    <section class="main-controls">
      <!--<canvas class="visualizer" height="60px"></canvas> -->
      <div id="buttons">
        <button class="record" @click="startRecording">Record</button>
        <button class="stop" @click="stopRecording">Stop</button>
      </div>
    </section>

    <section v-show="showSoundClips" class="sound-clips" ref="pElementRef">
      <span v-if="allClips.length === 0">You have no sound clips recorded.</span>
        <article v-for="(clip, index) in allClips" :key="index" class="clip">
        <audio controls :src="getAudioURL(clip.audio)"></audio>
        <p>{{ clip.name }}</p>
        <button @click="deleteRecording(index)">Delete</button>
        <button @click="transcriber.transcribe(index)">Transcribe</button>
      </article>
    </section>
    
    <button @click="showSoundClips = !showSoundClips">
        {{ showSoundClips ? 'Hide sound clips' : 'Show sound clips' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useAudioStore } from '@/stores/recorder';
import { Transcriber } from './speech_to_text'

const transcriber = new Transcriber();

interface Clip {
  name: string;
  audio: Blob;
}

const pElementRef = ref()

let callbackRecordStop: () => void;

function startRecording(){
  mediaRecorder.start();
}
function stopRecording(){
  mediaRecorder.stop();
  console.log(mediaRecorder.state);
}
function captureMediaStream(stream: MediaStream){
  mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond: 8000 });

  mediaRecorder.ondataavailable = (e) => {
  data.push(e.data);
  };
  callbackRecordStop()

}

function deleteRecording(index: number) {
  //allClips.value.splice(index, 1);
  store.clearRecordings();
}

function getAudioURL(clip: Blob): string {
  return URL.createObjectURL(new Blob([clip], { type: "audio/ogg; codecs=opus" }));
}

onMounted(() => {
  callbackRecordStop = function() {
    mediaRecorder.onstop = (e) => {
    console.log("recorder stopped");

    const clipName = prompt("Enter a name for your sound clip");
    if(clipName === null) {
      alert("Recording not saved.");
    }
    else {
      store.addRecording({name: clipName, audio: new Blob(data, { type: "audio/ogg; codecs=opus" })}) //or webm
      // const clipContainer = document.createElement("article");
      // const clipLabel = document.createElement("p");
      // const audio = document.createElement("audio");
      // const deleteButton = document.createElement("button");

      // clipContainer.classList.add("clip");
      // audio.setAttribute("controls", "");
      // deleteButton.innerHTML = "Delete";
      // clipLabel.innerHTML = clipName;

      // clipContainer.appendChild(audio);
      // clipContainer.appendChild(clipLabel);
      // clipContainer.appendChild(deleteButton);
      // pElementRef.value.appendChild(clipContainer);

      // const blob = new Blob(data, { type: "audio/ogg; codecs=opus" });
      // data.length = 0
      // const audioURL = window.URL.createObjectURL(blob);
      // audio.src = audioURL;


    }
    data.length = 0;

  };};

  })

const showSoundClips = ref(true)

let mediaRecorder: MediaRecorder;

let data: Blob[] = []
const store = useAudioStore();
const allClips = computed(() => store.recordings)


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia({
      // constraints - only audio needed for this app
      audio: true,
    })
    // Success callback
    .then(captureMediaStream)
    // Error callback
    .catch((err: any) => {
      console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}

</script>

<!-- <script lang="ts" setup>
import { ref, computed, watch } from 'vue'

let id = 0

const newTodo = ref('')
const hideCompleted = ref(false)
const todos = ref([
  { id: id++, text: 'Learn HTML', done: true },
  { id: id++, text: 'Learn JavaScript', done: true },
  { id: id++, text: 'Learn Vue', done: false }
])

const filteredTodos = computed(() => {
  return hideCompleted.value
    ? todos.value.filter((t) => !t.done)
    : todos.value
})

function addTodo() {
  todos.value.push({ id: id++, text: newTodo.value, done: false })
  newTodo.value = ''
}

function removeTodo(todo) {
  todos.value = todos.value.filter((t) => t !== todo)
}
/// watch demo
const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}

fetchData()
  
watch(todoId, (theId) => { fetchData() })

</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo">
    <button>Add Todo</button>
  </form>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <input type="checkbox" v-model="todo.done">
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
    {{ hideCompleted ? 'Show all' : 'Hide completed' }}
  </button>

  <p>Todo id: {{ todoId }}</p>
  <button @click="todoId++" :disabled="!todoData">Fetch next todo</button>
  <p v-if="!todoData">Loading...</p>
  <pre v-else>{{ todoData }}</pre>

</template>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>

-->

<style scoped>
header {
  height: 70px;
}

.main-controls {
  padding-bottom: 0.7rem;
  height: 170px;
}

.sound-clips {
  box-shadow: inset 0 3px 4px rgba(0, 0, 0, 0.7);
  background-color: rgba(0, 0, 0, 0.1);
  height: calc(100% - 240px - 0.7rem);
  overflow: scroll;
}

.clip button {
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}


</style>