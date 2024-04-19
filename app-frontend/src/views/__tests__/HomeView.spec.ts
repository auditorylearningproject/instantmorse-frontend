import { VueWrapper, shallowMount } from '@vue/test-utils';
import axios from 'axios';
import HomeView from '../HomeView.vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

describe('HomeView', () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    const mockAxiosGet = vi.fn(() => Promise.reject()); // Rejecting the promise to simulate not being logged in

    vi.spyOn(axios, 'get').mockImplementation(mockAxiosGet);

    wrapper = shallowMount(HomeView);
    await wrapper.vm.$nextTick()
  });

  test('displays not logged in message', async () => {
    await wrapper.vm.$nextTick();

    const statusParagraph = wrapper.text();

    expect(statusParagraph).toMatch("You are currently not logged in.");
  });
});