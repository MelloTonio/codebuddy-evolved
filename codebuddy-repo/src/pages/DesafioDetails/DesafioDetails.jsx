import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContainerG from "../../components/container/ContainerG";
import Navbar from "../../components/Navbar";
import styles from "./DesafioDetails.module.css";
import NavbarDesafio from "./componentsDesafio/NavbarDesafio";
import BotaoDesafio from "./componentsDesafio/BotaoDesafio";

const DesafioDetails = () => {
  const { grupoNome, desafioNome } = useParams();
  const [desafio, setDesafio] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchDesafio = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 2];
        const challengeName = parts[parts.length - 1];

        const responseGrupos = await fetch(`http://localhost:3001/challenges?groupName=${groupName}&challengeName=${challengeName}`);
        const dataGrupos = await responseGrupos.json();
        setDesafio(dataGrupos[0]);
      } catch (error) {
        console.error('Error fetching desafio:', error);
      }
    };

    fetchDesafio();
  }, [grupoNome, desafioNome]);

  const handleBotaoDesafioClick = () => {
    navigateTo(`/Desafios/${encodeURIComponent(grupoNome)}/${encodeURIComponent(desafioNome)}/resolver`);
  };

  return (
    <div>
      <Navbar />
      {desafio && (
        <ContainerG className={styles.containerG}>
          <NavbarDesafio />
          <div className={styles.desafioContent}>
            <h2>{desafio.name}</h2>
            <p>{desafio.text}</p>
          </div>
          <button className={styles.botaoDesafio} onClick={handleBotaoDesafioClick}>
            Resolver Desafio
          </button>
        </ContainerG>
      )}
    </div>
  );
};

export default DesafioDetails;
