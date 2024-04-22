const express = require("express");
const fs = require("fs");
const recorder = require("node-record-lpcm16");
// const { Player } = require('play-dl');
// const { Porcupine, BuiltinKeyword } = require("@picovoice/porcupine-node");


const speech = require("@google-cloud/speech");

const speechClient = new speech.SpeechClient();

const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
// const Speaker = require("speaker");
// const { error } = require("console");
// const player = new Player();

// const accessKey = "MCfP3JZN+nEIcv0z9lwebBdLEbN1lEtBdpQRGUNfNCIvUtvBU/3TtQ==";
// const keywordFilePath = "./wake_word.ppn";

// let porcupine = new Porcupine(accessKey, [keywordFilePath], [0.5]);
// let porcupine = new Porcupine(
//   accessKey, 
//   [BuiltinKeyword.JARVIS],
//   [keywordFilePath],
//   [0.5]);

process.env.GOOGLE_APPLICATION_CREDENTIALS = "speechtotext.json";

const file = fs.createWriteStream("output1.wav", { encoding: "binary" });

const recording = recorder.record({
    sampleRate: 16000,
  })

 recording.stream().pipe(file);
// let isRecording = true
// let frameLength = 512
let transcription;

async function recognizeSpeech() {
      const file = fs.readFileSync('./output1.wav');
      const audioBytes = file.toString('base64');
      const audio = {
          content: audioBytes,
      };
      const config = {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
          audio_channel_count: 1,

      };
      const request = {
          audio: audio,
          config: config,
      };

      const [response] = await speechClient.recognize(request);
      transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n')
          .toLowerCase();
      console.log(`Transcription: ${transcription}`);
  }
// let buffer = [];

// async function wake(){

  // recording.on("data", (data) => {

  //   let int16Array = new Int16Array(data.buffer, data.byteOffset, data.length / 2);
  //    // const frame = await recording.read();
  //   buffer.push(...int16Array);
  //   console.log(buffer.length)
  //   if (buffer.length >= frameLength) {
  //       let frame = int16Array.slice(0, frameLength);
  //       buffer = buffer.slice(frameLength);
  //       const success = porcupine.process(frame);
  //       console.log(success)
  //       if (success !== -1) {
  //           console.log("Wake word detected");
  //          
  //       }
  //   }

  setTimeout(() => {
    recording.stop()
    recognizeSpeech();
    
  }, 6000);

    // const result = porcupine.process(data);
    // if (result !== -1) {
    //   console.log("Wake word detected");
  
    // }
  

// }
// )}


// wake()
// recording.on("data", (data) => {

//   let result;
//   let chunkSize = 512;
//   for (let i = 0; i < data.length; i += chunkSize) {
//     let chunk = data.slice(i, i + chunkSize);
//     result = porcupine.process(chunk);

//   }
//   // const result = porcupine.process(data);
//   if (result !== -1) {
//     console.log("Wake word detected");
//     setTimeout(() => {
//       recording.stop()
//       // recognizeSpeech();
//       porcupine.release();
//     }, 10000);
//   }

// });

// recording.on("error", (error) => {
//   console.error("Recording error:", error);
// });
// setTimeout(() => {
//   recording.close();
//   porcupine.release();
// }, 30000);

setTimeout(() => {
  handleplaymusic()
}, 10000)

async function handleplaymusic() {
  let Song;
  console.log(transcription+"2nd")
  if (transcription.includes("play")) {
    let words = transcription.split(" ");
    console.log(words)
    let playIndex = words.indexOf("play");
    console.log(playIndex)
    if (playIndex !== -1) {
      Song = words.slice(playIndex + 1).join(" ");
      console.log(Song+" Inside playindex")
    }
  }

  const options = {
    pages: 1,
  };

  let Videourl;
  let songName;
  try {
    const searchResults = await ytsr(Song, options);

    Videourl = searchResults.items[0].url;
    songName = searchResults.items[0].title;

    console.log(`songName:${songName}`);
    console.log(`Videourl:${Videourl}`);

    // const stream = ytdl(Videourl, { filter: "audioonly" });
  } catch (error) {
    console.log(error);
  }

  // try {
  // const stream = ytdl(Videourl, { filter: "audioonly",  highWaterMark: 1<<25  })

  // const resource = createAudioResource(stream)

  // const dispatcher =  player.play(resource)

  // } catch (error) {
  // console.log(error)
  // }
}
