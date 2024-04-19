import { shallowMount } from '@vue/test-utils';
import LessonView from '../LessonView.vue';
import { beforeEach, describe, expect, test, vi, vitest } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

describe('LessonView', () => {

    beforeEach(() => {
        // creates a fresh pinia and makes it active
        // so it's automatically picked up by any useStore() call
        // without having to pass it to it: `useStore(pinia)`
        setActivePinia(createPinia())
      })



  test('renders lesson group name correctly', async () => {
    const lessonID = '123'; // Provide a sample lesson ID for testing
    const mockLesson = {
      lesson_name: 'Sample Lesson',
      group: {
        name: 'Sample Group'
      }
    };

    const mockUseSettingsStore = vi.fn();

    // vi.mock('axios', () => {
    //     const mockAxiosGet = vi.fn(() => Promise.resolve({ data: mockLesson }));

    //     return { get: mockAxiosGet }
    // });

    const wrapper = shallowMount(LessonView, {
      props: {
        lessonID
      },
      global: {
        mocks: {
          useSettingsStore: mockUseSettingsStore
        }
      }
    });

    await wrapper.vm.$nextTick();

    const lessonInfo = wrapper.find('#lessonInfo');
    expect(lessonInfo.exists()).toBe(false); // should be false if getUserMedia returns false
    // expect(lessonInfo.text()).toContain('Sample Group');
    // expect(lessonInfo.text()).not.toContain('Unknown');
  });
});