import React from "react";
import Modal from "./Modal";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import SecondaryBtn from "../Buttons/SecondaryBtn";

function IntermediaryModal(props) {
  return (
    <Modal isVisible={props.showModal} onClose={props.onClose}>
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
          onClick={() => props.onClose()}
          title={"No, thanks"}
        />
      </div>

      </div>
    </Modal>
  );
}

export default IntermediaryModal;
