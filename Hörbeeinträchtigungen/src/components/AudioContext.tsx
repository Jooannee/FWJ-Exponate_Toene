import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface IAudioContext {
  playAudio: () => void;
  stopAudio: () => void;
  setVolume: (volume: number) => void;
  setAudio: (src: string) => void;
  pauseAudio: () => void;
  playing: boolean;
}

const AudioContext = createContext<IAudioContext | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [audio, setAudioState] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.5); // Default volume level
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audio]);

  const setAudio = (src: string) => {
    setAudioState(
      new Audio(src + "?noCache=" + Math.floor(Math.random() * 1000000))
    );
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
      setPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      setAudioState(null);
    }
  };

  const pauseAudio = () => {
    if (audio) {
      audio.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (audio) {
      playing ? audio.play() : audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", () => setPlaying(false));
      return () => {
        audio.removeEventListener("ended", () => setPlaying(false));
      };
    }
  }, [audio]);

  return (
    <AudioContext.Provider
      value={{ playAudio, stopAudio, setVolume, playing, setAudio, pauseAudio }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
