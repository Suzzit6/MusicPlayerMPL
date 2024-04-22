import Audic from 'audic';
// const {Audic} = require("audic");

const audic = new Audic('intro.mp3');

 audic.play();

audic.addEventListener('ended', () => {
    audic.destroy();
});