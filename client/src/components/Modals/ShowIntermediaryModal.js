import React from "react";
import Modal from "./Modal";
import UserComponent from "../Intermediary/UserComponent";

function ShowIntermediaryModal({
  showModal,
  onClose,
  data,
  generateInvoice,
  destination,
}) {
  return (
    <Modal isVisible={showModal} onClose={onClose}>
      <h2 className="text-center">Choose an Intermediary 👤:</h2>
      <p className="text-center">
        There are <span className="brandcolor">{data && data.length}</span>{" "}
        available users from {destination}:
      </p>
      <div className="userComponent">
        {data &&
          data.map((user, i) => (
            <UserComponent
              onClick={generateInvoice}
              user={user}
              key={i}
            />
          ))}
      </div>
    </Modal>
  );
}

export default ShowIntermediaryModal;
