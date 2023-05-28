import React from "react";
import "./Modal.css"
import CloseButton  from "../../assets/closeButton";

function Modal({ isVisible, onClose, children}) {
  if (!isVisible) return null;
  return (
    <div
      className={"modal"}
      id="modal"
    >
      <div
        className={"modalBody"}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <button className="modalClose" onClick={() => onClose()}>
          <CloseButton />
        </button>
        <div className="modalContent">{children}</div>
      </div>
    </div>
  );
}
export default Modal;
