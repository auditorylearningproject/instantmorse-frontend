import { useAudioStore, type Clip } from '@/stores/recorder';
import axios from 'axios';
import { type AxiosResponse } from 'axios';
//import type { Store } from 'pinia';

let store: ReturnType<typeof useAudioStore>;

// const DefaultSpeechRecognitionUrl = "https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=" + lang;
const lang = "en-US"

export class Transcriber{

    async transcribe(audioID: number): Promise<string> {
        const recording = (store.getRecording(audioID) as Clip).audio as Blob 

        try {
          //const result = await sendRecordingRequest(recording, null, lang, 0, false, true);
          const result = await this.sendRecordingRequest(recording);
          
          console.log('Recognition result:', result);
          return result;
        } catch (error) {
            // Handle any errors that occur during recognition
            console.error('Recognition error:', error);
            return "Error";
        }
    }

  private async sendRecordingRequest(recording: Blob): Promise<string> {
      try {
          // Extract content type from recording.value (e.g., "audio/ogg; codecs=opus")
        //  const contentType = recording.type.split('/')[1].split().trim();
          const formatStart = recording.type.indexOf("audio/") + "audio/".length;
          const formatEnd = recording.type.indexOf(";");
          const contentType = formatEnd === -1 ? recording.type.substring(formatStart) : recording.type.substring(formatStart, formatEnd);
          const url = (location.origin);
          // Make web request to the API endpoint with appropriate headers


          const formData = new FormData();
          formData.append('file', recording, 'recording');
  
          // Make web request to the API endpoint with FormData and appropriate headers
          const response: AxiosResponse = await axios.post(
              url + '/api/transcribe',
              formData,
              {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                      'Audio-Type': contentType
                  }
              }
          );
          console.log(response.data.transcript)
                      //'Content-Disposition': 'attachment; filename=recording', // Optional
          // Assuming the API response contains the transcribed text
          return response.data.transcript as string;
      } catch (error) {
        if (error instanceof Error && error.message) {
          throw new Error('Error sending recording request: ' + error.message);
      } else {
          throw new Error('Error sending recording request: Unknown error');
      }      
    }
  }


    constructor(){
        store = useAudioStore();
    
    }

  }
  
  // Example usage:
  // const recognizer = new SpeechRecognizer();
  // const audioData = new AudioData(/* your audio data here */);
  // const result = recognizer.recognize_google(audioData);
  // console.log(result);

  // Better compartamentalize this code to add test cases
