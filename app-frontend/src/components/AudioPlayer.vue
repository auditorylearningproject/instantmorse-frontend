<!-- import * as jscwlib from src/jscwlib.js; -->

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
        <button @click="play">play</button>
        <button @click="pause">pause</button>
        <button @click="stop">stop</button>
    </div>
    <div ref="player"></div>
</template>

<script lang = "ts" setup>
import { onMounted, ref, watch, type Ref, computed, type ComputedRef } from "vue"
import { jscw } from "./jscwlib.js"

const AudioPlayerExample: Ref<HTMLAudioElement | null> = ref(null)

<<<<<<< HEAD
const audioctx = new Audio
=======
const player = ref(null)

function setup_jscw(){
    jscw_var.setWpm(30);
    jscw_var.setText("hello"); // We should have some reparate component that allows us to pass the text in as a param
    jscw_var.renderPlayer(player.value, jscw_var); // replace this with custom Vue UI
}
>>>>>>> b04a45b4a28d82d4de7797243a69ed98eeca13f6

onMounted(() => {
    setup_jscw();
    if (AudioPlayerExample?.value) {
        currentTime = computed(() => { return AudioPlayerExample.value!.currentTime }); 
           //error above: Cannot invoke an object which is possibly 'null'.ts(2721)

        
}
});
    let jscw_var = new jscw()
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
    // function genMorseTiming(string character, bigint currentTime) {
    //     var out = [];
    //     var 1 = getDitDah(character);
    //     if (!1) {
    //         console.log("CW for character" + character +" unavailable");
    //     }
    // }
    // function getDitDah(character) {

    // }
    
    // class Alphabet {
    //     private englishAlphabet = new Alphabet[2][26];
    //     constructor(){
    //         this.englishAlphabet[0][0] = "A";
    //         this.englishAlphabet[0][1] = "B";
    //         this.englishAlphabet[0][2] = "C";
    //         this.englishAlphabet[0][3] = "D";
    //         this.englishAlphabet[0][4] = "E";
    //         this.englishAlphabet[0][5] = "F";
    //         this.englishAlphabet[0][6] = "G";
    //         this.englishAlphabet[0][7] = "H";
    //         this.englishAlphabet[0][8] = "I";
    //         this.englishAlphabet[0][9] = "J";
    //         this.englishAlphabet[0][10] = "K";
    //         this.englishAlphabet[0][11] = "L";
    //         this.englishAlphabet[0][12] = "M";
    //         this.englishAlphabet[0][13] = "N";
    //         this.englishAlphabet[0][14] = "O";
    //         this.englishAlphabet[0][15] = "P";
    //         this.englishAlphabet[0][16] = "Q";
    //         this.englishAlphabet[0][17] = "R";
    //         this.englishAlphabet[0][18] = "S";
    //         this.englishAlphabet[0][19] = "T";
    //         this.englishAlphabet[0][20] = "U";
    //         this.englishAlphabet[0][21] = "V";
    //         this.englishAlphabet[0][22] = "W";
    //         this.englishAlphabet[0][23] = "X";
    //         this.englishAlphabet[0][24] = "Y";
    //         this.englishAlphabet[0][25] = "Z";
    //         this.englishAlphabet[1][0] = ".-";
    //         this.englishAlphabet[1][1] = "-..";
    //         this.englishAlphabet[1][2] = "-.-.";
    //         this.englishAlphabet[1][3] = "";
    //         this.englishAlphabet[1][4] = "E";
    //         this.englishAlphabet[1][5] = "F";
    //         this.englishAlphabet[1][6] = "G";
    //         this.englishAlphabet[1][7] = "H";
    //         this.englishAlphabet[1][8] = "I";
    //         this.englishAlphabet[1][9] = "J";
    //         this.englishAlphabet[1][10] = "K";
    //         this.englishAlphabet[1][11] = "L";
    //         this.englishAlphabet[1][12] = "M";
    //         this.englishAlphabet[1][13] = "N";
    //         this.englishAlphabet[1][14] = "O";
    //         this.englishAlphabet[1][15] = "P";
    //         this.englishAlphabet[1][16] = "Q";
    //         this.englishAlphabet[1][17] = "R";
    //         this.englishAlphabet[1][18] = "S";
    //         this.englishAlphabet[1][19] = "T";
    //         this.englishAlphabet[1][20] = "U";
    //         this.englishAlphabet[1][21] = "V";
    //         this.englishAlphabet[1][22] = "W";
    //         this.englishAlphabet[1][23] = "X";
    //         this.englishAlphabet[1][24] = "Y";
    //         this.englishAlphabet[1][25] = "Z";
    //     }
    //  }
</script>