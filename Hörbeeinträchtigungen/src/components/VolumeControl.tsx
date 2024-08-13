import React from "react";
import { useAudio } from "./AudioContext"; // This should import the context

const VolumeControl = () => {
  const audioContext = useAudio();

  if (!audioContext) {
    throw new Error("useAudio must be used within an AudioProvider");
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value) / 100;
    audioContext.setVolume(newVolume);
  };

  return (
    <div className="row" style={{ width: "400px" }}>
      <div className="col-12">
        <input
          type="range"
          className="custom-range"
          id="volumeControl"
          min="0"
          max="100"
          defaultValue="50"
          onChange={handleVolumeChange}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
