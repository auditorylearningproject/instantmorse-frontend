<template>
    <p>{{playerMinString + ":" + playerSecString + " / " + playerMaxMinute?.toFixed(0) + ":" + playerMaxSecTens?.toFixed(0) + playerMaxSecOnes?.toFixed(0)}}</p>

    <div>
        <button @click="pause" type="button" class="custom-button">Play/Pause</button>
        <button @click="stop" type="button" class="custom-button">Stop</button>
        <Panel header="Settings" class="settings" toggleable collapsed>
            <!-- <p>This is a standin for the Settings Panel</p> -->
            <div class="settingChoice">
                <h2>Words Per Minute</h2>
                <InputNumber v-model="updateWPM" class="settingItself" placeholder = "5" inputId ="minmax-buttons" mode="decimal" showButtons suffix="WPM" :min="0" :max="50"/>
            </div>
            <div class="settingChoice">
                <h2>Effective Word Speed</h2>
                <InputNumber v-model="updateEFF" class="settingItself" inputId="minmax-buttons" mode="decimal" showButtons suffix="WPM" :min="0" :max="updateWPM" />
            </div>
            <div class="settingChoice">
                <h2>Extra Word Space</h2>
                <InputNumber v-model="updateEWS" class="settingItself" inputId="minmax-buttons" mode="decimal" showButtons suffix="x" :min="0" :max="5" />
            </div>
            <div class="settingChoice">
                <h2>Frequency</h2>
                <InputNumber v-model="updateFreq" class="settingItself" inputId="minmax-buttons" mode="decimal" showButtons suffix="Hz" :min="300" :max="1500" />
            </div>
            <div style="white-space: pre-line"></div>
            <button @click="updateSettings" class="settingButtons" type="submit">Save Setttings</button>
            <div style="white-space: pre-line"></div>
            <button @click="restoreDefaults" class="settingButtons" type="reset">Restore Defaults</button>
        </Panel>
    </div>
</template>

<script lang = "ts" setup>
    import { onMounted, ref, watch, computed } from "vue";
    import { jscw } from "./jscwlib.js";
    import { useSettingsStore } from "@/stores/settings";
    import InputNumber from 'primevue/inputnumber';
    import Panel from 'primevue/panel';
import { update } from "lodash-es";
    // import ConfirmPopup from 'primevue/confirmpopup';

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
    const settingsStore = useSettingsStore();
    var currentWPM: number = settingsStore.getWPM;
    var currentEFF: number = settingsStore.getEFF;
    var currentEWS: number = settingsStore.getEWS;
    var currentFreq: number = settingsStore.getFreq;
    console.log(currentWPM);
    var showSettings: boolean = false;
    const updateWPM = ref(currentWPM);
    const updateEFF = ref(currentEFF);
    const updateEWS = ref(currentEWS);
    const updateFreq = ref(currentFreq);

    function setup_jscw() {
        jscw_var.setWpm(settingsStore.getWPM)
        jscw_var.setText(currentText.value)
        jscw_var.setCallback(updatePlayTime)
        jscw_var.startLoop()
    }

    function updatePlayTime(max: number, value: number) {
        if (max === value && value !== 0) { // check this first so that the start timer can begin after audio finishes playing
            emit('playbackFinished')
        }
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
    function toggleSettings() {
        showSettings = !showSettings;
    }

    function updateSettings() {
        settingsStore.updateFullUserSettings(updateWPM.value, updateEFF.value, updateEWS.value, updateFreq.value)
        jscw_var.setWpm(settingsStore.getWPM)
        jscw_var.setEff(settingsStore.getEFF)
        jscw_var.setEws(settingsStore.getEWS)
        jscw_var.setFreq(settingsStore.getFreq)
    }

    function restoreDefaults() {
        settingsStore.restoreDefaultSettings()
        jscw_var.setWpm(settingsStore.getWPM)
        jscw_var.setEff(settingsStore.getEFF)
        jscw_var.setEws(settingsStore.getEWS)
        jscw_var.setFreq(settingsStore.getFreq)
        updateWPM.value = settingsStore.getWPM
        updateEFF.value = settingsStore.getEFF
        updateEWS.value = settingsStore.getEWS
        updateFreq.value = settingsStore.getFreq
    }
</script>

<style scoped>
    .custom-button {
        margin-right: 10px; /* Adjust as needed */
        border: solid;
        border-width: .18rem;
        border-color: black;
        background-color: #4680d1;
        -webkit-text-fill-color: black;
        margin-top: .5rem;
    }
    .settings {
        margin-top: 1rem;
        border: solid;
        border-top-width: .2rem;
        border-right-width: 0rem;
        border-left-width: 0rem;
        border-bottom-width: 0rem;
        border-color: black;
        background-color: rgb(40, 44, 50);
        -webkit-text-fill-color: #4680d1;
    }
    .settingChoice {
        border: solid;
        margin-left: 20%;
        margin-right: 20%;
        border-width: .2rem;
        border-color: #4680d1;
        margin-bottom: 1.5%;
    }
    .settingButtons {
        border: solid;
        border-width: .18rem;
        border-color: black;
        background-color: #4680d1;
        margin-top: .2rem;
        margin-bottom: .2rem;
        -webkit-text-fill-color: black;
        
    }
    .settingItself {
        border: solid;
        border-width: .18rem;
        border-color: #4680d1;
        background-color: grey;
        -webkit-text-fill-color: black;
    }
</style>