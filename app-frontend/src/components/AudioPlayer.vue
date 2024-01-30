<template>
    <input
        type="range"
        min="0"
        max="100"
        step="1"
        v-model="seekValue"
    />
    <audio @timeupdate="updateTime"
        ref="AudioPlayerExample"
    ><source :src="url"  />
        Your browser does not support the
        <code>audio</code> element.
    </audio>
    <p>{{ currentTime }}</p>
    <div>
        <button @click="play">play</button>
        <button @click="pause">pause</button>
        <button @click="stop">stop</button>
    </div>
</template>

<script lang = "ts" setup>
import { onMounted, ref, watch, type Ref, computed, type ComputedRef } from "vue"

const AudioPlayerExample: Ref<HTMLAudioElement | null> = ref(null)

onMounted(() => {
    if (AudioPlayerExample?.value) {
        //currentTime = computed(() => { return AudioPlayerExample.value!.currentTime }); 
           //error above: Cannot invoke an object which is possibly 'null'.ts(2721)

        
}
});
    
    let seekValue = ref(0);
    let currentTime = ref(0);
    const url = "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"

    function play() {
        AudioPlayerExample.value!.play();
    }    
    function pause() {
        AudioPlayerExample.value!.pause();
    }
    function stop() {
        AudioPlayerExample.value!.pause();
        AudioPlayerExample.value!.currentTime = 0;
    }
    watch(seekValue, (seek) => {
        (AudioPlayerExample.value as HTMLAudioElement).fastSeek(seek)
    });
    function updateTime(){
        currentTime.value = AudioPlayerExample.value!.currentTime
    }

        // onPlaying() {
        //     if (!this) {
        //         return;
        //     }
        //     const { getAudioDurationinSeconds } = require('get-audio-duration')
        //     duration = getAudioDurationinSeconds(this.audio)
        //     this.currentTime = this.currentTime;
        //     this.seekValue = (this.currentTime / this.duration) * 100;
        // },
        // onSeek() {
        //     const seekto = this.duration * (this.seekValue / 100);
        //     this.currentTime = seekto;
        // },

</script>