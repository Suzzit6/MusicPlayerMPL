const express = require("express");
const fs = require("fs");
const { recognize } = require("./recognize");
// const {handleplaymusic} = require('./index')

const { PvRecorder } = require("@picovoice/pvrecorder-node");
const { Porcupine, BuiltinKeyword } = require("@picovoice/porcupine-node");

// const Gpio = require('onoff').Gpio;

const Speaker = require("speaker");

const accessKey = "SEGeq9JWLVR+EVy4YrxVCVdnmzpzO2HVwvBYXoX2RkclNUDSxzEdEA==";
const keywordFilePath = "./wake_word.ppn";
let porcupine = new Porcupine(accessKey, [BuiltinKeyword.JARVIS], [0.5]);

const frameLength = 512;
const recorder = new PvRecorder(frameLength);
recorder.start();

let success;

async function Wake() {
  let buffer = [];
    while (recorder.isRecording) {
      const frame = await recorder.read();
      buffer.push(...frame);

      if (buffer.length >= frameLength) {
        let frame = buffer.slice(0, frameLength);
        buffer = buffer.slice(frameLength);
        success = porcupine.process(frame);
        if (success !== -1) {
          console.log("Wake word detected");
          recorder.stop();
          recognize();
          porcupine.release();
          break;
        }
      }
    }
  }


Wake();

module.exports = { Wake };
