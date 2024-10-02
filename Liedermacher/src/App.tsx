import { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";
import Modal from "./Modal";
import ChildrenModal from "./ChildrenModal";

type Song = {
  name: string;
  notes: Note[];
};

// extend global namespace with custom function async function globalPlayOscillator(type, amp, freq, duration = 0.5)
declare global {
  interface Window {
    globalPlayOscillator: (
      type: OscillatorType,
      amp: number,
      freq: number,
      duration: number
    ) => Promise<void>;
  }
}

const dictionary: Record<string, string> = {
  sine: "Sinus",
  sawtooth: "Sägezahn",
  square: "Rechteck",
  triangle: "Dreieck",
};

const predoneSongs: Song[] = [
  {
    name: "Europahymne",
    notes: [
      {
        waveform: "sine",
        frequency: 415.3046975799451,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 415.3046975799451,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 440,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 493.8833012561241,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 493.8833012561241,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 440,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 415.3046975799451,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 369.99442271163446,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 329.6275569128699,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 329.6275569128699,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 369.99442271163446,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 415.3046975799451,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 415.3046975799451,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 369.99442271163446,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 369.99442271163446,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
    ],
  },
  {
    name: "Frère Jacques (Sinuswelle)",
    notes: [
      {
        waveform: "sine",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 739.9888454232689,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 739.9888454232689,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 880,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 880,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sine",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
    ],
  },
  {
    name: "Frère Jacques (Sägezahnschwingung)",
    notes: [
      {
        waveform: "sawtooth",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 739.9888454232689,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 739.9888454232689,
        amplitude: 0.5,
        bgColor: "hsl(30, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 659.2551138257398,
        amplitude: 0.5,
        bgColor: "hsl(0, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 880,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 830.6093951598903,
        amplitude: 0.5,
        bgColor: "hsl(60, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 880,
        amplitude: 0.5,
        bgColor: "hsl(120, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
      {
        waveform: "sawtooth",
        frequency: 987.7666025122483,
        amplitude: 0.5,
        bgColor: "hsl(90, 100%, 75%)",
      },
    ],
  },
];

type Note = {
  frequency: number;
  amplitude: number;
  waveform: OscillatorType;
  bgColor: string;
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isVertical, setIsVertical] = useState(true);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isInEditorMode, setIsInEditorMode] = useState(false);
  const [waveform, setWaveform] = useState<OscillatorType>("sine");
  const [amplitude, setAmplitude] = useState<number>(0.5);
  const [noteIndex, setNoteIndex] = useState<number>(48); // Starting with A4 (index 48)
  const [notebank, setNotebank] = useState<Note[]>([]);
  const [timeline, setTimeline] = useState<Note[]>([]);
  const p5CanvasRef = useRef<HTMLCanvasElement>(null);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw canvas
    const width = canvas.clientWidth < 400 ? 610 : canvas.clientWidth;
    const height = 280;

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

  const p5Canvas = p5CanvasRef.current;
  if (p5Canvas) {
    window.addEventListener("resize", () =>
      drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude")
    );
  }

  useEffect(() => {
    drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude");
    setTimeout(() => {
      drawCanvasWrapper(p5CanvasRef, "Frequenz [Hz]", "Amplitude");
    }, 250);
  }, [p5CanvasRef.current]);

  const audioRef = useRef<HTMLAudioElement>(null);

  const noteNames = [
    "A",
    "A♯",
    "B",
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
  ];

  const calculateFrequency = (noteIndex: number) => {
    const A4 = 440;
    return A4 * Math.pow(2, (noteIndex - 48) / 12); // A4 is at index 48
  };

  const closestNote = (noteIndex: number) => {
    const noteName = noteNames[noteIndex % 12];
    const octave = Math.floor((noteIndex + 9) / 12);
    return `${noteName}${octave}`;
  };

  const closestNoteIndex = (frequency: number) => {
    const A4 = 440;
    const noteIndex = 12 * (Math.log(frequency / A4) / Math.log(2)) + 48;
    return Math.round(noteIndex);
  };

  const frequency = calculateFrequency(noteIndex);

  const saveSound = () => {
    if (notebank.length >= 6) return;
    const bgColor = `hsl(${notebank.length * 30}, 100%, 75%)`;
    const newNote = { waveform, frequency, amplitude, bgColor };
    const doesNoteExist = notebank.some(
      (note) =>
        note.waveform === waveform &&
        note.frequency === frequency &&
        note.amplitude === amplitude
    );
    if (doesNoteExist) return;
    setNotebank([...notebank, newNote]);
  };

  const playTimeline = async () => {
    for (let i = 0; i < timeline.length; i++) {
      const note = timeline[i];
      console.log(note);
      await window.globalPlayOscillator(
        note.waveform,
        note.amplitude,
        note.frequency,
        0.5
      );
    }
  };

  const clearTimeline = () => {
    setTimeline([]);
  };

  const sendStartEvent = () => {
    const body = {
      gameName: "liedermacher",
      event: "tonAbspielen",
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

  const playSound = () => {
    sendStartEvent();
    window.globalPlayOscillator(waveform, amplitude, frequency, 1.5);
  };

  const addNoteToTimeline = (note: Note) => {
    if (timeline.length >= 30) return;
    setTimeline([...timeline, note]);
  };

  const removeNoteFromTimeline = (index: number) => {
    const newTimeline = [...timeline];
    newTimeline.splice(index, 1);
    setTimeline(newTimeline);
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

  return (
    <>
      <div className={`container ${isVertical ? "" : "horizontal-layout"}`}>
        <div className={`${isVertical ? "text-center" : "left-column"}`}>
          <div
            className="mb-2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ display: "flex" }}>
              <h2 className="mt-3" style={{ marginRight: "10px" }}>
                Liedermacher
              </h2>
              <img src="music.png" alt="" style={{ width: "70px" }} />
            </div>
          </div>

          <div
            style={{
              marginBottom: "20px",
              backgroundColor: "#f2f2f2",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            {isInEditorMode
              ? `Töne bestehen aus Wellen. Hier kannst du die Amplitude und Frequenz der Wellen ändern und sehen, welche Töne daraus entstehen. 
              Du kannst dabei aus verschiedenen Wellenformen wählen. Die Sinuswelle ist die einfachste Form; durch die Überlagerung mehrerer Sinuswellen entstehen besondere Wellen wie die Sägezahnschwingung. Probiere verschiedene Wellen, Amplituden und Frequenzen aus! Wenn dir ein Ton gefällt, klicke auf "Ton speichern". 
              Du kannst danach auf die gespeicherten Töne klicken, um in der Timeline ein Lied zu komponieren.`
              : `Erstelle deine eigenen Lieder! Auf dieser Seite kannst du ausprobieren, verschiedene Töne zu erzeugen. Dafür musst du nur die Amplitude und Frequenz der Welle verändern und die Wellenform auswählen. Wie die Welle aussieht, kannst du im Oszillogramm sehen. 
              Probiere verschiedene Formen und Kombinationen aus. Möchtest du mit den Tönen eigene Lieder erstellen? Gehe zur nächsten Seite! `}
          </div>
          <div
            style={{
              marginBottom: "20px",
              backgroundColor: "#f2f2f2",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            <h2>Wellenform auswählen</h2>
            <button
              style={{
                backgroundColor: waveform === "sine" ? "lightblue" : "#0d6efd",
              }}
              className="m-2 p-2 btn-primary"
              onClick={() => setWaveform("sine")}
            >
              Sinuswelle
            </button>
            <button
              style={{
                backgroundColor:
                  waveform === "sawtooth" ? "lightblue" : "#0d6efd",
              }}
              className="m-2 p-2 btn-primary"
              onClick={() => setWaveform("sawtooth")}
            >
              Sägezahnschwingung
            </button>
            <button
              style={{
                backgroundColor:
                  waveform === "square" ? "lightblue" : "#0d6efd",
              }}
              className="m-2 p-2 btn-primary"
              onClick={() => setWaveform("square")}
            >
              Rechteckschwingung
            </button>
            <button
              style={{
                backgroundColor:
                  waveform === "triangle" ? "lightblue" : "#0d6efd",
              }}
              className="m-2 p-2 btn-primary"
              onClick={() => setWaveform("triangle")}
            >
              Dreieckschwingung
            </button>

            <div className="row" style={{ marginBottom: "20px" }}>
              <div className="col-6">
                <h4>Amplitude festlegen</h4>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={amplitude}
                  onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                />
                <span> {amplitude}</span>
              </div>
              <div className="col-6">
                <h4>Frequenz festlegen</h4>
                <input
                  type="range"
                  min="0"
                  max="87"
                  step="1"
                  style={{ width: "200px" }}
                  value={noteIndex}
                  onChange={(e) => setNoteIndex(parseInt(e.target.value))}
                />
                <span>
                  {frequency.toFixed(0)} Hz ({closestNote(noteIndex)})
                </span>
              </div>
            </div>

            <button
              onClick={playSound}
              className="btn btn-success"
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              Ton Abspielen
            </button>
            {isInEditorMode && (
              <button
                onClick={saveSound}
                className="ms-2 btn btn-success"
                style={{ padding: "10px 20px", fontSize: "16px" }}
              >
                Ton Speichern
              </button>
            )}
          </div>

          <audio id="player" ref={audioRef} />

          {isInEditorMode && (
            <div
              id="notebank"
              className="mt-2 mb-2"
              style={{
                border: "1px solid black",
                padding: "10px",
                borderRadius: "15px",
              }}
            >
              {/* next to each other */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4>Gespeicherte Noten</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => setNotebank([])}
                >
                  Töne löschen
                </button>
              </div>

              <div className="note-container">
                {notebank.map((note, index) => (
                  <button
                    key={index}
                    className="note-button"
                    style={{
                      backgroundColor: note.bgColor,
                      color: "black",
                      padding: "0.2em",
                    }}
                    onClick={() => addNoteToTimeline(note)}
                  >
                    <span style={{ fontSize: "14px" }}>
                      {dictionary[note.waveform].slice(0, 1).toUpperCase() +
                        dictionary[note.waveform].slice(
                          1,
                          dictionary[note.waveform].length
                        )}
                      , {note.frequency.toFixed(0)} Hz (
                      {closestNote(closestNoteIndex(note.frequency))}),{" "}
                      {note.amplitude}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={!isVertical ? "right-column" : "text-center"}>
          {!isInEditorMode && (
            <div className={!isVertical ? "" : "mt-2"}>
              <h4>Fertige Lieder (Beispiele)</h4>
              {predoneSongs.map((song, index) => (
                <button
                  key={index}
                  className="btn btn-primary m-2"
                  onClick={() => setTimeline(song.notes)}
                >
                  {song.name}
                </button>
              ))}
            </div>
          )}

          <div
            id="timeline"
            style={{
              backgroundColor: "#f2f2f2",
              padding: "10px",
              borderRadius: "15px",
            }}
          >
            <h4>Timeline</h4>
            <div className="timeline-container" style={{ textAlign: "left" }}>
              {timeline.map((note, index) => (
                <button
                  key={index}
                  className="timeline-note-button"
                  style={{
                    backgroundColor: note.bgColor,
                    color: "black",
                    margin: "0.1em",
                    padding: "5px",
                  }}
                  onClick={() => removeNoteFromTimeline(index)}
                >
                  <span>{closestNote(closestNoteIndex(note.frequency))}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 mb-2">
              {timeline.length > 0 && (
                <button
                  onClick={playTimeline}
                  style={{ padding: "10px 20px", fontSize: "16px" }}
                >
                  Timeline abspielen
                </button>
              )}
              {timeline.length > 0 && (
                <button
                  onClick={clearTimeline}
                  style={{
                    padding: "10px 20px",
                    marginLeft: "10px",
                    fontSize: "16px",
                  }}
                >
                  Timeline löschen
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4>Oszillogramm + Fourier-Spektrum</h4>
              <span
                onClick={() => setShowInfoModal(true)}
                style={{
                  marginTop: "5px",
                  marginLeft: "10px",
                  marginBottom: "5px",
                  fontWeight: "500",
                }}
              >
                <u> Was ist das?</u>
              </span>
            </div>
            <div
              id="spectowrapperdiv"
              style={{ position: "relative", height: "280px" }}
            >
              <canvas
                style={{
                  border: "none",
                  width: "104%",
                  left: "-4%",
                  height: "280px",
                  position: "absolute",
                  pointerEvents: "none",
                }}
                height={230}
                ref={p5CanvasRef}
              ></canvas>
              <div style={{ width: "100%", float: "right" }}>
                <div id="sketch"></div>
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
          📄
        </button>
        <button
          style={{
            position: "fixed",
            padding: "20px",
            left: 10,
            top: 10,
            zIndex: 1000, // Ensure it's above other content
          }}
          className="btn btn-primary"
          onClick={() => setIsInEditorMode(!isInEditorMode)}
        >
          {isInEditorMode ? "Hören-Modus 🔊" : "Lieder erstellen Modus ✏"}
        </button>
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          isVertical={isVertical}
          setIsVertical={setIsVertical}
        />
        <ChildrenModal show={showCreditsModal}>
          <p>
            Quellen: <br></br>
            Icon: Flaticon.com
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowCreditsModal(false)}
          >
            Schließen
          </button>
        </ChildrenModal>
        <ChildrenModal show={showInfoModal}>
          <p>
            Ein Oszillogramm ist wie ein Wellenbild, das zeigt, wie laut und
            leise ein Ton ist und wie er sich im Laufe der Zeit verändert. Ein
            Fourier-Spektrum zeigt die Bestandteile aus verschiedenen
            Frequenzen, aus welchen sich der Gesamtton zusammensetzt.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowInfoModal(false)}
          >
            Schließen
          </button>
        </ChildrenModal>
      </div>
    </>
  );
}

export default App;
