import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./PopupComponent.module.css";
import { useNavigate } from "react-router";

const PopupComponent = ({ onClose, nome }) => {
  const [texto, setText] = useState("");
  const navigate = useNavigate();

  const handleClose = () => {
    setText("");
    onClose();
  };

  const handleSend = async () => {
    try {
      const response = await fetch(`http://localhost:3001/studygroup/create/warning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nome, warning: texto })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Assuming the response is in JSON format
      const data = await response.json();
      console.log(data);

      // Close the popup and navigate after successful response
      handleClose();
      navigate(`/Grupo/${encodeURIComponent(nome)}`);
      
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
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
  nome: PropTypes.string.isRequired,
};

export default PopupComponent;