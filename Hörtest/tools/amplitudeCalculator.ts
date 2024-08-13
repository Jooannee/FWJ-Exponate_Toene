import * as fs from "fs";

interface Frequency {
  frequency: number;
  realDecibels: number;
  amplitudesNeeded?: Array<{ targetDecibel: number; amplitudeNeeded: number }>; // Optional property to store the calculated amplitudes
}

const frequencies: Frequency[] = [
  {
    frequency: 29.4,
    realDecibels: 89.69196736,
  },
  {
    frequency: 34.9125,
    realDecibels: 92.07287204,
  },
  {
    frequency: 40.425,
    realDecibels: 93.14999691,
  },
  {
    frequency: 51.45,
    realDecibels: 92.20840137,
  },
  {
    frequency: 71.6625,
    realDecibels: 93.74782954,
  },
  {
    frequency: 90.0375,
    realDecibels: 95.9203504,
  },
  {
    frequency: 99.225,
    realDecibels: 96.80438174,
  },
  {
    frequency: 150.675,
    realDecibels: 95.27131912,
  },
  {
    frequency: 200.2875,
    realDecibels: 86.44329215,
  },
  {
    frequency: 299.5125,
    realDecibels: 88.07514312,
  },
  {
    frequency: 439.1625,
    realDecibels: 90.37605573,
  },
  {
    frequency: 850.7625,
    realDecibels: 91.82077197,
  },
  {
    frequency: 999.6,
    realDecibels: 91.90957831,
  },
  {
    frequency: 2001.0375,
    realDecibels: 96.0830975,
  },
  {
    frequency: 3500.4375,
    realDecibels: 94.82369504,
  },
  {
    frequency: 4500.0375,
    realDecibels: 95.97612947,
  },
  {
    frequency: 5999.4375,
    realDecibels: 104.8157207,
  },
  {
    frequency: 8000.475,
    realDecibels: 99.12182368,
  },
  {
    frequency: 9999.675,
    realDecibels: 86.94890546,
  },
  // Add more frequencies as needed
];

function calculateAmplitudeForTargetDecibel(
  realDecibels: number,
  targetDecibel: number,
  referenceAmplitude: number
): number {
  const decibelDifference = targetDecibel - realDecibels;
  return referenceAmplitude * Math.pow(10, decibelDifference / 20);
}

function calculateAmplitudesForRange(
  frequency: Frequency,
  referenceAmplitude: number,
  startDecibel: number,
  endAmplitude: number,
  stepSize: number
): Array<{ targetDecibel: number; amplitudeNeeded: number }> {
  const results: any = [];
  let amplitudeNeeded = 0;
  for (
    let targetDecibel = startDecibel;
    amplitudeNeeded < endAmplitude;
    targetDecibel += stepSize
  ) {
    amplitudeNeeded = calculateAmplitudeForTargetDecibel(
      frequency.realDecibels,
      targetDecibel,
      referenceAmplitude
    );
    if (amplitudeNeeded < 0.5) {
      results.push({ targetDecibel, amplitudeNeeded });
    }
  }
  return results;
}

function updateFrequenciesWithAmplitudes(
  frequencies: Frequency[],
  referenceAmplitude: number,
  startDecibel: number,
  endAmplitude: number,
  stepSize: number
): Frequency[] {
  return frequencies.map((frequency) => ({
    ...frequency,
    amplitudesNeeded: calculateAmplitudesForRange(
      frequency,
      referenceAmplitude,
      startDecibel,
      endAmplitude,
      stepSize
    ),
  }));
}

// Example usage:
const referenceAmplitude = 0.5;
const startDecibel = -20;
const endAmplitude = 0.3;
const stepSize = 1;

const updatedFrequencies = updateFrequenciesWithAmplitudes(
  frequencies,
  referenceAmplitude,
  startDecibel,
  endAmplitude,
  stepSize
);

console.log(JSON.stringify(updatedFrequencies)); // Output the updated frequencies with calculated amplitudes

fs.writeFileSync("frequencies.json", JSON.stringify(updatedFrequencies)); // Save the updated frequencies to a file
