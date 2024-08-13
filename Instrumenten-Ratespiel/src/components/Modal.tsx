import React, { useEffect, useState } from "react";

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
  // make a function that calls localhost:3000 every 10 seconds as a health check of the server
  // if the server is live, then a useState isServerOk is set to true, if not, false
  const [isServerOk, setIsServerOk] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // fetch should run on page load and then every 10 seconds
  useEffect(() => {
    fetch("http://localhost:3000")
      .then(() => setIsServerOk(true))
      .catch(() => setIsServerOk(false));
    const interval = setInterval(() => {
      fetch("http://localhost:3000")
        .then(() => setIsServerOk(true))
        .catch(() => setIsServerOk(false));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
        <h2>Server ist {isServerOk ? "online 🟢" : "offline 🔴"}</h2>
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
