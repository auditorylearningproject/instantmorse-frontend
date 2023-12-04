<!-- TODO https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API -->
<template>
    <div>
        <main class="container has-text-centered">
      <section id="example-audio">
        <div class="columns">
          <div class="column">
            <div class="has-text-right">
              <h3 class="title is-3">Recording audio files</h3>
              <p class="subtitle">Simply <strong>{{recordMode.audio}}</strong> the button to record an audio clip</p>
            </div>

            <div class="record-settings">
              <vue-record-audio :mode="recordMode.audio" @stream="onStream" @result="onResult" />
              <div class="field">
                <label class="label">Mode</label>
                <div class="select">
                  <select v-model="recordMode.audio">
                    <option value="press">Press</option>
                    <option value="hold">Hold</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="recorded-audio">
              <div v-for="(record, index) in recordings" :key="index" class="recorded-item">
                <div class="audio-container"><audio :src="record.src" controls /></div>
                <div><button @click="removeRecord(index)" class="button is-dark">delete</button></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  </template>
  
  <script>
import VueRecord from '@codekraft-studio/vue-record'
export default {
  data () {
    return {
      recordMode: {
        audio: 'hold',
        video: 'press'
      },
      recordings: []
    }
  },
  methods: {
    removeRecord (index) {
      this.recordings.splice(index, 1)
    },
    onStream(stream) {
      // Handle the stream event
      this.audioData.push(stream);

      // Keep only the first 30 seconds of audio data
      if (this.audioData.length > 30) {
        this.audioData = this.audioData.slice(0, 30);
      }
      console.log('Got a stream object:', stream);

    },

      playback() {
        if (this.audioData.length > 0) {
          this.stopRecording();
          this.isPlaying = true;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = audioContext.createBuffer(1, this.audioData.length * 4096, audioContext.sampleRate);
          audioBuffer.getChannelData(0).set(this.audioData.flat());
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.onended = () => {
            this.isPlaying = false;
          };
          source.start();
        }
      },
    onVideoStream (stream) {
      console.log('Got a video stream object:', stream);
    },
    onVideoResult (data) {
      this.$refs.Video.srcObject = null
      this.$refs.Video.src = window.URL.createObjectURL(data)
    },
    onResult (data) {
      this.recordings.push({
        src: window.URL.createObjectURL(data)
      })
    }
  }
}
</script>
  
  <style scoped>
  /* Your component styles here */
  </style>
  