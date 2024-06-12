import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContainerG from "../../components/container/ContainerG";
import Navbar from "../../components/Navbar";
import styles from "./Desafios.module.css";
import backarrow from "../../img/backarrow.png";
import BotaoCriarPost from "../GrupoDetails/componentsGrupo/BotaoCriarPost";

const Desafios = () => {
  const { grupoNome } = useParams();
  const [desafios, setDesafios] = useState([]);

  useEffect(() => {
    const fetchDesafios = async () => {
      try {
        const pathname = window.location.href
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 1];
        console.log(groupName)

        const responseGrupos = await fetch(`http://localhost:3001/challenges?groupName=${groupName}`);
        const dataGrupos = await responseGrupos.json();
        console.log(dataGrupos)
        setDesafios(dataGrupos)

      } catch (error) {
        console.error('Error fetching desafios:', error);
      }
    };

    fetchDesafios();
  }, [grupoNome]);

  return (
    <div>
      <Navbar />
      <ContainerG style={{ backgroundColor: "orange" }}>
        <div className={styles.title}>
          Desafios - Grupo {grupoNome}
          <Link to="/profile" className={`${styles.img} img`}>
            <img src={backarrow} alt="Back Arrow" />
          </Link>
        </div>
        <div className={`${styles.desafiosList} ${styles.desafiosContainer}`}>
          {desafios && desafios.map(desafio => (
            <div key={desafio.id} className={styles.desafioItem}>
              <Link to={`/Desafios/${encodeURIComponent(grupoNome)}/${encodeURIComponent(desafio.name)}`}>
                {desafio.name}
              </Link>
            </div>
          ))}
        </div>
        <Link to={`/Desafios/${encodeURIComponent(grupoNome)}/CriarDesafio`}>
        <BotaoCriarPost/>
        </Link>
      </ContainerG>
    </div>
  );
};

export default Desafios;
