import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ContainerG from "../../components/container/ContainerG";
import Navbar from "../../components/Navbar";
import styles from "./DesafioDetails.module.css";
import NavbarDesafio from "./componentsDesafio/NavbarDesafio";
import BotaoDesafio from "./componentsDesafio/BotaoDesafio";
import Footer from "../../components/Footer"

const fetchDesafioData = async (groupName, challengeName, setDesafio) => {
  try {
    const response = await fetch(`http://localhost:3001/challenges?groupName=${groupName}&challengeName=${challengeName}`);
    const data = await response.json();
    setDesafio(data[0]);
  } catch (error) {
    console.error('Error fetching desafio:', error);
  }
};

const DesafioDetails = () => {
  const { grupoNome, desafioNome } = useParams();
  const [desafio, setDesafio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (grupoNome && desafioNome) {
      fetchDesafioData(grupoNome, desafioNome, setDesafio);
    }
  }, [grupoNome, desafioNome]);

  const handleBotaoDesafioClick = () => {
    navigate(`/Desafios/${encodeURIComponent(grupoNome)}/${encodeURIComponent(desafioNome)}/resolver`);
  };

  return (
    <div>
      <Navbar />
      {desafio && (
        <ContainerG className={styles.containerG}>
          <NavbarDesafio className={styles.navbarDesafio} />
          <div className={styles.desafioContent}>
            <h2>{desafio.name}</h2>
            <p>{desafio.text}</p>
            <BotaoDesafio onClick={handleBotaoDesafioClick}>
            </BotaoDesafio>
          </div>
        </ContainerG>
      )}
      <Footer/>
    </div>
  );
};

export default DesafioDetails;