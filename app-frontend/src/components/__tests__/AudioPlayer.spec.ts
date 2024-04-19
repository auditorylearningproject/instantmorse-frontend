import { describe, test, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import AudioPlayer from '../AudioPlayer.vue'

import { setActivePinia, createPinia } from 'pinia'
import { useAudioStore } from '@/stores/recorder'
import PrimeVue from 'primevue/config'

beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })
  
describe('AudioPlayer', () => {
  test('text to play is passed correctly', () => {
    const wrapper = mount(AudioPlayer, { global: { plugins: [PrimeVue]}, props: { currentText: 'word to play' } })
    //expect(wrapper.()).toContain('Hello Vitest')
    const currentText = 'word to play';

    // Get the value of currentText property from the component instance and assert
    expect(wrapper.vm.currentText).toBe(currentText);  
    });


})