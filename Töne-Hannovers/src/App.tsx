import { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";
import Modal from "./Modal";
// @ts-ignore
import SpectrogramPlayer from "react-audio-spectrogram-player";

async function fetchSpectogram(number: number): Promise<number[][]> {
  const response = await fetch(`./spectograms/${number}.json`);
  return response.json();
}

const map = [
  "Leinewelle",
  "Klingel (Einzelner Ton)",
  "Klingel (Mehrere Töne)",
  "Kanalisation",
  "Christuskirche",
  "Trompete",
  "Tenorhorn",
  "Altsaxophon",
  "Clarinette",
  "Horn naturtöne",
  "Spielmannsflöte",
  "Querflöte",
  "Bariton-Saxophon",
  "Kornett",
];

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal1, setShowInfoModal1] = useState(false);
  const [showInfoModal2, setShowInfoModal2] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(1);
  const [spectrogram, setSpectrogram] = useState<number[][]>([[1], [2]]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const p5CanvasRef = useRef<HTMLCanvasElement>(null);
  const [isVertical, setIsVertical] = useState(true);

  const videoNumbers = map.map((_, i) => i + 1);

  const sendStartEvent = () => {
    const body = {
      gameName: "töne-hannovers",
      event: "videoPlay",
    };

    fetch("http://localhost:3000/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const drawCanvasWrapper = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    xAxis: string,
    yAxis: string
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    //clear canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    console.log(canvas.width, canvas.height);
    console.log(canvas.clientWidth, canvas.clientHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw canvas
    const width = canvas.clientWidth;
    const height = 230;

    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());

    // Draw X axis
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(width - 5, height - 20);
    ctx.lineTo(width - 15, height - 25); // Arrow part 1
    ctx.moveTo(width - 5, height - 20);
    ctx.lineTo(width - 15, height - 15); // Arrow part 2
    ctx.stroke();

    // Draw Y axis
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(20, 0);
    ctx.lineTo(15, 5); // Arrow part 1
    ctx.moveTo(20, 0);
    ctx.lineTo(25, 5); // Arrow part 2
    ctx.stroke();

    // Draw X axis label
    ctx.font = "16px Arial";
    ctx.fillText(xAxis, width / 2, height - 5);

    // Draw Y axis label (rotated)
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(yAxis, 0, -5);
    ctx.restore();
  };

  const [message, setMessage] = useState(''); // To store messages from the server
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket connection
  
  // Setup WebSocket connection on component mount
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server
  
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket); // Save the socket connection for later use
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Message from server:', data.message);
      setMessage(data.message); // Store the message from the server
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    return () => {
      socket.close(); // Clean up connection on component unmount
    };
  }, []);
  
  // Function to handle button click and send redirection message to Electron
  const handleRedirect = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'redirect', url: 'index.html' }));
    }
  };

  useEffect(() => {
    drawCanvasWrapper(canvasRef, "Zeit [s]", "Frequenz [Hz]");
    drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude");
    setTimeout(() => {
      drawCanvasWrapper(canvasRef, "Zeit [s]", "Frequenz [Hz]");
      drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude");
    }, 500);
  }, [canvasRef.current]);

  useEffect(() => {
    fetchSpectogram(selectedVideo).then(setSpectrogram);
    drawCanvasWrapper(canvasRef, "Zeit [s]", "Frequenz [Hz]");
    drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude");
  }, [selectedVideo]);

  const canvas = canvasRef.current;
  if (canvas) {
    window.addEventListener("resize", () =>
      drawCanvasWrapper(canvasRef, "Zeit [s]", "Frequenz [Hz]")
    );
  }
  const p5Canvas = p5CanvasRef.current;
  if (p5Canvas) {
    window.addEventListener("resize", () =>
      drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude")
    );
  }

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!audioRef.current) return;
    const audioElement = audioRef.current.querySelector("audio");

    if (videoElement && audioElement) {
      // Event listeners for synchronizing playback
      const onPlay = () => {
        videoElement.play();
      };

      const onPause = () => {
        videoElement.pause();
      };

      const onSeeked = () => {
        videoElement.currentTime = audioElement.currentTime;
      };

      audioElement.addEventListener("play", onPlay);
      audioElement.addEventListener("pause", onPause);
      audioElement.addEventListener("seeked", onSeeked);

      // Clean up event listeners on component unmount
      return () => {
        audioElement.removeEventListener("play", onPlay);
        audioElement.removeEventListener("pause", onPause);
        audioElement.removeEventListener("seeked", onSeeked);
      };
    }
  }, [selectedVideo]);

  return (
    <>
      {isVertical && (
        <div
          className="text-center"
          style={{
            position: "fixed",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50px",
            width: "100%",
          }}
        >
          <h1>Töne Hannovers</h1>
        </div>
      )}
      <div className="container">
        <div className={`d-flex ${isVertical ? "flex-column" : "flex-row"}`}>
          <div
            className={`${
              isVertical ? "text-center vertical-buttons" : "col-6"
            }`}
            style={{ marginRight: !isVertical ? "40px" : "0px" }}
          >
            {!isVertical && (
              <div className="text-center">
                <h1>Töne Hannovers</h1>
              </div>
            )}
            <div
              className={`my-2 ${
                isVertical ? "btn-group-vertical" : "btn-group"
              }`}
              style={{ flexWrap: !isVertical ? "wrap" : "initial" }}
            >
              {isVertical && (
                <div className="text-center" style={{ width: "126px" }}>
                  <p>Auswahl:</p>
                </div>
              )}
              {videoNumbers.map((number) => (
                <button
                  key={number}
                  className={`btn btn-primary ${
                    selectedVideo === number ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedVideo === number ? "#7eb6ff" : "#bde2fe",
                    color: "black",
                  }}
                  onClick={() => {
                    setSelectedVideo(number);
                    sendStartEvent();
                  }}
                >
                  {map[number - 1]}
                </button>
              ))}
            </div>
            <video
              className="border border-dark shadow"
              ref={videoRef}
              muted={true}
              key={selectedVideo}
              controls={false}
              style={{ width: "100%", borderRadius: "10px" }}
            >
              <source src={`./media/${selectedVideo}.mp4`} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className={`${isVertical ? "mt-2" : "col-6"}`}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex" }}>
                <h4 className="text-center">Oszillogramm + Fourier-Spektrum</h4>{" "}
                <span
                  onClick={() => setShowInfoModal1(true)}
                  style={{
                    marginTop: "5px",
                    marginLeft: "10px",
                    fontWeight: "500",
                  }}
                >
                  <u> Was ist das?</u>
                </span>
              </div>
            </div>

            <div
              id="spectowrapperdiv"
              style={{ position: "relative", height: "230px" }}
            >
              <canvas
                style={{
                  border: "none",
                  width: "104%",
                  left: "-4%",
                  height: "230px",
                  position: "absolute",
                  pointerEvents: "none",
                }}
                key={selectedVideo}
                height={230}
                ref={p5CanvasRef}
              ></canvas>
              <div style={{ width: "100%", float: "right" }}>
                <div ref={sketchRef} id="sketch"></div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex" }}>
                <h4 className="text-center">Spektrogramm</h4>
                <span
                  onClick={() => setShowInfoModal2(true)}
                  style={{
                    marginTop: "5px",
                    marginLeft: "10px",
                    fontWeight: "500",
                  }}
                >
                  <u> Was ist das?</u>
                </span>
              </div>
            </div>

            <div id="spectowrapperdiv" style={{ position: "relative" }}>
              <canvas
                style={{
                  border: "none",
                  width: "104%",
                  left: "-4%",
                  height: "230px",
                  position: "absolute",
                  pointerEvents: "none",
                }}
                key={selectedVideo}
                height={230}
                ref={canvasRef}
              ></canvas>
              <div style={{ width: "100%", float: "right" }}>
                <div
                  id="spectogramdiv"
                  style={{ marginLeft: isVertical ? "0" : "3px" }}
                  ref={audioRef}
                >
                  <SpectrogramPlayer
                    src={`./media/${selectedVideo}.wav`}
                    sxx={spectrogram}
                    key={selectedVideo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: "5px solid gray",
          boxSizing: "border-box",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />
      <div>
      <button
          style={{
            position: "fixed",
            right: 10,
            top: 10,
            zIndex: 1000, // Ensure it's above other content
          }}
          className="btn btn-dark"
          onClick={handleRedirect}
        >
          🏠
        </button>
        <button
          style={{
            position: "fixed",
            right: 10,
            top: 60,
            zIndex: 1000, // Ensure it's above other content
          }}
          className="btn btn-dark"
          onClick={() => setShowModal(true)}
        >
          ⚙
        </button>
        <button
          style={{
            position: "fixed",
            right: 10,
            top: 110,
            zIndex: 1000, // Ensure it's above other content
          }}
          className="btn btn-dark"
          onClick={() => setShowCreditsModal(true)}
        >
          📃
        </button>
        <Modal show={showModal}>
          <button
            className="btn btn-primary"
            onClick={() => setIsVertical(!isVertical)}
          >
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
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowModal(false)}
          >
            Schließen
          </button>
        </Modal>
        <Modal show={showInfoModal1}>
          <p>
            Die obere weiße Linie ist ein ein Oszillogramm. Man sieht eine sich
            im laufe der Zeit verändernde Welle. Die Höhe der Amplituden zeigt
            die Lautstärke und der Abstand der Wellenberge zeigt die Frequanz
            des Tons. <br></br>
            Das bunte Bild ist das Fourier-Spektrum. Es zeigt die verschiedenen
            Frequenzbestandteile, die in dem Ton enthalten sind. In der Natur
            bestehen Töne meist aus vielen verschiedenen Tönen, die sich
            überlagern, um den resultierenden Ton zu erzeugen.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowInfoModal1(false)}
          >
            Schließen
          </button>
        </Modal>
        <Modal show={showInfoModal2}>
          <p>
            Ein Spektrogramm zeigt, wie hoch die Intensität und somit die
            Lautstärke eines Tons bei bestimmten Frequenzen ist. Je heller die
            Farbe, desto lauter ist der Ton bei dieser Frequenz.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowInfoModal2(false)}
          >
            Schließen
          </button>
        </Modal>
        <Modal show={showCreditsModal}>
          <p>
            Quellen: <br></br>
            Eigene Aufnahmen.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowCreditsModal(false)}
          >
            Schließen
          </button>
        </Modal>
      </div>
    </>
  );
}

export default App;
