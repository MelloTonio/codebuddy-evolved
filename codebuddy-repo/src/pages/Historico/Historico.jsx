import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "../GrupoDetails/componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import styles from "./Historico.module.css";
import { Link } from "react-router-dom";

const Historico = () => {
  const { alunoId, grupoNome } = useParams();
  const [aluno, setAluno] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [nomePessoa, setNomePessoa] = useState(null);
  const [teste, setTeste] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 1];
        const challengeName = parts[parts.length - 2];
        const profileName = localStorage.getItem("data")
        setNomePessoa(JSON.parse(profileName).username)
        const responseGrupos = await fetch(`http://localhost:3001/challenges/solved?studyGroup=${groupName}&challengeName=${challengeName}&profileName=${JSON.parse(profileName).username}`);
        const dataGrupos = await responseGrupos.json();
        setTeste(dataGrupos);
        console.log(dataGrupos)
      
        setLoading(false);
      } catch (error) {
        console.error('Error fetching desafios:', error);
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  return (
    <div>
      <Navbar />
      <ContainerG style={{ backgroundColor: "#4565B7" }}>
        <NavbarGrupo />
        <div className={styles.listaAlunos}>
          {loading ? (
            <p>Carregando...</p>
          ) : teste ? (
            <div className={styles.alunoItem}>
              <div className={styles.infoItem}>
                <div className={styles.infoBox}>
                  <span className={styles.title}>NOME:</span>
                  <span className={styles.text}>{nomePessoa}</span>
                </div>

                <div className={styles.infoBox}>
                  <span className={styles.title}>GRUPO:</span>
                  <span className={styles.text}>{teste[0].group}</span>
                </div>
                
                {teste.map((t) => (
              <div className={styles.desafiosList}>
              {t.answer.length > 0 ? (
                  <div key={t.id} className={styles.desafioItem}>
                    <div className={styles.alunoItem}>
                        <Link
                        to={`/Historico/${t.name}/${encodeURIComponent(t.group)}/${nomePessoa}/resposta`}
                        className={styles.desafioLink}
                        >{t.name}</Link>
                    </div>
                  </div>
              ) : (
                <p>Nenhum desafio disponível.</p>
              )}
              </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Nenhuma informação disponível.</p>
          )}
        </div>
      </ContainerG>
    </div>
  );
};

export default Historico;
