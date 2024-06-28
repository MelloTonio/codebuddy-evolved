import React, { useState } from "react";
import PropTypes from "prop-types";
import PopupGPT from "./PopupGPT";
import styles from "./BotaoResolver.module.css";

const BotaoResolver = ({ imagemSrc, onClick }) => {
  const [popupAberto, setPopupAberto] = useState(false);

  const handleAbrirPopup = () => {
    setPopupAberto(true);
  };

  const handleFecharPopup = () => {
    setPopupAberto(false);
  };

  return (
    <>
      <button
      className={styles.botaoResolver}
        onClick={onClick || handleAbrirPopup}
      >
        <img src={imagemSrc} alt="Botão Resolver" style={{ width: "80%", height: "80%" }} />
      </button>
      {popupAberto && imagemSrc.includes("gpt") && (
        <PopupGPT onClose={handleFecharPopup} />
      )}
    </>
  );
};

BotaoResolver.propTypes = {
  imagemSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default BotaoResolver;
