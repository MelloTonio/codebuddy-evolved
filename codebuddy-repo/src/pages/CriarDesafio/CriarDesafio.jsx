import React, { useState } from "react";
import ContainerG from "../../components/container/ContainerG";
import styles from "./CriarDesafio.module.css";
import NavbarCriarDesafio from "./componentsCriarDesafio/NavbarCriarDesafio";
import Navbar from "../../components/Navbar";

const CriarDesafio = () => {
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [inputEsperado, setInputEsperado] = useState("");
  const [outputEsperado, setOutputEsperado] = useState("");
  const [dificuldade, setDificuldade] = useState("Fácil");

  const handleCriarDesafio = () => {
    const pathname = window.location.href;
    const parts = pathname.split('/');
    const groupName = decodeURIComponent(parts[parts.length - 2]);  

    console.log(groupName, nome, texto, inputEsperado, outputEsperado, dificuldade);
    fetch('http://localhost:3001/challenge/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nome, text: texto, group: groupName, input: inputEsperado, output: outputEsperado, difficulty: dificuldade})
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
      // Handle error
    });
  };

  return (
    <div>
      <Navbar />
      <ContainerG className={styles.containerGDesafio}>
        <NavbarCriarDesafio className={styles.navbarDesafio} title="Criar Desafio" backButton />
        <div className={styles.formContainerDesafio}>
          <form className={styles.formDesafio}>
            <label htmlFor="nome" className={styles.labelDesafio}>
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={styles.inputDesafio}
            />

            <label htmlFor="texto" className={styles.labelDesafio}>
              Texto:
            </label>
            <textarea
              id="texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className={styles.textareaDesafio}
            ></textarea>

            <label htmlFor="inputEsperado" className={styles.labelDesafio}>
              Input Esperado:
            </label>
            <input
              type="text"
              id="inputEsperado"
              value={inputEsperado}
              onChange={(e) => setInputEsperado(e.target.value)}
              className={styles.inputDesafio}
            />

            <label htmlFor="outputEsperado" className={styles.labelDesafio}>
              Output Esperado:
            </label>
            <input
              type="text"
              id="outputEsperado"
              value={outputEsperado}
              onChange={(e) => setOutputEsperado(e.target.value)}
              className={styles.inputDesafio}
            />

            <label htmlFor="dificuldade" className={styles.labelDesafio}>
              Dificuldade:
            </label>
            <select
              id="dificuldade"
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              className={styles.selectDesafio}
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>

            <button type="button" onClick={handleCriarDesafio} className={styles.buttonDesafio}>
              Criar
            </button>
          </form>
        </div>
      </ContainerG>
    </div>
  );
};

export default CriarDesafio;