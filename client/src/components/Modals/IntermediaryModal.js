import React, { useState } from "react";
import Modal from "./Modal";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import SecondaryBtn from "../Buttons/SecondaryBtn";

function IntermediaryModal(props) {
  const [showModal,setShowModal] = useState(true);
  const onClose = () => setShowModal(false)
  return (
    <Modal isVisible={showModal} onClose={onClose}>
      <div
        id={"intermediary"}
        className="intermediaryModal"
      >
        <h1 className="intermediaryTitle">
          {props.title}
        </h1>
        <p className="intermediaryDescription">
          {props.description}
        </p>


<div className="intermediaryButtons">
        <PrimaryBtn
          loading={props.loading}
          onClick={() => props.onClick()}
          title={props.btnTitle}
          disabled={props.disabled}
        />
        <SecondaryBtn
          onClick={() => onClose()}
          title={"No, cancel"}
        />
      </div>

      </div>
    </Modal>
  );
}

export default IntermediaryModal;
