import React, { useState } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  isVertical: boolean;
  setIsVertical: (isVertical: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  isVertical,
  setIsVertical,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: 20,
          background: "white",
          borderRadius: "5px",
        }}
      >
        <button onClick={() => setIsVertical(!isVertical)}>
          Ausrichtung einstellen {isVertical ? "↕" : "↔"}
        </button>
        <br></br>
        <button
          className="btn btn-primary"
          style={{ marginTop: "10px" }}
          onClick={() => {
            const elem = document.documentElement;
            if (document.fullscreenElement) {
              setIsFullscreen(false);
              document.exitFullscreen();
            } else {
              setIsFullscreen(true);
              elem.requestFullscreen();
            }
          }}
        >
          Vollbild {isFullscreen ? "aus" : "an"}
        </button>
        <br></br>
        <button style={{ marginTop: "10px" }} onClick={onClose}>
          Schließen
        </button>
      </div>
    </div>
  );
};

export default Modal;
