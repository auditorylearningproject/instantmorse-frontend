import { defineStore } from 'pinia';

export interface UserSettings {
    wpm?: number; //words per minute
    eff?: number; //effective speed
    ews?: number; //extra word space
    freq?: number; //frequency (Tone)
}

export const useSettingsStore = defineStore({
    id: 'settings',
    state: (): UserSettings => ({
        wpm: 20,
        eff: 0,
        ews: 0,
        freq: 600 // Added freq to the initial state
    }),
    getters: {
        getWPM(): number {
            return this.wpm || 0;
        },
        getEFF(): number {
            return this.eff || 0;
        },
        getEWS(): number {
            return this.ews || 0;
        },
        getFreq(): number {
            return this.freq || 0;
        }
    },
    actions: {
        restoreDefaultSettings() {
            this.wpm = 20;
            this.eff = 0;
            this.ews = 0;
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
        updateFullUserSettings(w: number, e: number, s: number, f: number) {
            this.wpm = w;
            this.eff = e;
            this.ews = s;
            if (f > 900) {
                f = 900;
            } else if (f < 300) {
                f = 300;
            }
            this.freq = f;
        },
        getUserSettings(): UserSettings {
            return { wpm: this.wpm || 0, eff: this.eff ||0, ews: this.ews || 0, freq: this.freq || 0 };
        },
        // Subscribe function
        subscribeToChanges(callback: () => void): () => void {
            return this.$subscribe(callback);
        }
    }
});