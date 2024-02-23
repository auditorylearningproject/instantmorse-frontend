<template>
    <input
        type="range"
        min="0"
        max="100"
        step="1"
        wpm="20"
        frequency="600"
        playlength="0"
        playstart="0"
        playend="0"
        text=""
        character=""
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
        <!-- <button @click="play">play</button> -->
        <button @click="pause">pause</button>
        <button @click="stop">stop</button>
        <button @click="download">download</button>
    </div>
    <div ref="player"></div>
</template>

<script lang = "ts" setup>
import { onMounted, ref, watch, type Ref, computed, type ComputedRef } from "vue"
import { jscw } from "./jscwlib.js"
import { setTextRange } from "typescript";

const AudioPlayerExample: Ref<HTMLAudioElement | null> = ref(null);

const player = ref(null);

function setup_jscw() {
    jscw_var.setWpm(30);
    jscw_var.setText("hello");
    jscw_var.renderPlayer(player.value, jscw_var);
}

onMounted(() => {
    setup_jscw();
    if (AudioPlayerExample?.value) {
        // currentTime = computed(() => { return AudioPlayerExample.value!.currentTime }); 
           //error above: Cannot invoke an object which is possibly 'null'.ts(2721)

        
}
});
    let jscw_var = new jscw()
    let seekValue = ref(0);
    let currentTime = ref(0);
    const url = "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"

    // function play() {
        // AudioPlayerExample.value!.play();
        // jscw_var.play();
    // }    
    function pause() {
        // AudioPlayerExample.value!.pause();
        jscw_var.pause();
    }
    function stop() {
        // AudioPlayerExample.value!.pause();
        jscw_var.stop();
        // AudioPlayerExample.value!.currentTime = 0;
    }
    function download() {
        jscw_var.refresh_download_link();
    }
    // watch(seekValue, (seek) => {
    //     (AudioPlayerExample.value as HTMLAudioElement).fastSeek(seek)
    // });
    // function updateTime(){
    //     currentTime.value = AudioPlayerExample.value!.currentTime
    // }

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
        // }
</script>