import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
import { useAudio } from "./components/AudioContext";
import ModalInfo from "./components/ModalInfo";
import AudioPage from "./components/AudioPage";
import ResultsComponent from "./components/ResultsComponent";
import Modal from "./components/Modal";
import ChildrenModal from "./components/ChildrenModal";
import AudioButton from "./components/AudioButton";
import VolumeControl from "./components/VolumeControl";

type AudioTest = {
  audioFile: string;
  disorder: number;
};

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const [selections, setSelections] = useState(Array(4).fill("0"));
  const [
    selectionsThatHaveAutoplayedAlready,
    setSelectionsThatHaveAutoplayedAlready,
  ] = useState(Array(4).fill(false));
  const [audioTests, setAudioTests] = useState<AudioTest[]>([
    { audioFile: "Audio_1", disorder: 1 },
    { audioFile: "Audio_2", disorder: 2 },
    { audioFile: "Audio_3", disorder: 0 },
    { audioFile: "Audio_4", disorder: 3 },
  ]);
  const [savedPage, setSavedPage] = useState(-1);
  const { stopAudio } = useAudio();

  const auditiveDisorders: string[] = [
    "Ausgeprägte Schwerhörigkeit bei hohen Frequenzen",
    "Mittelgradige Schwerhörigkeit bei mittleren Frequenzen",
    "Leichte Schwerhörigkeit bei tiefen Frequenzen",
    "Schallleitungstörung",
  ];

  const handleSelection = (pageIndex: number, selection: string) => {
    const newSelections = [...selections];
    newSelections[pageIndex] = selection;
    setSelections(newSelections);
  };

  const restartGame = () => {
    setSavedPage(-1);
    setCurrentPage(-1);
    setSelections(Array(4).fill("0"));
    shuffleThings();
    setSelectionsThatHaveAutoplayedAlready(Array(4).fill(false));
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
    if (!selectionsThatHaveAutoplayedAlready[currentPage] && currentPage >= 0) {
      const newSelectionsThatHaveAutoplayedAlready = [
        ...selectionsThatHaveAutoplayedAlready,
      ];
      newSelectionsThatHaveAutoplayedAlready[currentPage] = true;
      setSelectionsThatHaveAutoplayedAlready(
        newSelectionsThatHaveAutoplayedAlready
      );
      console.log(newSelectionsThatHaveAutoplayedAlready);
    }
    if (currentPage === 4) {
      const resultsAndAnswers: Record<string, string> = {};

      audioTests.forEach((audioTest, index) => {
        resultsAndAnswers[`Audio: ${auditiveDisorders[audioTest.disorder]}`] =
          auditiveDisorders[parseInt(selections[index])];
      });

      fetch("http://localhost:3000/disorders", {
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
  }, [currentPage]);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);
  const handleBackHome = () => {
    setSavedPage(currentPage);
    setCurrentPage(-1);
  };

  useEffect(() => {
    shuffleThings();
  }, []);

  const shuffleThings = () => {
    // shuffle array order
    const shuffle = (array: any[]) => {
      const shuffledArray = array.sort(() => Math.random() - 0.5);
      return shuffledArray;
    };

    // Shuffle the auditive disorders and set state
    setAudioTests(shuffle(audioTests));
  };

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          className="mb-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div style={{ display: "flex" }}>
            <h1 className="mt-3" style={{ marginRight: "10px" }}>
              Hörbeeinträchtigungen
            </h1>
            <img src="hearing-loss.png" alt="" style={{ width: "70px" }} />
          </div>
        </div>
      </div>
      {currentPage === -1 && (
        <>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              className="card"
              style={{ borderRadius: "30px", backgroundColor: "#c7f2c6" }}
            >
              <p className="mt-3">
              Lerne vier Menschen mit verschiedenen Hörbeeinträchtigungen kennen und versuche dann herauszufinden, zu welcher Person das veränderte Hören gehört!
              </p>
            </div>
          </div>

          <ModalInfo />
          <div className="text-center">
            <h4>Original</h4>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <AudioButton
              audioFile={"original"}
              shouldInitialStateBePlaying={false}
            />
            <VolumeControl />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {savedPage !== -1 ? (
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "20px",
                  marginLeft: "20px",
                }}
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => {
                  stopAudio();
                  setCurrentPage(savedPage);
                }}
              >
                Weiter
              </button>
            ) : (
              <button
                style={{ padding: "10px 20px", fontSize: "20px" }}
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => {
                  stopAudio();
                  setCurrentPage(0);
                }}
              >
                Start
              </button>
            )}
          </div>
        </>
      )}
      {currentPage >= 0 && currentPage <= 3 && (
        <AudioPage
          selection={selections[currentPage]}
          audioTest={audioTests[currentPage]}
          nextPage={nextPage}
          prevPage={prevPage}
          handleBackHome={handleBackHome}
          pageIndex={currentPage}
          handleSelection={handleSelection}
          shouldInitialStateBePlaying={
            selectionsThatHaveAutoplayedAlready[currentPage]
          }
        />
      )}
      {currentPage === 4 && (
        <ResultsComponent
          userSelections={selections}
          audioTests={audioTests}
          auditiveDisorders={auditiveDisorders}
          restartGame={restartGame}
        />
      )}
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
            Icon: Flaticon.com <br></br> Musik: Harmonic Horizon von Albert-Paul
            auf pixabay.com
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowCreditsModal(false)}
          >
            Schließen
          </button>
        </ChildrenModal>
        <Modal show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
}

export default App;