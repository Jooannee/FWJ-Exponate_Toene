import React from "react";

interface ResultsComponentProps {
  userSelections: Array<string>;
  audioTests: Array<{ audioFile: string; disorder: number }>;
  auditiveDisorders: string[];
  restartGame: () => void;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({
  userSelections,
  audioTests,
  auditiveDisorders,
  restartGame,
}) => {
  const getResultItems = () => {
    return userSelections.map((selection, index) => {
      console.log("selection", selection, audioTests, auditiveDisorders);
      const isCorrect = parseInt(selection) === audioTests[index].disorder;
      return (
        <tr key={index}>
          <td>Audio {index + 1}</td>
          <td>
            {selection !== null
              ? auditiveDisorders[parseInt(selection)]
              : "No selection"}
          </td>
          <td>{auditiveDisorders[audioTests[index].disorder]}</td>
          <td style={{ color: isCorrect ? "green" : "red" }}>
            {isCorrect ? "✅ Richtig" : "❌ Falsch"}
          </td>
        </tr>
      );
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 style={{ textAlign: "center" }}>Ergebnisse</h3>
      <table
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Test</th>
            <th>Deine Antwort</th>
            <th>Richtige Antwort</th>
            <th>Ergebniss</th>
          </tr>
        </thead>
        <tbody>{getResultItems()}</tbody>
      </table>
      <button
        className="btn btn-primary"
        onClick={restartGame}
        style={{ width: "40%", marginTop: "20px" }}
      >
        Wiederholen
      </button>
    </div>
  );
};

export default ResultsComponent;
