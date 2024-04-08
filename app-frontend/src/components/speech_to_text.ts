import { useAudioStore, type Clip } from '@/stores/recorder';
import axios from 'axios';
import { type AxiosResponse } from 'axios';
//import type { Store } from 'pinia';

export type { Clip }

let store: ReturnType<typeof useAudioStore>;

// const DefaultSpeechRecognitionUrl = "https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=" + lang;
const lang = "en-US" //RFC5646 language tag

export class Transcriber{

    async transcribe(audioID: number): Promise<string[]> {
        const recording = (store.getRecording(audioID) as Clip).audio as Blob 

        try {
          //const result = await sendRecordingRequest(recording, null, lang, 0, false, true);
          const result = await this.sendRecordingRequest(recording);
          
          console.log('Recognition result:', result);
          
          return result;
        } catch (error) {
            // Handle any errors that occur during recognition
            console.error('Recognition error:', error);
            throw error;
          }
    }


  private async sendRecordingRequest(recording: Blob): Promise<string[]> {
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
          if (typeof response.data == 'string'){
            return [response.data]
          }else if(Array.isArray(response.data) && response.data.every(item => 'transcript' in item && 'confidence' in item)){
            const transcripts: string[] = response.data.map(item => item.transcript);
            return transcripts;
          }else{
            throw new Error('I have no idea what the API returned!');
          }
                      //'Content-Disposition': 'attachment; filename=recording', // Optional
          // Assuming the API response contains the transcribed text
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
        console.log("recording store created")
    
    }

  }
  
  // Example usage:
  // const recognizer = new SpeechRecognizer();
  // const audioData = new AudioData(/* your audio data here */);
  // const result = recognizer.recognize_google(audioData);
  // console.log(result);

  

import {ref, onMounted, onUnmounted, watchEffect, toValue, reactive, type ComputedRef } from 'vue';

let shouldStartImmediately: RecorderController | null = null;
function callbackMediaStreamReady(){
  if(shouldStartImmediately){
    shouldStartImmediately.startRecording();
  }
}

export enum RecorderEventType {
  RecordingStarted = "recording-started",
  RecordingStopped = "recording-stopped",
  RecordingPaused = "recording-paused",
}

// Define type for callback function
type RecorderEventCallback = (eventType: RecorderEventType | [Clip, number]) => void;

//Composable function - able to react to state changes
export function useRecorder(currentLetter: ComputedRef<string>, eventCallback: RecorderEventCallback){

//  const currentLetter = possibleNullCurrentLetter !== null ? possibleNullCurrentLetter.value : 'defaultValue';

  const recorderController = new RecorderController(toValue(currentLetter))
  if(toValue(currentLetter) !== ""){
    watchEffect(() => {
      //COMMENTED OUT CODE: This was used to begin recording as soon as the letter changed. Now, we call beginRecording()
      //  to wait until the cw player had time to finish playing.
    //   if(recorderController.begin){
       recorderController.currentLetter = toValue(currentLetter);
    //   if(recorderController.mediaRecorder){
    //     recorderController.startRecording();
    //   }else{
    //     shouldStartImmediately = recorderController;
    //   }
    // }
    })
  }


  onMounted(() => {
    recorderController.callbackRecordStop = function() {
      recorderController.mediaRecorder!.onstop = (e) => {
      // console.log("recorder stopped");
  
      // const clipName = prompt("Enter a name for your sound clip");
      // if(clipName === null) {
      //   alert("Recording not saved.");
      // }
      // else {
        console.log("recording being saved...")
        const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
  
        const audioFormat = isChrome ? "webm" : "ogg";
        const recording = new Blob(recorderController.data, { type: `audio/${audioFormat}; codecs=opus` });
        const recording_clip = {
          name: recorderController.currentLetter,
          audio: recording
          }

        console.log(":::", recorderController.currentLetter);
        store.addRecording(recording_clip);      
        
        eventCallback([recording_clip, (this.firstNoiseTimestamp! - this.beginRecordTimestamp!)]); // Emit recording started event
        // const clipContainer = document.createElement("article");
        // const clipLabel = document.createElement("p");
        // const audio = document.createElement("audio");
        // const deleteButton = document.createElement("button");
  
        // clipContainer.classList.add("clip");
        // audio.setAttribute("controls", "");
        // deleteButton.innerHTML = "Delete";
        // clipLabel.innerHTML = clipName;
  
        // clipContainer.appendChild(audio);
        // clipContainer.appendChild(clipLabel);
        // clipContainer.appendChild(deleteButton);
        // pElementRef.value.appendChild(clipContainer);
  
        // const blob = new Blob(data, { type: "audio/ogg; codecs=opus" });
        // data.length = 0
        // const audioURL = window.URL.createObjectURL(blob);
        // audio.src = audioURL;
  
  
      //} 
      recorderController.data = []
  
      };};
  
    })
    return recorderController
  
}

class RecorderController{
  public currentLetter: string;

  public currentStore = store;

  firstNoiseTimestamp: number | null = null;
  beginRecordTimestamp: number | null = null;
  // watchEffect(() => {
  //   //the audio file changed?
  // })
  
  readonly audioBitsPerSecond = 48000;

  audioContext!: AudioContext; 
  analyser!: AnalyserNode;
  silenceTimeout: number | null = null;
  silenceThreshold = 100; //frequency in Hz
  audioLoopSize = 100;

  micSensitivity = 0.003;

  
  pElementRef = ref();
  callbackRecordStop?: () => void;
  
  beginRecording(){ //only called by the Lesson View.
    console.log("BEGIN RECORDING!");
      if(this.mediaRecorder){
        this.startRecording();
        console.log("THIS.STARTRECORDING CALLED.")
      }else{
        shouldStartImmediately = this;
      }
  }
  startRecording(){
    this.lastEnd = 0;
    this.beginRecordTimestamp = performance.now();
    this.firstNoiseTimestamp = null;
    this.mediaRecorder!.start(this.audioLoopSize); // this makes the ondataavailable function get called every audioLoopSize milliseconds, or when the recording stops.
    this.audioContext.resume();
   // this.detectSilence();
  }
  stopRecording(){
    if(this.mediaRecorder?.state === 'recording'){
      this.mediaRecorder!.stop(); // triggers callbackRecordStop
      console.log(this.mediaRecorder!.state);
      this.stopSilenceDetection();
      
    }
  }
  captureMediaStream(stream: MediaStream){
    this.mediaRecorder! = new MediaRecorder(stream, {audioBitsPerSecond: this.audioBitsPerSecond });
  
    this.mediaRecorder!.ondataavailable = (e: { data: any; }) => {
      if (e.data.size > 500 && this.mediaRecorder!.state === "recording") {
        // Handle recorded data
        this.data.push(e.data);
        this.detectSilence();
       } else if (e.data.size <= 500 ){
          this.data.push(e.data)  
      }else if(this.mediaRecorder!.state !== "recording"){
        console.log("data passed after recording stopped, doing nothing.");
      }
    };
    this.callbackRecordStop!()
    callbackMediaStreamReady()
  
  }
  
  async combineAudioBlobs() { // assuming each blob is 200ms, then the last 5 will be one second

    const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
    const audioFormat = isChrome ? "webm" : "ogg";
    const someData: Blob = new Blob(this.data, { type: `audio/${audioFormat}; codecs=opus` }) //.slice(-5)

    const someArrBuff = await someData.arrayBuffer();

    return someArrBuff;
  }
  
  lastEnd = 0;
  
  audioBufferSlice(buffer: AudioBuffer, audioLoopSize: number, callback: (arg0: ErrorCallback | unknown, audBuf: AudioBuffer) => void): void {
    // if (!(this instanceof this.audioBufferSlice)) {
    //   this.audioBufferSlice(buffer, begin, end, callback);
    // }
    console.log("AUDIO BUFFER SLICE CALLED!")
  
    let error = null;
  
    const duration = buffer.duration;
    const channels = buffer.numberOfChannels;
    const rate = buffer.sampleRate;
  
    // if (typeof end === 'function') {
    //   callback = end;
    //   end = duration;
    // }
  
    // milliseconds to seconds
    //also, ignoring the values passed in by the function and hardcoding the last 1 second of audio if possible. Sorry.
    let end = duration*1000;/// in ms
    let begin = this.lastEnd; /// in ms. -30000 compensates for random delays.
  
    if (end > (duration*1000)) {
      //error = new RangeError('end time must be less than or equal to ' + duration);
      end = duration*1000;
    }
    this.lastEnd = end;

    // if (begin <= 0) {
    //   //error = new RangeError('begin time must be greater than 0');
    //   begin = ((duration*1000)-audioLoopSize) <= 0 ? 0 : ((duration*1000)-audioLoopSize)
    // }
    
    if (typeof callback !== 'function') {
      error = new TypeError('callback must be a function');
    }
  
    const startOffset = begin === 0 ? 0 : (rate * begin)/1000;
    const endOffset = (rate * end)/1000;
    const frameCount = endOffset - startOffset;
    console.log("startoffset: ", startOffset, " endOffset: ", endOffset);
    let newArrayBuffer;
    if(frameCount < 0){
      console.error("endoffset is smaller than startoffset! Error...");
      return;
    }
    try {
      newArrayBuffer = this.audioContext.createBuffer(channels, endOffset - startOffset, rate);
      const anotherArray = new Float32Array(frameCount);
      const offset = 0;
  
      for (let channel = 0; channel < channels; channel++) {
        buffer.copyFromChannel(anotherArray, channel, startOffset);
        newArrayBuffer.copyToChannel(anotherArray, channel, offset);
      }
    } catch(e) {
      error = e;
    }
  
    callback(error, newArrayBuffer as AudioBuffer);
  }

  noiseDetected = ref(false);

  async detectSilence() {
    
    const buf: ArrayBuffer = await this.combineAudioBlobs();
    console.log("buf.bytelength: " + buf.byteLength);
    this.audioContext.decodeAudioData(buf, async (audioBuffer) => {

      const bufferPromise = new Promise<AudioBuffer>((resolve, reject) => {
        // Your existing audioBufferSlice function
        this.audioBufferSlice(audioBuffer, this.audioLoopSize, (error, audBuf) => {
          if (error) {
            reject(error);
          } else {
            resolve(audBuf);
          }
        });
      });
      // Create an AudioBufferSourceNode
      const sourceNode = this.audioContext.createBufferSource();

      // Connect the AudioBuffer to the AudioBufferSourceNode
      sourceNode.buffer = await bufferPromise;//audioBuffer
      //console.log("len", (await bufferPromise).length)
     // this.analyser.disconnect();

      sourceNode.connect(this.analyser);
      sourceNode.start();

      // Connect the AudioBufferSourceNode to the audio context's destination (e.g., speakers)
      // sourceNode.connect(audioContext.destination);

     // const bufferLength = this.analyser.frequencyBinCount;
     // const dataArray = new Uint8Array(bufferLength);
      
      //this.analyser.getByteFrequencyData(dataArray);

      // let avgVolume = 0;
      // for(let i = 0; i < dataArray.length; i++) {
      //   avgVolume += dataArray[i];
      // }
      // avgVolume = avgVolume / dataArray.length;
      const bufferLength = this.analyser.fftSize;
      const buffer = new Float32Array(bufferLength);
      this.analyser.getFloatTimeDomainData(buffer);

      const vol = this.autoCorrelate(this.analyser, buffer, this.audioContext.sampleRate);

      //const averageVolume = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
      console.log("frequency: ", vol, " buffer slice size: ", bufferLength);
      console.log("noise detect: ", this.noiseDetected.value)
      //sourceNode.disconnect()

      if (vol < this.silenceThreshold) {
        // Silence detected, start or reset the timeout
        if (this.silenceTimeout === null && this.noiseDetected.value) {
          this.silenceTimeout = window.setTimeout(() => 
            {
              this.stopRecording(); 
              this.noiseDetected.value = false;
              console.log("No noise for one second, recording stopped!")
            }, 1000); // 1000ms = 1 second
        }
      } else {
        this.noiseDetected.value = true
        if(!this.firstNoiseTimestamp){
          this.firstNoiseTimestamp = performance.now();
        }
        // Reset the timeout when there's noise
        if (this.silenceTimeout !== null) {
          window.clearTimeout(this.silenceTimeout);
          this.silenceTimeout = null;
        }
      }
    },
    (error) => {
      console.error(`Unable to fetch the audio file. Error: ${error.message}`);
    });


  }
  stopSilenceDetection() {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
    //this.analyser.disconnect();
  }
  
  deleteRecording(index: number) {
    //allClips.value.splice(index, 1);
    store.clearRecordings();
  }
  
  getAudioURL(clip: Blob): string {
    const isChrome = navigator.userAgent.indexOf("Chrome") !== -1;
    const audioFormat = isChrome ? "webm" : "ogg";
    return URL.createObjectURL(new Blob([clip], { type: `audio/${audioFormat}; codecs=opus` }));
  }

  
  /*
  autoCorrelate(analyser: AnalyserNode, buffer: Float32Array, sampleRate: number): number{
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumOfSquares += val * val;
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
      return -1;
    }


    // Create a new array of the sums of offsets to do the autocorrelation
    const offsetSums = new Array(buffer.length).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let offset = 0; offset < buffer.length; offset++) {
      for (let j = 0; j < SIZE - offset; j++) {
        offsetSums[offset] = offsetSums[offset] + buffer[j] * buffer[j+offset]
      }
    }

    // Calculate the offset with the highest value
    let maxValue = -1;
    let bestOffset = -1;
    for (let i = 0; i < offsetSums.length; i++) {
      if (offsetSums[i] > maxValue) {
        maxValue = offsetSums[i];
        bestOffset = i;
      }
    }

    // Once we have the best offset for the repetition, we can calculate the frequency from the sampleRate
    const frequency = sampleRate / bestOffset
    return frequency;
  }
  */
  autoCorrelate(analyser: AnalyserNode, buffer: Float32Array, sampleRate: number) {
    // Perform a quick root-mean-square to see if we have enough signal
    let SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumOfSquares += val * val;
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < this.micSensitivity && SIZE <= 10000) { //was 0.01
      return -1;
    }//if the buffer size is big, then only a small portion of the buffer might actually be talking.
  
    // Find a range in the buffer where the values are below a given threshold.
    let r1 = 0;
    let r2 = SIZE - 1;
    const threshold = 0.2;
  
    // Walk up for r1
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
  
    // Walk down for r2
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }
  
    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length
  
    // Create a new array of the sums of offsets to do the autocorrelation
    const c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
      }
    }
  
    // Find the last index where that value is greater than the next one (the dip)
    let d = 0;
    while (c[d] > c[d+1]) {
      d++;
    }
  
    // Iterate from that index through the end and find the maximum sum
    let maxValue = -1;
    let maxIndex = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }
  
    let T0 = maxIndex;
  
    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1]
  
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2
    if (a) {
      T0 = T0 - b / (2 * a);
    }
  
    return sampleRate/T0;
  }
  
  
  mediaRecorder?: MediaRecorder;
  
  data: Blob[] = []
  
  allClips = store.recordings//reactive(store.recordings);
  
  constructor(currentLetter: string){
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia({
          // constraints - only audio needed for this app
          audio: true,
        })
        // Success callback
        .then(async (stream) => {
          this.audioContext = new window.AudioContext();
          this.captureMediaStream(stream);
          console.log("audioContext created")
        //  this.audioContext.createBuffer(1,)
          this.analyser = new AnalyserNode(this.audioContext, {
            fftSize: 8192
          }); //can add properties
          //const source = this.audioContext.createMediaStreamSource(stream as MediaStream);
          
        })
        // Error callback
        .catch((err: any) => {
          console.error(`The following getUserMedia error occurred: ${err}`);

        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }

    this.currentLetter = currentLetter

  }
  
}