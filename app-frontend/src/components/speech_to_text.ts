import { useAudioStore, type Clip } from '@/stores/recorder';
import type { Store } from 'pinia';

let store: ReturnType<typeof useAudioStore>;

let lang = 'en-US'
// const DefaultSpeechRecognitionUrl = "https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=" + lang;

export class Transcriber{
    speechRecognizer: SpeechRecognizer

    transcribe(audioID: number): string {
        const recording = (store.getRecording(audioID) as Clip).audio //"audio/ogg; codecs=opus" OR WEBM
        let transcript = this.speechRecognizer.recognize_google(recording, null, lang, 0, false, true)
        transcript.then((result: string | { transcript: string; confidence: number } | null) => {
            // Handle the result here
            console.log('Recognition result:', result);
            //return result as string
          })
          .catch((error: any) => {
            // Handle any errors that occur during recognition
            console.error('Recognition error:', error);

          })
          return 'test'
    }
    constructor(){
        store = useAudioStore();
        this.speechRecognizer = new SpeechRecognizer()
    
    }
}

class SpeechRecognizer {
    energy_threshold: number;
    dynamic_energy_threshold: boolean;
    dynamic_energy_adjustment_damping: number;
    dynamic_energy_ratio: number;
    pause_threshold: number;
    operation_timeout: number | null;
    phrase_threshold: number;
    non_speaking_duration: number;

    constructor() {
        this.energy_threshold = 300;
        this.dynamic_energy_threshold = true;
        this.dynamic_energy_adjustment_damping = 0.15;
        this.dynamic_energy_ratio = 1.5;
        this.pause_threshold = 0.8;
        this.operation_timeout = null;
        this.phrase_threshold = 0.3;
        this.non_speaking_duration = 0.5;
      }

    async recognize_google(
      audio_data: Blob,
      key: string | null = null,
      language: string = "en-US",
      pfilter: number = 0,
      show_all: boolean = false,
      with_confidence: boolean = false
    ): Promise<string | { transcript: string; confidence: number; } | null> {
      if (!(audio_data instanceof Blob)) {
        throw new Error("audio_data must be audio data");
      }
      if (key !== null && typeof key !== "string") {
        throw new Error("key must be null or a string");
      }
      if (typeof language !== "string") {
        throw new Error("language must be a string");
      }
  
    //   const flac_data = audio_data.get_flac_data({
    //     convert_rate: audio_data.sample_rate >= 8000 ? null : 8000, // audio samples must be at least 8 kHz
    //     convert_width: 2, // audio samples must be 16-bit
    //   });
  
      if (key === null) {
        key = "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw";
      }
  
      const url = `http://www.google.com/speech-api/v2/recognize?${new URLSearchParams({
        client: "chromium",
        lang: language,
        key: key,
        pFilter: pfilter.toString(),
      })}`;
  
      const headers = { "Content-Type": `${audio_data.type} rate=8000` };
      const request = new Request(url, { method: "POST", body: audio_data, headers });
  
      try {
        const response = await fetch(request, {
            ...(this.operation_timeout !== null && { signal: AbortSignal.timeout(this.operation_timeout) }),
                  }); //research "spread operator"
        const response_text = await response.text();
  
        // ignore any blank blocks
        let actual_result: any = null;
        for (const line of response_text.split("\n")) {
          if (!line) continue;
          const result = JSON.parse(line).result;
          if (result.length !== 0) {
            actual_result = result[0];
            break;
          }
        }
  
        // return results
        if (show_all) {
          return actual_result;
        }
  
        if (!actual_result || !actual_result.alternative || actual_result.alternative.length === 0) {
          throw new Error("UnknownValueError");
        }
  
        const best_hypothesis =
          "confidence" in actual_result
            ? actual_result.alternative.reduce((prev: any, current: any) =>
                prev.confidence > current.confidence ? prev : current
              )
            : actual_result.alternative[0];
  
        if (!best_hypothesis.transcript) {
          throw new Error("UnknownValueError");
        }
  
        const confidence = best_hypothesis.confidence || 0.5;
  
        if (with_confidence) {
          return { transcript: best_hypothesis.transcript, confidence };
        }
  
        return best_hypothesis.transcript;
      } catch (e) {
        if (e instanceof Error) {
          if (e.name === "AbortError") {
            throw new Error("Recognition request failed: Timeout");
          }
          throw new Error(`Recognition request failed: ${e.message}`);
        }
        throw new Error("Recognition request failed");
      }
    }
  }
  
  // Example usage:
  // const recognizer = new SpeechRecognizer();
  // const audioData = new AudioData(/* your audio data here */);
  // const result = recognizer.recognize_google(audioData);
  // console.log(result);

  // Better compartamentalize this code to add test cases