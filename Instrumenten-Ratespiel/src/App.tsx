import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/index.css";

import { useAudio } from "./AudioContext";
import InstrumentButton from "./components/InstrumentButton";
import Modal from "./components/Modal";
import ChildrenModal from "./components/ChildrenModal";
interface Answer {
  correctAnswer: string;
  userAnswer: string;
  variant: string;
}
interface InstrumentInfo {
  name: string;
  imageSrc: string;
}

const App: React.FC = () => {
  const allInstrumentsInfo: InstrumentInfo[] = [
    { name: "Bratsche", imageSrc: "media/path_to_bratsche.png" },
    { name: "Geige", imageSrc: "media/path_to_geige.png" },
    { name: "Gitarre", imageSrc: "media/path_to_gitarre.png" },
    { name: "Horn", imageSrc: "media/path_to_horn.png" },
    { name: "Oboe", imageSrc: "media/path_to_oboe.png" },
    { name: "Saxophon", imageSrc: "media/path_to_saxophon.png" },
    { name: "Klavier", imageSrc: "media/path_to_klavier.png" },
    { name: "Harfe", imageSrc: "media/path_to_harfe.png" },
    { name: "Orgel", imageSrc: "media/path_to_orgel.png" },
    { name: "Keins", imageSrc: "media/Empty.png" }, // For "Unknown" choice
  ];

  const instrumentsList = [
    "Bratsche",
    "Geige",
    "Gitarre",
    "Horn",
    "Oboe",
    "Saxophon",
  ];

  const mapStepToName: Record<number, string> = {
    0: "800",
    1: "600",
    2: "400",
    3: "original",
  };

  const { playAudio, setAudio, setVolume, audio, stopAudio } = useAudio();

  const [choice, setChoice] = useState("");
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<Answer[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [gameState, setGameState] = useState(0);
  const [instrumentIndexList, setInstrumentIndexList] = useState<number[]>([]);
  const [isProfficient, setIsProfficient] = useState(false);
  const [currentInstrumentIndex, setCurrentInstrumentIndex] = useState<
    number | null
  >(null); // max 5
  const [currentVariationIndex, setCurrentVariationIndex] = useState<
    number | null
  >(null); // max 3
  // 0 = intro, 1 = testing, 2 = results

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value) / 100;
    setVolume(newVolume);
  };

  const setAudioForInstrument = () => {
    if (currentInstrumentIndex === null || currentVariationIndex === null) {
      return;
    }

    const instrument =
      instrumentsList[instrumentIndexList[currentInstrumentIndex]];

    const variation = mapStepToName[currentVariationIndex];

    const fileName = `media/${instrument}_${variation}.wav`;
    setAudio(fileName);
  };

  useEffect(() => {
    stopAudio();
    playAudio();
  }, [audio]);

  useEffect(() => {
    setAudioForInstrument();
  }, [currentVariationIndex]);

  useEffect(() => {
    if (gameState === 0) {
      setQuestionsAndAnswers([]);
      setCurrentInstrumentIndex(null);
      setCurrentVariationIndex(null);
    }
    if (gameState === 1) {
      const list = [0, 1, 2, 3, 4, 5];
      const shuffledList = list.sort(() => 0.5 - Math.random());

      setInstrumentIndexList(shuffledList);
      setCurrentInstrumentIndex(0);
      setCurrentVariationIndex(0);
      setChoice("");
    }
    if (gameState === 2) {
      const resultsAndAnswers: Record<string, string> = {};

      questionsAndAnswers.forEach((qa) => {
        resultsAndAnswers[`${qa.correctAnswer}_${qa.variant}`] = qa.userAnswer;
      });
      resultsAndAnswers["isProfficient"] = isProfficient ? "yes" : "no";

      fetch("http://localhost:3000/instruments", {
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
  }, [gameState]);

  const handleConfirmChoice = () => {
    if (currentInstrumentIndex === null || currentVariationIndex === null) {
      return;
    }
    const instrument =
      instrumentsList[instrumentIndexList[currentInstrumentIndex]];
    setQuestionsAndAnswers([
      ...questionsAndAnswers,
      {
        correctAnswer: instrument,
        userAnswer: choice,
        variant: mapStepToName[currentVariationIndex],
      },
    ]);

    if (currentVariationIndex === 3 && currentInstrumentIndex === 5) {
      setGameState(2);
      return;
    }

    if (currentVariationIndex === 3) {
      setCurrentInstrumentIndex(currentInstrumentIndex + 1);
    }

    setCurrentVariationIndex(
      currentVariationIndex === 3 ? 0 : currentVariationIndex + 1
    );

    setChoice("");
  };

  return (
    <>
      <div className="container">
        {gameState === 0 && (
          <div className="row">
            <div className="col-md-10 offset-md-1 text-center">
              <div
                className="mb-2"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h1 className="mt-3" style={{ marginRight: "10px" }}>
                    Instrumenten-Ratespiel
                  </h1>
                  <img src="music.png" alt="" style={{ width: "100px" }} />
                </div>
              </div>
              <p>

              Wie gut kannst du einem Klang das passende Instrument zuordnen? 
              Die Klänge einzelner Instrumente wurden so bearbeitet, dass die volle Klangfarbe der Instrumente erst nach und nach zu hören ist. 
              Jeweils vier aufeinanderfolgende Klänge gehören zu einem Instrument.
              </p>
              <p>Würdest du dich selbst als musikalisch bezeichnen?</p>
              <div className="mb-4 d-flex justify-content-center">
                <select
                  className="form-select"
                  style={{ width: "50%", border: "1px solid black" }}
                  aria-label="Default select example"
                  value={isProfficient ? "yes" : "no"}
                  onChange={(e) =>
                    setIsProfficient(e.target.value === "yes" ? true : false)
                  }
                >
                  <option value="yes">Ja</option>
                  <option value="no">Nein</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setGameState(1)}
              >
                Spiel Starten
              </button>
            </div>
          </div>
        )}
        {gameState === 1 && (
          <>
            <div className="row mb-4">
              <div className="col-12 text-center mb-4">
                <h2>Welches Instrument könnte es sein?</h2>
                <h2>
                  Instrument: {(currentInstrumentIndex || 0) + 1}/6 <br></br>
                  Tiefpass {(currentVariationIndex || 0) + 1}/4 :{" "}
                  {mapStepToName[currentVariationIndex || 0]}{" "}
                  {(currentVariationIndex || 0) < 3 ? "Hz" : ""}
                </h2>
              </div>
              <div className="col-md-6 text-center">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={playAudio}
                >
                  Sound Abspielen 🔊
                </button>
              </div>
              <div
                className="col-md-6"
                style={{
                  alignContent: "center",
                  marginTop: isVertical ? "20px" : "initial",
                }}
              >
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
            <div
              className="row"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {allInstrumentsInfo.map((instrument) => (
                <InstrumentButton
                  key={instrument.name}
                  instrument={instrument.name}
                  imageSrc={instrument.imageSrc}
                  onSelect={() => setChoice(instrument.name)}
                  selected={choice === instrument.name}
                />
              ))}
            </div>
            <div className="row mt-4">
              <div
                className="col-md-12 text-center"
                style={{ visibility: choice ? "visible" : "hidden" }}
              >
                <h2>Instrument Auswählen: {choice}</h2>
              </div>
              <div
                className="col-md-12 text-center"
                style={{ visibility: choice ? "visible" : "hidden" }}
              >
                <button
                  className="btn btn-success mt-2"
                  type="button"
                  onClick={handleConfirmChoice}
                >
                  Bestätigen
                </button>
              </div>
            </div>
          </>
        )}
        {gameState === 2 && (
          <div>
            <div style={{ textAlign: "center" }} className="mb-4">
              <h1>Ergebnisse</h1>
            </div>
            <div
              style={
                !isVertical
                  ? {
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }
                  : {}
              }
            >
              {isVertical && (
                <table
                  className="table"
                  style={{
                    border: "1px solid gray",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Richtige Antwort</th>
                      <th>Deine Antowrt</th>
                      <th>Filter</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*  the rows in correct answer column are grouped by groups of 4  */}

                    {questionsAndAnswers.map((qa, index) => (
                      <tr key={index}>
                        {index % 4 === 0 && (
                          <td rowSpan={4}>
                            {qa.correctAnswer}{" "}
                            <img
                              style={{ maxHeight: "25px" }}
                              src={
                                allInstrumentsInfo.find(
                                  (info) => info.name === qa.correctAnswer
                                )?.imageSrc
                              }
                            ></img>
                          </td>
                        )}
                        <td>
                          <span
                            style={{
                              color:
                                qa.correctAnswer === qa.userAnswer
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {qa.userAnswer}{" "}
                          </span>
                          <img
                            style={{ maxHeight: "25px" }}
                            src={
                              allInstrumentsInfo.find(
                                (info) => info.name === qa.userAnswer
                              )?.imageSrc
                            }
                          ></img>
                        </td>
                        <td>
                          {qa.variant === "original" ? "Original" : qa.variant}
                          {qa.variant != "original" ? "Hz" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!isVertical &&
                questionsAndAnswers.map((_, index) => {
                  if (index % 4 === 0) {
                    const nextFourQAs = questionsAndAnswers.slice(
                      index,
                      index + 4
                    );
                    return (
                      <div
                        style={{
                          float: "left",
                          marginRight: "0.5em",
                          marginLeft: "0.5em",
                          flex: "0 0 30%",
                        }}
                      >
                        <table
                          className="table"
                          style={{
                            border: "1px solid gray",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>Richtige Antwort</th>
                              <th>Deine Ant­wort</th>
                              <th>Filter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/*  the rows in correct answer column are grouped by groups of 4  */}

                            {nextFourQAs.map((qa, index) => (
                              <tr key={index}>
                                {index === 0 && (
                                  <td rowSpan={4}>
                                    {qa.correctAnswer}{" "}
                                    <img
                                      style={{ maxHeight: "25px" }}
                                      src={
                                        allInstrumentsInfo.find(
                                          (info) =>
                                            info.name === qa.correctAnswer
                                        )?.imageSrc
                                      }
                                    ></img>
                                  </td>
                                )}
                                <td>
                                  <span
                                    style={{
                                      color:
                                        qa.correctAnswer === qa.userAnswer
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {qa.userAnswer}{" "}
                                  </span>
                                  <img
                                    style={{ maxHeight: "25px" }}
                                    src={
                                      allInstrumentsInfo.find(
                                        (info) => info.name === qa.userAnswer
                                      )?.imageSrc
                                    }
                                  ></img>
                                </td>
                                <td>
                                  {qa.variant === "original"
                                    ? "Original"
                                    : qa.variant}
                                  {qa.variant != "original" ? "Hz" : ""}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                })}
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setGameState(0)}
              >
                Wiederholen
              </button>
            </div>
          </div>
        )}
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
          onClick={() => setShowModal(true)}
        >
          ⚙
        </button>
        <button
          style={{
            position: "fixed",
            right: 10,
            top: 60,
            zIndex: 1000, // Ensure it's above other content
          }}
          onClick={() => setShowCreditsModal(true)}
        >
          📃
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
            Icon: Flaticon.com <br></br>
            Instrumente: Pixabay.com<br></br>
Saxophon: https://pixabay.com/de/illustrations/saxophon-musikinstrument-1473373/ <br></br>
Flöte: https://pixabay.com/de/vectors/fl%C3%B6te-musik-klassiker-jazz-spielen-306396/ <br></br>
Violine: https://pixabay.com/de/vectors/geige-musik-musikinstrument-156558/ <br></br>
Oboe: https://pixabay.com/de/vectors/klarinette-musik-instrument-oboe-145175/ <br></br>
Bratsche: https://pixabay.com/de/vectors/geige-bratsche-instrument-string-31810/ <br></br>
Piano: https://pixabay.com/de/vectors/klavier-fl%C3%BCgel-baby-grand-piano-31357/ <br></br>
Horn: https://pixabay.com/de/photos/trompete-horn-blasinstrument-2878648/ <br></br>
Harfe: https://pixabay.com/de/vectors/harfe-musik-musikinstrument-145219/ <br></br>
Gitarre: https://pixabay.com/de/vectors/gitarre-musik-musikinstrument-159661/ <br></br>
Töne der Instrumente: Kostenfreie Samples in Apples Musikbearbeitungsprogramm „GarageBand“.
[Garage Band license agreement: You may use the Apple and third party audio loop content (Audio Content), contained in or otherwise included with the Apple Software, on a royalty-free basis, to create your own original music compositions or audio projects.]


          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowCreditsModal(false)}
          >
            Schließen
          </button>
        </ChildrenModal>
      </div>
    </>
  );
};

export default App;
