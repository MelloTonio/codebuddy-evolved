import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./DesafioResolver.module.css";
import send from "../../img/sendResolver.png";
import back from "../../img/backResolver.png";
import gpt from "../../img/gpt.png";
import BotaoResolver from "./componentesResolver/BotaoResolver";

const handleCriarDesafio = async (challengeName, groupName, answer_code) => {
  try {
    const response = await fetch('http://localhost:3001/challenge/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: challengeName,
        group: groupName,
        answer: [{
          name: "",
          text: answer_code
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // Return the response data
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    throw error;
  }
};

const DesafioResolver = () => {
  const { grupoNome, desafioNome } = useParams();
  const [code, setCode] = useState("");
  const [responseMessage, setResponseMessage] = useState(null); // State to store response message
  const navigateTo = useNavigate();
  const textareaRef = useRef(null);
  const highlighterRef = useRef(null);

  const handleInputChange = (event) => {
    setCode(event.target.value);
  };

  const getSavedState = () => {
    const savedState = localStorage.getItem("desafioState");
    return savedState ? JSON.parse(savedState) : null;
  };

  const saveState = (state) => {
    localStorage.setItem("desafioState", JSON.stringify(state));
  };

  const [grupo, setGrupo] = useState(null);
  const [desafio, setDesafio] = useState(getSavedState() || {
    nome: "Nome do Desafio",
    texto: "Texto do Desafio...",
  });

  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 3];
        const challengeName = parts[parts.length - 2];

        const responseGrupos = await fetch(`http://localhost:3001/challenges?groupName=${groupName}&challengeName=${challengeName}`);
        const dataGrupos = await responseGrupos.json();
        console.log(dataGrupos);
        setGrupo(dataGrupos[0]);
      } catch (error) {
        console.error('Error fetching grupo:', error);
      }
    };

    fetchGrupo();
  }, [grupoNome, desafioNome]);

  const handleVoltarClick = () => {
    navigateTo(`/Desafios/${encodeURIComponent(grupoNome)}/${encodeURIComponent(desafioNome)}`);
  };

  const handleSubmit = async () => {
    try {
      const data = await handleCriarDesafio(desafioNome, grupoNome, code);
      console.log(data);
      setResponseMessage(data); // Store the response message
    } catch (error) {
      setResponseMessage({ error: 'An error occurred while submitting the challenge.' });
    }
  };

  useEffect(() => {
    const syncScroll = () => {
      if (textareaRef.current && highlighterRef.current) {
        highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
        highlighterRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    };

    if (textareaRef.current) {
      textareaRef.current.addEventListener('scroll', syncScroll);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('scroll', syncScroll);
      }
    };
  }, []);

  return (
    <div className={styles.desafioResolver}>
      <div className={styles.exercicioTexto}>
        {grupo && desafio && (
          <>
            <div className={styles.grupo}>Grupo: {grupo.group}</div>
            <div className={styles.desafio}>Desafio: {grupo.name}</div>
            <div className={styles.textoDesafio}>Texto do Desafio: {grupo.text}</div>
          </>
        )}
      </div>
      <div className={styles.textareaContainer}>
        <div className={styles.codeHighlighter} ref={highlighterRef}>
          <SyntaxHighlighter language="python" style={darcula} showLineNumbers={true}>
            {code}
          </SyntaxHighlighter>
        </div>
        <textarea
          className={styles.editorTexto}
          onChange={handleInputChange}
          placeholder="Digite aqui..."
          value={code}
          ref={textareaRef}
          spellCheck="false"
        />
      </div>
      <div className={styles.botoesContainer}>
        <BotaoResolver imagemSrc={send} onClick={handleSubmit} />
        <BotaoResolver imagemSrc={back} onClick={handleVoltarClick} />
        <BotaoResolver imagemSrc={gpt} />
      </div>
      {responseMessage && (
        <div className={styles.responseMessage}>
          {responseMessage.error ? (
            <div>{responseMessage.error}</div>
          ) : (
            <div>{JSON.stringify(responseMessage)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesafioResolver;
