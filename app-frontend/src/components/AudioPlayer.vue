<template>
    <progress
        :max="playerMax"
        :value="playerValue"
        readonly
    ></progress>

    <p>{{playerMinString + ":" + playerSecString + " / " + playerMaxMinute.toFixed(0) + ":" + playerMaxSecTens.toFixed(0) + playerMaxSecOnes.toFixed(0)}}</p>

    <div>
        <button @click="pause">Play/Pause</button>
        <button @click="stop">Stop</button>
        <Popper>
            <button>Settings</button>
            <template #content>
                <InputNumber v-model="updateWPM" inputId="Words Per Minute" mode="decimal" showButtons :min="5" :max="50" />
                <InputNumber v-model="updateEFF" inputId="Effective speed" mode="decimal" showButtons :min="0" :max="50" />
                <InputNumber v-model="updateEWS" inputId="Extra Word Space" mode="decimal" showButtons :min="0" :max="5" />
                <InputNumber v-model="updateFreq" inputId="Frequency" mode="decimal" showButtons :min="300" :max="1500" />
                <button @click="updateSettings">Save Setttings</button>
                <button @click="restoreDefaults">Restore Defaults</button>
            </template>
        </Popper>
    </div>

<script setup>
import { ref } from "vue"

const value1 = ref(20)
const value2 = ref(25)
const value3 = ref(10.5)
</script>

    <div ref="player"></div>
</template>

<script lang = "ts" setup>
import { onMounted, ref, watch, type Ref, computed, type ComputedRef } from "vue"
import { jscw } from "./jscwlib.js"
import { setTextRange } from "typescript"
import { timeStamp } from "console"
import { useSettingsStore } from "@/stores/settings"
import { defineComponent } from "vue"
import Popper from "vue-popper"
import InputNumber from 'primevue/inputnumber'
// const wordsPerMinute = ref(30)
const playerMax = ref(0)
const playerMaxSec = ref(0)
const playerMaxSecOnes = ref(0)
const playerMaxSecTens = ref(0)
const playerMaxMinute = ref(0)
const playerValue = ref(0)
const playerSecString = ref("")
const playerMinString = ref("")
const player = ref(null)
const emit = defineEmits(['playbackFinished'])
const props = defineProps<{ currentText: string}>()
const currentText = computed(() => props.currentText)
const settingsStore = useSettingsStore()
const currentWPM = settingsStore.getWPM
console.log(currentWPM)
const updateWPM: number = 0
const updateEFF: number = 0
const updateEWS: number = 0
const updateFreq: number = 0

function setup_jscw() {
    jscw_var.setWpm(settingsStore.getWPM)
    jscw_var.setText(currentText.value)
    jscw_var.setCallback(updatePlayTime)
    jscw_var.startLoop()
}

function updatePlayTime(max: number, value: number) {
    playerMax.value = max
    playerMaxSec.value = playerMax.value % 60
    playerMaxSecOnes.value = playerMaxSec.value % 10
    playerMaxSecTens.value = Math.floor(playerMaxSec.value / 10)
    playerMaxMinute.value = Math.floor(playerMax.value / 60)
    playerValue.value = value
    const intPlayerValue = Math.ceil(value)
    if (intPlayerValue >= 0) {
        switch (intPlayerValue % 60){
            case 0: 
                playerSecString.value = "00"
                break
            case 1:
                playerSecString.value = "01"
                break
            case 2:
                playerSecString.value = "02"
                break
            case 3:
                playerSecString.value = "03"
                break
            case 4:
                playerSecString.value = "04"
                break
            case 5:
                playerSecString.value = "05"
                break
            case 6:
                playerSecString.value = "06"
                break
            case 7:
                playerSecString.value = "07"
                break
            case 8:
                playerSecString.value = "08"
                break
            case 9:
                playerSecString.value = "09"
                break
            default:
                playerSecString.value = String(intPlayerValue % 60)
        }
    }
    
    if (intPlayerValue >= 0) {
        playerMinString.value = String(Math.floor(intPlayerValue / 60))
    }
    if (max === value && value !== 0) {
        emit('playbackFinished')
    }
}

// jscwlib player render
onMounted(() => {
    setup_jscw()
    watch(currentText, (newValue) => {
        jscw_var.setText(newValue)
    })
})

// create a jscw variable and set base values
let jscw_var = new jscw()
let seekValue = ref(0)
let currentTime = ref(0)

// allow the user to play and pause the player
function pause() {
    if(playerValue.value == playerMax.value ||playerValue.value == 0) {
        jscw_var.play()
    } else {
        jscw_var.pause()
    }
}

// allow the user to stop the player: sets the player value to max
function stop() {
    jscw_var.stop()
}

// NOT WORKING!!
// allow the user to download the MP3 file from the player
// function download() {
    
// }

function updateSettings() {
    settingsStore.updateUserSettings(updateWPM, updateEFF, updateEWS, updateFreq)
}

function restoreDefaults() {
    settingsStore.restoreDefaultSettings()
}
</script>