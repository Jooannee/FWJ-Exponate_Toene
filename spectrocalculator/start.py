import json
import numpy as np
import librosa
import sys

class SpectrogramGenerator:
    def __init__(self, wav_file_path, n_fft=2048, win_length=None, hop_length=512, n_mels=128, f_min=0.0, power=2.0, top_db=80.0):
        self.wav_file_path = wav_file_path
        self.n_fft = n_fft
        self.win_length = win_length
        self.hop_length = hop_length
        self.n_mels = n_mels
        self.f_min = f_min
        self.power = power
        self.top_db = top_db
        self.sxx = None

    def calc_sxx(self):
        waveform, sample_rate = librosa.load(path=self.wav_file_path, sr=None)

        mel_spec = librosa.feature.melspectrogram(y=waveform,
                                                  sr=sample_rate,
                                                  n_fft=self.n_fft,
                                                  win_length=self.win_length,
                                                  hop_length=self.hop_length,
                                                  n_mels=self.n_mels,
                                                  fmin=self.f_min,
                                                  power=self.power)

        mel_spec = librosa.amplitude_to_db(mel_spec, top_db=self.top_db)

        mel_spec = ((mel_spec - mel_spec.min()) /
                    (mel_spec.max() - mel_spec.min()) * 255).astype(np.uint8)

        self.sxx = mel_spec

    def save_to_json(self, json_file_path):
        if self.sxx is None:
            raise ValueError("Spectrogram not calculated. Please run calc_sxx() first.")

        data = self.sxx.tolist()  # Convert numpy array to list

        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file)

if __name__ == "__main__":
    # get filename as argument

    if len(sys.argv) != 2:
        print("Usage: python start.py <filename>")
        sys.exit(1)
    filename = sys.argv[1]

    wav_file_path = "audios/" + filename +".wav"  # Replace with your WAV file path
    json_file_path = "audios/" + filename + ".json"  # Replace with your desired JSON output path

    generator = SpectrogramGenerator(wav_file_path)
    generator.calc_sxx()
    generator.save_to_json(json_file_path)
