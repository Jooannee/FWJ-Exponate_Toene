import React, { useState, useEffect } from "react";
import AudioButton from "./AudioButton";
import VolumeControl from "./VolumeControl";
import { useAudio } from "./AudioContext";

interface AudioPageProps {
  pageIndex: number;
  nextPage: () => void;
  prevPage: () => void;
  handleBackHome: () => void;
  handleSelection: (audioIndex: number, selection: string) => void;
  audioTest: { audioFile: string; disorder: number };
  selection: string;
  shouldInitialStateBePlaying: boolean;
}

const AudioPage: React.FC<AudioPageProps> = ({
  pageIndex,
  nextPage,
  prevPage,
  handleBackHome,
  handleSelection,
  selection,
  audioTest,
  shouldInitialStateBePlaying,
}) => {
  const [localSelection, setLocalSelection] = useState(selection);
  const { stopAudio } = useAudio();
  const { audioFile } = audioTest;

  const handleBackHomeInternal = () => {
    stopAudio();
    handleBackHome();
  };

  const handleNext = () => {
    stopAudio(); // Stop playing audio
    nextPage(); // Move to next page
  };

  const handlePrev = () => {
    stopAudio(); // Stop playing audio
    prevPage(); // Move to previous page
  };

  useEffect(() => {
    // Update local state when the passed selection changes
    setLocalSelection(selection);
  }, [selection]);

  const auditiveDisorders = [
    "Ausgeprägte Schwerhörigkeit bei hohen Frequenzen",
    "Mittelgradige Schwerhörigkeit bei mittleren Frequenzen",
    "Leichte Schwerhörigkeit bei tiefen Frequenzen",
    "Schallleitungstörung",
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setLocalSelection(selectedValue);
    handleSelection(pageIndex, selectedValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <h3 style={{ margin: "20px 0" }}>Audio {pageIndex + 1}</h3>
      <div style={{ display: "flex", alignItems: "center" }}>
        <VolumeControl />
        <AudioButton
          audioFile={audioFile}
          shouldInitialStateBePlaying={shouldInitialStateBePlaying}
        />
      </div>
      <h3 style={{ marginTop: "20px" }}>
        Welche Hörbeeinträchtigung ist dies?
      </h3>
      <select
        size={4}
        className="form-control"
        id={`audioSelection${pageIndex}`}
        value={localSelection}
        onChange={handleChange}
        style={{
          width: "100%",
          margin: "20px 0",
          border: "1px solid black",
          overflow: "auto",
        }}
      >
        {auditiveDisorders.map((disorder, index) => (
          <option
            style={{
              height: "30px",
              verticalAlign: "middle",
              paddingTop: "3px",
            }}
            key={index}
            value={index.toString()}
          >
            {disorder}
          </option>
        ))}
      </select>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          style={{
            width: "30%",
            visibility: pageIndex === 0 ? "hidden" : undefined,
          }}
        >
          Zurück ⬅
        </button>
        <button
          className="btn btn-primary"
          onClick={handleBackHomeInternal}
          style={{ width: "30%" }}
        >
          Startbildschirm
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          style={{ width: "30%" }}
        >
          {pageIndex === 3 ? "Fertig ☑" : "Weiter ➡"}
        </button>
      </div>
    </div>
  );
};

export default AudioPage;
