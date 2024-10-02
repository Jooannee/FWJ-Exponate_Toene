import { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";
import Modal from "./Modal";
import ChildrenModal from "./ChildrenModal";

type Combination = {
  audio: string;
  video: string;
};

function App() {
  const combinations: Combination[] = [
    { audio: "Ga", video: "Ga" },
    { audio: "Ga", video: "Fa" },
    { audio: "Ga", video: "Ba" },
    { audio: "Fa", video: "Ga" },
    { audio: "Fa", video: "Fa" },
    { audio: "Fa", video: "Ba" },
    { audio: "Ba", video: "Ga" },
    { audio: "Ba", video: "Fa" },
    { audio: "Ba", video: "Ba" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [stage, setStage] = useState(0); // 0 = intro, 1 = testing, 2 = results
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCombinations, setShuffledCombinations] = useState<
    Combination[]
  >([]);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);
  const [isVertical, setIsVertical] = useState(false);
  const [noCacheNumber, setNoCacheNumber] = useState(
    Math.floor(Math.random() * 1000000)
  );

  const bringBackToBeginning = () => {
    setCurrentIndex(0);
    setUserChoices([]);
    setScore(0);
    setStage(0);
  };

  const startExperiment = () => {
    const shuffled = [...combinations].sort(() => 0.5 - Math.random());
    setShuffledCombinations(shuffled);
    setCurrentIndex(0);
    setUserChoices([]);
    setScore(0);
    setStage(1);
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
    if (stage === 2) {
      const resultsAndAnswers: Record<string, string> = {};
      shuffledCombinations.forEach((combination, index) => {
        resultsAndAnswers[
          "Video: " + combination.video + " and Audio: " + combination.audio
        ] = userChoices[index];
      });
      console.log(userChoices);
      console.log(resultsAndAnswers);
      //post resultsAndAnswers to the server, localhost:3000 with POST at /mcgurk
      fetch("http://localhost:3000/mcgurk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultsAndAnswers),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [stage]);

  useEffect(() => {
    setNoCacheNumber(Math.floor(Math.random() * 1000000));
    if (videoPlayerRef.current) {
      videoPlayerRef.current.onended = () => {
        setIsVideoPaused(true);
      };
    }
  }, [shuffledCombinations[currentIndex], videoPlayerRef.current]);

  const handleUserChoice = (choice: string) => {
    setCurrentChoice(choice);
  };

  const confirmChoice = () => {
    if (currentChoice) {
      const correct =
        shuffledCombinations[currentIndex].audio === currentChoice;
      if (correct) {
        setScore(score + 1);
      }
      setUserChoices([...userChoices, currentChoice]);

      if (currentIndex + 1 < shuffledCombinations.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setStage(2);
      }
      setCurrentChoice(null);
      setIsVideoPaused(false);
    }
  };

  const renderIntro = () => (
    <div className="text-center" style={{ maxWidth: "600px" }}>
      <img src="ear.png" style={{ width: "200px" }} className="mb-4" />
      <h1>McGurk Effekt</h1>
      <p>
        Lass dich nicht täuschen! Sieh dir gleich während du
        hinhörst genau die Lippenbewegungen an. Was hörst du? Wähle die Silbe aus, die du hörst.
      </p>
      <button className="btn btn-primary" onClick={startExperiment}>
        Start
      </button>
    </div>
  );

  const renderTest = () => (
    <div className="text-center">
      <div className="row">
        <div className={isVertical ? "col-12" : "col-6"}>
          <h1>McGurk Effekt</h1>
          <h2>Test {currentIndex + 1}/9</h2>
          <div className="rounded-lg overflow-hidden">
            <div>
              <video
                className="border border-dark shadow"
                ref={videoPlayerRef}
                key={
                  shuffledCombinations[currentIndex].audio +
                  shuffledCombinations[currentIndex].video
                }
                autoPlay
                controls={false}
                style={{ width: "50%", borderRadius: "10px" }}
              >
                <source
                  src={`./media/${shuffledCombinations[currentIndex].audio}${shuffledCombinations[currentIndex].video}.mp4?noCache=${noCacheNumber}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            <div>
              <div className="form-group mx-sm-3 mb-2">
                <button
                  className="btn btn-secondary"
                  style={{ marginRight: "5px" }}
                  onClick={() => {
                    if (videoPlayerRef.current) {
                      if (videoPlayerRef.current.paused) {
                        videoPlayerRef.current.play();
                        setIsVideoPaused(false);
                      } else {
                        videoPlayerRef.current.pause();
                        setIsVideoPaused(true);
                      }
                    }
                  }}
                >
                  {isVideoPaused ? "▶" : "⏸"}
                </button>
                <input
                  style={{ width: "200px" }}
                  type="range"
                  className="custom-range"
                  id="volumeControl"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={(e) => {
                    if (videoPlayerRef.current) {
                      videoPlayerRef.current.volume = e.target.valueAsNumber;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={isVertical ? "col-12" : "col-6"}
          style={{ alignContent: isVertical ? "initial" : "center" }}
        >
          <div className="choices" style={{ marginTop: "30px" }}>
            <div>
              <h4>Was sagt er?</h4>
            </div>
            <div style={{ marginTop: "10px" }}>
              {["Ba", "Da", "Ga", "Pa", "Ka", "Fa", "Ta"].map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleUserChoice(choice)}
                  style={{
                    backgroundColor:
                      currentChoice === choice ? "lightblue" : "#0d6efd",
                    marginRight: "5px",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: "10px",
                visibility: currentChoice ? "initial" : "hidden",
              }}
            >
              <button
                onClick={confirmChoice}
                style={{ backgroundColor: "green", color: "white" }}
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderResults = () => (
    <div className="text-center">
      <h1>McGurk Effekt</h1>
      <p>
        Du hast gerade den McGurk-Effekt gesehen. Der McGurk Effekt ist eine audio-visuelle
        Täuschung. Durch Lesen der Lippenbewegung denkt das Gehirn, die
        Person sagt etwas anderes, als sie wirklich tut. Konntest du alle Silben richtig hören?
      </p>
      <h2>Ergebisse</h2>
      <p>
        Du hast {score} von {shuffledCombinations.length} richtig erkannt.
      </p>
      {shuffledCombinations.map((combination, index) => (
        <div key={index}>
          <p>
            🔊 {combination.audio} | 📺 {combination.video} - Antwort:{" "}
            {userChoices[index]} -
            {combination.audio === userChoices[index] ? "✅" : "❌"}
          </p>
        </div>
      ))}
      <button className="btn btn-primary" onClick={bringBackToBeginning}>
        Wiederholen
      </button>
    </div>
  );

  return (
    <>
      <div className="container">
        {stage === 0 && renderIntro()}
        {stage === 1 && renderTest()}
        {stage === 2 && renderResults()}
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
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          isVertical={isVertical}
          setIsVertical={setIsVertical}
        />
      </div>
    </>
  );
}

export default App;
