import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./PopupComponent.module.css";

const PopupComponent = ({ onClose, onSend, nome}) => {
  const [texto, setText] = useState("");

  const handleClose = () => {
    setText(""); 
    onClose();
  };

  const handleSend = () => {
    fetch(`http://localhost:3001/studygroup/create/warning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: nome, warning: texto})
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.log(error)
      console.error('There was a problem with your fetch operation:', error);
    });
  };

  return (
    <div className={styles.popup}>
      <div className={styles.closeButton} onClick={handleClose}>
        X
      </div>
      <textarea
        placeholder="Digite aqui..."
        value={texto}
        onChange={(e) => setText(e.target.value)}
        className={styles.textarea}
      />
      <button className={styles.sendButton} onClick={handleSend}>
        Enviar
      </button>
    </div>
  );
};

PopupComponent.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default PopupComponent;
