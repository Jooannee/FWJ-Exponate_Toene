import React, { useEffect } from "react";
import { useAudio } from "./AudioContext"; // Ensure the path is correct

interface AudioButtonProps {
  audioFile: string;
  shouldInitialStateBePlaying: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  audioFile,
  shouldInitialStateBePlaying,
}) => {
  const { playAudio, playing, setAudio, pauseAudio } = useAudio();

  useEffect(() => {
    setAudio(`media/${audioFile}.mp3`);
  }, [audioFile]);

  useEffect(() => {
    if (shouldInitialStateBePlaying) {
      playAudio();
    }
  }, [shouldInitialStateBePlaying]);

  const handleClick = () => {
    playing ? pauseAudio() : playAudio();
  };

  return (
    <div
      className="col-6"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          fontSize: "1.2em",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {!playing ? "▶️" : "⏸️"}
      </button>
    </div>
  );
};

export default AudioButton;
