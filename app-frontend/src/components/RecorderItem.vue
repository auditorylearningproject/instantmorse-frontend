<!-- TODO READ https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API -->

<template>
  <div class="wrapper">
    <header>
      <h1>Recorder</h1>
    </header>

    <section class="main-controls">
      <!--<canvas class="visualizer" height="60px"></canvas> -->
      <div id="buttons">
        <button class="record" @click="recorderController.startRecording">Record</button>
        <button class="stop" @click="recorderController.stopRecording">Stop</button>
      </div>
    </section>

    <section v-show="showSoundClips" class="sound-clips" ref="pElementRef">
      <span v-if="recorderController.allClips.length === 0">You have no sound clips recorded.</span>
      <article v-for="(clip, index) in recorderController.allClips" :key="index" class="clip">
        <audio controls :src="recorderController.getAudioURL(clip.audio)"></audio>
        <p>{{ clip.name }}</p>
        <span v-if="clip.transcription">{{ clip.transcription }}</span>
        <button @click="recorderController.deleteRecording(index)">Delete</button>
        <button @click="transcriber.transcribe(index)">Transcribe</button>
      </article>
    </section>
    
    <button @click="showSoundClips = !showSoundClips">
        {{ showSoundClips ? 'Hide sound clips' : 'Show sound clips' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Transcriber, useRecorder } from "./speech_to_text"
  const transcriber = new Transcriber()
  const recorderController = useRecorder(computed(() => ""));
  const showSoundClips = ref(true)

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