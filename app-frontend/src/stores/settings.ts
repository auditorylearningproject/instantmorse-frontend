import { defineStore} from 'pinia';
import { ref, type Ref } from 'vue';
// import Slider from '@vueform/slider';
// const wpm = 20;
// const eff = 0;

// export interface UserSettings {
//     wpm?: number;
//     eff?: number;
//     freq?: number;
// }

// export const useSettingsStore = defineStore('settings', () => {
//     const settings: Ref<UserSettings> = ref({})
    
//     function restoreDefaultSettings() {
//         settings.value.wpm = 20;
//         settings.value.eff = 0;
//         settings.value.freq = 600;
//     }

//     function updateUserSettings(w: number, e: number, f: number) {
//         settings.value.wpm = w;
//         settings.value.eff = e;
//         if (f > 900) {
//             f = 900;
//         } else if (f < 300) {
//             f = 300;
//         }
//         settings.value.freq = f;
//     }

//     function getUserSettings() {
//         return settings;
//     }

//     return {settings, restoreDefaultSettings, updateUserSettings, getUserSettings} 
// });

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        wpm: 30,
        eff: 0
    }),
    getters: {
        getWPM(): number{
            return this.wpm;
        },
        getEFF(): number {
            return this.eff;
        }
    },
    // actions: {
    //     setWPM(this: ReturnType<typeof useSettingsStore>, newWPM: number) {
    //         this.wpm = newWPM;
    //     }
    // }
} )