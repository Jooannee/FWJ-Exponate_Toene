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

let playing = false;
async function globalPlayOscillator(type, amp, freq, duration = 0.5) {
  if (playing) {
    return;
  }
  osc.stop();
  console.log("playing oscillator", type, amp, freq, duration);
  osc.setType(type);
  osc.amp(amp);
  osc.freq(freq);
  osc.start();
  playing = true;
  await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  osc.stop();
  playing = false;
}

function preload() {}

function setup() {
  // try to get audio component every 200 ms until it is available
  sketch = document.querySelector("#sketch");
  if (!sketch) {
    setTimeout(setup, 200);
    return;
  }

  const parent = document.querySelector("#sketch");
  const width = parent.offsetWidth;
  const height = 250;

  var cnv = createCanvas(width, height);
  cnv.parent("sketch");

  // when parent changes width, update canvas width
  new ResizeObserver((entries) => {
    const parent = entries[0];
    resizeCanvas(parent.contentRect.width, height);
    scaleChanged = true;
  }).observe(parent);

  noStroke();
  colorMode(HSB);

  var smoothing = 0;
  fft = new p5.FFT(smoothing, binCount);

  for (var i = 0; i < binCount; i++) {
    bins[i] = new Bin(i, binCount);
  }

  fft.setInput(osc);

  // Create an amplitude analyzer
  // amplitude = new p5.Amplitude();
  // amplitude.setInput(osc);

  activity();
}
// function calculateDecibels(amplitudes) {
//   // Convert amplitudes (0-255) to a normalized range (0-1)
//   const normalizedAmplitudes = amplitudes.map((amplitude) => amplitude / 255);

//   // Convert normalized amplitudes to decibels
//   const decibels = normalizedAmplitudes.map(
//     (amplitude) => 20 * Math.log10(amplitude + 1e-6)
//   );

//   return decibels;
// }

function draw() {
  background(0);

  if (!fft) {
    return;
  }

  var spectrum = fft.analyze();

  // // Calculate and log average decibel value
  // if (playing) {
  //   // Get the current amplitude level
  //   // Get the current amplitude level
  //   let level = amplitude.getLevel();
  //   console.log(level);
  //   // Avoid log of zero by setting a minimum threshold
  //   let minLevel = max(level, 0.0001);
  //   // Convert amplitude level to decibels
  //   let decibels = 20 * Math.log10(minLevel);
  //   // console.log(decibels);

  //   // Display the decibels
  //   textSize(32);
  //   fill(50);
  //   textAlign(CENTER, CENTER);
  //   text("Decibels: " + nf(decibels, 1, 2), width / 2, height / 2);
  // }

  if (scaleChanged) {
    scaleChanged = false;
    if (logView) {
      for (var i = 0; i < binCount; i++) {
        bins[i].setLogPosition(i, binCount);
      }
    } else {
      for (var i = 0; i < binCount; i++) {
        bins[i].setLinPosition(i, binCount);
      }
    }
    mouseMoved();
  }

  for (var i = 0; i < binCount; i++) {
    bins[i].draw(spectrum[i]);
  }

  samples = fft.waveform();
  var bufLen = samples.length;

  var best_offset = 0;
  var best_sample_diff = -1;
  for (var i = 0; i < bufLen / 2; i++) {
    sample_diff = sampleDiff(i, samples, old_sample_offset, old_samples);
    if (best_sample_diff < 0 || sample_diff < best_sample_diff) {
      best_sample_diff = sample_diff;
      best_offset = i;
    }
  }

  noFill();
  stroke(0, 0, 150, 0.7);
  strokeWeight(4);
  beginShape();
  var points = bufLen - Math.max(best_offset, bufLen / 2);
  for (var i = 0; i < points; i++) {
    var x = map(i, 0, points, 0, width);
    var y = map(samples[i + best_offset], -1, 1, -height / 4, height / 4);
    vertex(x, y + height / 4);
  }
  endShape();
  noStroke();
  old_samples = samples;
  old_sample_offset = best_offset;
  var timespan = String(Math.round((points / sampleRate()) * 1000) / 1000);
  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  textAlign(LEFT, BOTTOM);
  // text(timespan + "s    ", width - 50, height / 4 + 4);
  labelStuff();
}

function sampleDiff(sample1_offset, sample1, sample2_offset, sample2) {
  var sum_errs = 0;
  var n = 0;
  for (var i = 0; i < sample1.length; i++) {
    if (i + sample1_offset >= sample1.length) break;
    if (i + sample2_offset >= sample2.length) break;
    var err = sample1[i + sample1_offset] - sample2[i + sample2_offset];
    sum_errs += err * err;
    n++;
  }
  return sum_errs / n;
}

// draw text
function labelStuff() {
  textSize(12);
  if (selectedBin) {
    fill("blue");
    text(selectedBin.freq + "Hz", mouseX + 10, mouseY);
    osc.freq(selectedBin.freq);
  }

  fill(255);

  // fft x-axis tick marks
  var next_freq = bins[bins.length / 1024].freq;
  if (next_freq < 1) next_freq = 100;
  var last_x = -1000;
  var unit = "Hz";
  for (var i = 0; i < bins.length - 1; i++) {
    var err = bins[i].freq - next_freq;
    err *= err;
    var next_err = bins[i + 1].freq - next_freq;
    next_err *= next_err;
    if (err < next_err) {
      // this is the closest bin to next_freq
      rect(bins[i].x, height - 5, 2, -20);
      if (bins[i].x - last_x > 30) {
        // avoid overlapping labels
        text(bins[i].freq + unit, bins[i].x, height - 25);
        unit = ""; // only display units on the first label
      }
      next_freq *= 2;
      last_x = bins[i].x;
    }
  }
  // Draw x and y axis
  // stroke(255);
  // strokeWeight(2); // Make x-axis thicker
  // line(0, height - 5, width - 55, height - 5); // x-axis adjusted to leave more space on the right
  // line(5, 10, 5, height); // y-axis
  // // Draw arrowheads
  // line(width - 55, height - 5, width - 60, height - 10); // x-axis arrowhead line 1
  // line(width - 55, height - 5, width - 60, height); // x-axis arrowhead line 2
  // line(5, 10, 0, 15); // y-axis arrowhead line 1
  // line(5, 10, 10, 15); // y-axis arrowhead line 2
  // stroke(0);
  // fill(255);
  // textSize(20);
  // text("Frequenz", width - 85, height - 5); // x-axis label adjusted
  // push();
  // translate(10, 20);
  // text("Amplitude", 0, 0); // y-axis label
  // pop();
  strokeWeight(0); // Make x-axis thicker
}

function activity() {
  last_activity = Date.now();
}

var logView = true;
function toggleScale() {
  logView = !logView;
  scaleChanged = true;
}

function mouseMoved() {}

// ==========
// Bin Class
// ==========
var Bin = function (index, totalBins) {
  // maybe redundant
  this.index = index;
  this.totalBins = totalBins;
  this.color = color(map(this.index, 0, this.totalBins, 0, 255), 255, 255);

  this.isTouching = false;
  this.x;
  this.width;
  this.value;
  var nyquist = sampleRate() / 2.0;
  this.freq = Math.round((this.index * nyquist) / this.totalBins);
};

Bin.prototype.setLogPosition = function (i, totalBins) {
  this.x = map(Math.log(i + 1), 0, Math.log(totalBins + 1), 0, width - 70);
  this.width =
    map(Math.log(i + 2), 0, Math.log(totalBins + 1), 0, width - 70) - this.x;
};

Bin.prototype.setLinPosition = function (i, totalBins) {
  this.x = map(i, 0, totalBins - 1, 0, width - 200);
  this.width = width / totalBins;
};

Bin.prototype.draw = function (value) {
  var h = map(value, 0, 255, height, 0) - height;
  this.value = value;

  if (this.isTouching) {
    selectedBin = this;
    fill(100);
  } else {
    fill(this.color);
  }
  rect(this.x, height, this.width, h);
};
