var mic, osc, soundFile;
var currentSource = "mic";

var fft;
var binCount = 4096;
var bins = new Array(binCount);
var scaleChanged = true;
var samples = [];
var old_samples = [];
var old_sample_offset = 0;
var selectedBin;
var last_activity = 0;
var audio;
var p5Audio;
// var amplitude;

osc = new p5.Oscillator();
osc.setType("sine");
let playing = false;

function globalStopOscillator() {
  osc.stop();
}

async function globalPlayOscillator(amp, freq) {
  if (!playing) {
    osc.start();
    playing = true;
  }
  if (playing) {
    osc.amp(amp);
    osc.freq(freq);
  }
  console.log("playing oscillator", "sine", amp, freq);
}

function preload() {}

function setup() {
  // try to get audio component every 200 ms until it is available
}

function draw() {}

function sampleDiff(sample1_offset, sample1, sample2_offset, sample2) {}
