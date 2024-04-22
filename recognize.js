const express = require("express");
const fs = require("fs");
const recorder2 = require("node-record-lpcm16");

const { Wake } = require('./commands');

// const Gpio = require('onoff').Gpio;
// const redLed = new Gpio(17, 'in');
// const greenLed = new Gpio(27, 'out'); 

const ytsr = require("ytsr");
const ytdl = require("ytdl-core");

const speech = require("@google-cloud/speech");

const speechClient = new speech.SpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = "speechtotext.json";

const file = fs.createWriteStream("output.wav", { encoding: "binary" });
let transcription;

async function recognize() {
  const recording = recorder2.record({
    sampleRate: 16000,
  });
  // greenLed.writeSync(1);
  // redLed.writeSync(0);
   let recordingEvent =  recording.stream();
   recordingEvent.pipe(file);

  async function recognizeSpeech() {
    const file = fs.readFileSync("./output.wav");
    const audioBytes = file.toString("base64");
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      audio_channel_count: 1,
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n")
      .toLowerCase();
    console.log(`Transcription: ${transcription}`);
  }

  try {
    setTimeout(() => {
      recording.stop();
      // greenLed.writeSync(0);
      // redLed.writeSync(1);
      recognizeSpeech();
      setTimeout(()=>{
      if (transcription.includes('play')) {
          console.log("working inside");
          handleplaymusic();
          // Wake()
         }
         else{
          setTimeout(()=>{
            handleplaymusic();
            // Wake()
          },5000)
         }
    },3000)
    
    }, 8000);
    
  } catch (error) {
    console.log("GCP  Error:" + error);
  }

  recordingEvent.on("error", (error)=>{
    console.log("recorder2 Error:" + error)
  })
}


module.exports = { recognize };


async function handleplaymusic() {
  let Song;
  if (transcription.includes("play")) {
    let words = transcription.split(" ");
    let playIndex = words.indexOf("play");
    console.log(playIndex)
    if (playIndex !== -1) {
      Song = words.slice(playIndex + 1).join(" ");
    }
  }

  const options = {
    pages: 1,
    filter: item => item.type === 'video'
  };

  let Videourl;
  let songName;
  try {
    const searchResults =  await ytsr(Song, options);
    const videos = searchResults.items.filter(item => item.type === 'video');

    Videourl = videos[0].url;
    songName = videos[0].title;

    console.log(`songName:${songName}`);
    console.log(`Videourl:${Videourl}`);

    // const stream = ytdl(Videourl, { filter: "audioonly" });
  } catch (error) {
    console.log(error);
  }
  
}