import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/index.css";
import { LineChart } from "@mui/x-charts";
import Modal from "./Modal";
import ChildrenModal from "./ChildrenModal";

type Frequency = {
  frequency: number;
  realDecibels: number;
  amplitudesNeeded: Array<{ targetDecibel: number; amplitudeNeeded: number }>;
};

// extend global namespace with custom function async function globalPlayOscillator(type, amp, freq, duration = 0.5)
declare global {
  interface Window {
    globalPlayOscillator: (amp: number, freq: number) => Promise<void>;
    globalStopOscillator: () => void;
  }
}

let uninterrupted = true;
let amplitude = 0;
let amplitudeIndex = 0;
let frequency = 0;

function App() {
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [dataset, setDataset] = useState<any>([]);
  const [playing, setPlaying] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentFrequencyIndex, setCurrentFrequencyIndex] = useState(0);
  const [page, setPage] = useState(0); // 0 = start, 1 = test, 2 = end
  const [results, setResults] = useState<
    { frequency: number; amplitude: number; decibels: number }[]
  >([]);

  useEffect(() => {
    const fetchFrequencies = async () => {
      const result = await fetch("./frequencies/frequencies.json");
      const data: Frequency[] = await result.json();
      setFrequencies(data);
    };
    fetchFrequencies();
  }, []);

  const playSound = () => {
    window.globalPlayOscillator(amplitude, frequency);
  };

  const stopSound = () => {
    window.globalStopOscillator();
  };

  const stepUpAmplitude = () => {
    if (amplitude !== 0) {
      const frequency = frequencies[order[currentFrequencyIndex]];
      amplitude = frequency.amplitudesNeeded[amplitudeIndex].amplitudeNeeded;

      if (frequency.amplitudesNeeded[amplitudeIndex + 1]) {
        amplitudeIndex++;
      }
    }
  };

  const handleButtonPress = async () => {
    if (amplitude === 0) {
      return;
    }

    const frequency = frequencies[order[currentFrequencyIndex]];

    const isAmplitudeIndexValid = !!frequency.amplitudesNeeded[amplitudeIndex];
    const decibels = isAmplitudeIndexValid
      ? frequency.amplitudesNeeded[amplitudeIndex].targetDecibel
      : frequency.amplitudesNeeded[frequency.amplitudesNeeded.length - 1]
          .targetDecibel;

    setResults([
      ...results,
      {
        frequency: frequency.frequency,
        amplitude,
        decibels,
      },
    ]);

    setCurrentFrequencyIndex(currentFrequencyIndex + 1);

    if (currentFrequencyIndex === frequencies.length - 1) {
      setPlaying(false);
      setPage(2);
    }
  };

  useEffect(() => {
    const asyncInUseEffect = async () => {
      while (uninterrupted) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        stepUpAmplitude();
        playSound();
      }
    };
    if (playing) {
      asyncInUseEffect();
    } else {
      stopSound();
      uninterrupted = false;
    }
  }, [playing]);

  useEffect(() => {
    if (page === 0) {
      setPlaying(false);
      setResults([]);
      return;
    }
    if (page === 1) {
      const randomOrderOfFrequencyIndexes = [
        ...Array(frequencies.length).keys(),
      ].sort(() => Math.random() - 0.5);
      setOrder(randomOrderOfFrequencyIndexes);
      setCurrentFrequencyIndex(0);
      uninterrupted = true;
      setPlaying(true);
    } else {
      const offsetResults = [
        61.97, 55.71, 50.71, 43.14, 34.18, 28.75, 26.65, 18.98, 14.38, 9.17,
        5.39, 2.13, 2.39, -1.3, -6.1, -3.8, 4.28, 12.6, 13.9,
      ];
      const convertedResults = results
        .map((result) => ({
          x: result.frequency,
          y: result.decibels,
        }))
        .sort((a, b) => a.x - b.x)
        .map((result, i) => ({
          ...result,
          y2: (offsetResults[i] || 0) + 30,
        }));
      setDataset(convertedResults);
      setPlaying(false);
      const dataToSend = {
        frequencies: convertedResults.map((result) => result.x),
        decibels: convertedResults.map((result) => result.y),
      };
      fetch("http://localhost:3000/hearing-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [page]);

  useEffect(() => {
    if (playing) {
      frequency = frequencies[order[currentFrequencyIndex]].frequency;
      amplitude = 0;
      amplitudeIndex = 0;
      setButtonDisabled(true);
      setTimeout(() => {
        if (frequency < 100) {
          amplitude =
            frequencies[order[currentFrequencyIndex]].amplitudesNeeded[20]
              .amplitudeNeeded;
          amplitudeIndex = 20;
        } else {
          amplitude =
            frequencies[order[currentFrequencyIndex]].amplitudesNeeded[0]
              .amplitudeNeeded;
          amplitudeIndex = 0;
        }

        setButtonDisabled(false);
        playSound();
      }, 1000);
    }
  }, [currentFrequencyIndex, playing, order]);

  const Start = () => {
    return (
      <>
        <div
          className="card"
          style={{
            borderRadius: "20px",
            backgroundColor: "#f4f4f4",
            padding: "20px",
          }}
        >
          <div className="text-center">
            <h1>Hörtest</h1>
            <p style={{ fontSize: "1.3em" }}>
              Wie gut ist dein Gehör? Finde es heraus!
            </p>
            <img
              className="mb-2 mt-2"
              src="horen.png"
              style={{ maxWidth: "200px" }}
            />
            <p style={{ fontSize: "1.3em" }}>
            Zuerst musst du den Kopfhörer aufsetzen und sicherstellen, dass er gut sitzt. 
            Du wirst gleich 19 verschieden hohe Töne hören; sie starten ganz leise und werden immer lauter. 
            Klicke auf den Button, sobald du einen Ton hörst!
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setPage(1);
                }}
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                }}
              >
                Start
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </>
    );
  };

  const Test = () => {
    return (
      <>
        <div className="text-center">
          <h3>Test läuft...</h3>
          <h4 className="mt-4">
            Frequenz {currentFrequencyIndex + 1}/{frequencies.length}
          </h4>
          <div
            className="progress mt-4"
            style={{ height: "40px" }}
            key={currentFrequencyIndex}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${
                  (100 / frequencies.length) * (currentFrequencyIndex + 1)
                }%`,
                background: "#90ee90",
              }}
            ></div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleButtonPress}
              className="btn btn-primary"
              style={{
                padding: "20px 160px",
              }}
              disabled={buttonDisabled}
            >
              Ich kann den Ton hören!
            </button>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={() => {
                setPage(0);
              }}
              className="btn btn-primary"
              style={{
                padding: "20px 60px",
              }}
            >
              Zum Start zurück 🏠
            </button>
          </div>
        </div>
      </>
    );
  };

  const End = () => {
    return (
      <>
        <div className="mb-4">
          <h2>Ergebnisse</h2>
          <p>
          Im unteren Graphen kannst du deine Ergebnisse sehen. Was fällt dir auf? 
          In der Akustik werden die Größen 'Schalldruckpegel' und 'Frequenz' verwendet, um die Intensität und Höhe von Tönen zu beschreiben. 
          Der Schalldruckpegel beschreibt den Druck, den die Schallwellen in der Luft erzeugen und der von deinem Trommelfell im Ohr gemessen wird. 
          Ist die Lautstärke gleich dem Schalldruckpegel? Wann ist ein Ton lauter, wann leiser?
          </p>
          {/* <ul>
            {results.map((result, index) => (
              <li key={index}>
                Frequency: {result.frequency.toFixed(2)} Hz, Perceived at
                amplitude: {result.amplitude.toFixed(5)}, Perceived at decibels:{" "}
                {result.decibels.toFixed(2)}
              </li>
            ))}
          </ul> */}
          <div className="mt-5 text-center" style={{ display: "flex" }}>
            <LineChart
              className="mt-2"
              grid={{ vertical: true, horizontal: true }}
              xAxis={[
                {
                  id: "xAxis",
                  dataKey: "x",
                  label: "Frequenz [Hz]",
                  scaleType: "log",
                  disableTicks: false,
                  hideTooltip: true,
                  tickLabelInterval: (value) => {
                    return value.toString().startsWith("1");
                  },
                },
                {
                  id: "xAxis2",
                  dataKey: "x",
                  scaleType: "log",
                  disableTicks: false,
                  hideTooltip: true,
                  tickLabelInterval: () => {
                    return false;
                  },
                },
              ]}
              series={[
                {
                  dataKey: "y",
                  label: "Deine Hörergebnisse",
                },
                {
                  dataKey: "y2",
                  connectNulls: true,
                  label: "Hörbeeinträchtigung",
                  color: "red",
                },
              ]}
              yAxis={[
                {
                  scaleType: "linear",
                  dataKey: "y",
                  label: "Schalldruckpegel [dB]",
                  max: 100,
                  min: 0,
                  id: "yAxis",
                },
              ]}
              width={800}
              height={300}
              dataset={dataset}
              topAxis="xAxis2"
              rightAxis="yAxis"
            />
          </div>
        </div>

        <div className="text-center">
          <div className="mt-4">
            <p>
              Der rote Graph beschreibt ungefähr die Grenze, ab der Hörprobleme
              auftreten können. Sollten einige deiner Werte über der roten Linie
              liegen, könnte dies ein Indiz für eine Hörschwäche sein, und du
              solltest dies professionell überprüfen lassen. Liegen deine
              Ergebnisse darunter, Glückwunsch, du kannst gut hören!{" "}
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setPage(0);
              }}
              className="btn btn-primary"
              style={{
                padding: "10px 20px",
              }}
            >
              Neustart
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={`container`}>
        <div className={`text-center`}>
          {page === 0 && <Start />}
          {page === 1 && <Test />}
          {page === 2 && <End />}
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
