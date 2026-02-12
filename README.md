# Response Time–Based Auditory Learning — Frontend

Browser-based user interface for a Morse code training platform that measures spoken response time after audio playback.

The application provides a self-paced alternative to traditional Morse code learning systems by focusing on instant recognition rather than typed transcription.

## What's the need for this app?

Morse code represents letters and numbers using sequences of short and
long tones (dots and dashes), and additionally, standardized spaces of silence (so it's 2D in that both the content and time dimension help you decode!)

Traditional training tools (eg. LCWO.net) require typing what you hear. This system instead measures how quickly you can recognize and say the character aloud.

## Application Goals

-   Play Morse code audio
-   Record the user’s spoken response
-   Send audio to the backend for analysis
-   Display accuracy and timing statistics
-   Allow configurable training parameters

## Tech Stack

Language: TypeScript

Framework: Vue

State Management: Pinia

Styling: Tailwind CSS

Tooling: Prettier, ESLint

## Key Features

-   Browser-based Morse training sessions
-   Microphone access via Web APIs
-   Real-time session interface
-   Adjustable training settings
-   User accounts and session history
-   Performance statistics display

## Application Flow

1.  User logs in or creates an account
2.  User configures session parameters
3.  System plays Morse audio
4.  Browser records spoken response
5.  Audio is sent to backend
6.  Results are returned and displayed

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
