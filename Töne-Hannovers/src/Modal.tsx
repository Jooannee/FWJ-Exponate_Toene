import React from "react";

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, children }) => {
  // make a function that calls localhost:3000 every 10 seconds as a health check of the server
  // if the server is live, then a useState isServerOk is set to true, if not, false

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
        {children}
      </div>
    </div>
  );
};

export default Modal;
