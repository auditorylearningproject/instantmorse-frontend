const { assign } = Object;
const interimResults = { interimResults: true };
const once = { once: true };

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionError;
  }
  interface SpeechRecognitionError {
    readonly error: string;
  }

interface SpeechRecognition extends EventTarget {
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognition;
    webkitSpeechRecognition?: SpeechRecognition;
  }
}

export default (options = {}): Promise<Array<string>> => {
  let t: number = 0; 
  let ended = false;
  const sr: SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition)!;
  
  return new Promise((resolve, reject) => {
    const stop = (event?: Event) => {
      if (event) reject(event);
      clearTimeout(t);
      ended = true;
      sr.stop();
    };

    const result = ({ results }: SpeechRecognitionEvent) => {
      stop();
      const transcripts: Array<string> = [];
      for (const result of results) {
        if (result.isFinal) {
          for (const { transcript } of result) {
            transcripts.push(transcript);
            return;
          }
        }
      }
      resolve(transcripts);
    };

    assign(sr, options, interimResults);
    sr.onerror = sr.onnomatch = sr.onaudioend = stop;
    sr.onresult = (event: SpeechRecognitionEvent) => {
      if (ended) {
        result(event);
      } else {
        clearTimeout(t);
        t = window.setTimeout(result, 750, event);
      }
    };

    sr.start();
  });
};
