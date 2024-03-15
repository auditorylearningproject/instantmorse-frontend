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

    <p>{{playerMinString + ":" + playerSecString + " / " + playerMaxMinute.toFixed(0) + ":" + playerMaxSecTens.toFixed(0) + playerMaxSecOnes.toFixed(0)}}</p>

    <div>
        <button @click="pause">Play/Pause</button>
        <button @click="stop">Stop</button>
        <button @click="download">Download MP3</button>
    </div>
    <div ref="player"></div>
</template>

<script lang = "ts" setup>
import { onMounted, ref, watch, type Ref, computed, type ComputedRef } from "vue"
import { jscw } from "./jscwlib.js"
import { setTextRange } from "typescript";
import { timeStamp } from "console";
const playerMax = ref(0);
const playerMaxSec = ref(0);
const playerMaxSecOnes = ref(0);
const playerMaxSecTens = ref(0);
const playerMaxMinute = ref(0);
const playerValue = ref(0);
const playerSecString = ref("");
const playerMinString = ref("");
const player = ref(null);
const emit = defineEmits(['playbackFinished']);

function setup_jscw() {
    jscw_var.setWpm(30);
    jscw_var.setText("Lorem");// ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cras fermentum odio eu feugiat pretium. Euismod quis viverra nibh cras pulvinar mattis nunc. At urna condimentum mattis pellentesque id nibh tortor id. Nunc lobortis mattis aliquam faucibus purus. Ut porttitor leo a diam sollicitudin tempor. Cras fermentum odio eu feugiat pretium.");
    jscw_var.setCallback(updatePlayTime);
    jscw_var.startLoop();
    jscw_var.renderPlayer(player.value, jscw_var);
}

function updatePlayTime(max: number, value: number) {
    playerMax.value = max;
    playerMaxSec.value = playerMax.value % 60;
    playerMaxSecOnes.value = playerMaxSec.value % 10;
    playerMaxSecTens.value = Math.floor(playerMaxSec.value / 10);
    playerMaxMinute.value = Math.floor(playerMax.value / 60);
    playerValue.value = Math.ceil(value);
    if (playerValue.value >= 0) {
        switch (playerValue.value % 60){
            case 0: 
                playerSecString.value = "00";
                break;
            case 1:
                playerSecString.value = "01";
                break;
            case 2:
                playerSecString.value = "02";
                break;
            case 3:
                playerSecString.value = "03";
                break;
            case 4:
                playerSecString.value = "04";
                break;
            case 5:
                playerSecString.value = "05";
                break;
            case 6:
                playerSecString.value = "06";
                break;
            case 7:
                playerSecString.value = "07";
                break;
            case 8:
                playerSecString.value = "08";
                break;
            case 9:
                playerSecString.value = "09";
                break;
            default:
                playerSecString.value = String(playerValue.value % 60);
        }
    }
    
    if (playerValue.value >= 0) {
        playerMinString.value = String(Math.floor(playerValue.value / 60));
    }
    if (max === value && value !== 0) {
        emit('playbackFinished');
    }
}

// jscwlib player render
onMounted(() => {
    setup_jscw();
});

// create a jscw variable and set base values
let jscw_var = new jscw()
let seekValue = ref(0);
let currentTime = ref(0);
const url = "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3"

// allow the user to play and pause the player
function pause() {
    if(playerValue.value == playerMax.value ||playerValue.value == 0) {
        jscw_var.play();
    } else {
        jscw_var.pause();
    }
}

// allow the user to stop the player: sets the player value to max
function stop() {
    jscw_var.stop();
}

// NOT WORKING!!
// allow the user to download the MP3 file from the player
function download() {
    
}
</script>