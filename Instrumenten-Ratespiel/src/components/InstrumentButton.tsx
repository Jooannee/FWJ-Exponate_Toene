import React from "react";

interface Props {
  instrument: string;
  onSelect: (instrument: string) => void;
  imageSrc: string;
  selected: boolean;
}

const InstrumentButton: React.FC<Props> = ({
  instrument,
  onSelect,
  imageSrc,
  selected,
}) => {
  return (
    <div className="text-center instrument-col">
      <img
        onClick={() => onSelect(instrument)}
        src={imageSrc}
        alt={instrument}
        className="img-fluid"
      />
      <p style={{ WebkitTextStroke: selected ? "1px white" : "1px black" }}>
        {instrument}
      </p>
    </div>
  );
};

export default InstrumentButton;
