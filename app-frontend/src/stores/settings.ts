// import { defineStore} from 'pinia';
// import { ref, type Ref } from 'vue';
// import Slider from '@vueform/slider';


// export const useSettingsStore = defineStore('settings', {
//     state: () => ({
//         wpm: 30,
//         eff: 0
//     }),
//     getters: {
//         getWPM(): number{
//             return this.wpm;
//         },
//         getEFF(): number {
//             return this.eff;
//         }
//     },
//     // actions: {
//     //     setWPM(this: ReturnType<typeof useSettingsStore>, newWPM: number) {
//     //         this.wpm = newWPM;
//     //     }
//     // }

//     // NEXT: LOOK INTO WATCHERS IN PINIA TO TRY AND HAVE JSCWLIB AUTOMATICALLY UPDATE ITS SETTINGS WHEN SETTINGS IS UPDATED
// } )

import { defineStore } from 'pinia';
import type { ref, Ref } from 'vue';

export interface UserSettings {
    wpm?: number;
    eff?: number;
    freq?: number;
}

export const useSettingsStore = defineStore({
    id: 'settings',
    state: (): UserSettings => ({
        wpm: 30,
        eff: 0,
        freq: 600 // Added freq to the initial state
    }),
    getters: {
        getWPM(): number {
            return this.wpm || 0;
        },
        getEFF(): number {
            return this.eff || 0;
        }
    },
    actions: {
        restoreDefaultSettings() {
            this.wpm = 20;
            this.eff = 0;
            this.freq = 600;
        },
        updateUserSettings(w: number, e: number, f: number) {
            this.wpm = w;
            this.eff = e;
            if (f > 900) {
                f = 900;
            } else if (f < 300) {
                f = 300;
            }
            this.freq = f;
        },
        getUserSettings(): UserSettings {
            return { wpm: this.wpm || 0, eff: this.eff || 0, freq: this.freq || 0 };
        },
        // Subscribe function
        subscribeToChanges(callback: () => void): () => void {
            return this.$subscribe(callback);
        }
    }
});