import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "../GrupoDetails/componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import styles from "./Resposta.module.css";

const Resposta = () => {
  const { alunoId, grupoNome, desafioNome } = useParams();
  const [studentName, setStudentName] = useState("");
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("");
  const [comments, setComments] = useState("");
  const [desafioId, setDesafioId] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");
  const [teste, setTeste] = useState("");

  const filterChallengesByAlumniName = (challenges, name) => {
    return challenges.filter(challenge => 
      challenge.name === name
    );
  };
  
  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 3];
        const challengeName = parts[parts.length - 4];
        const profileName = localStorage.getItem("data")
        setNomePessoa(JSON.parse(profileName).username)
        
        const responseGrupos = await fetch(`http://localhost:3001/challenges/solved?studyGroup=${groupName}&challengeName=${challengeName}&profileName=${JSON.parse(profileName).username}`);
        const dataGrupos = await responseGrupos.json();
        console.log(dataGrupos)
        setTeste(filterChallengesByAlumniName(dataGrupos, decodeURIComponent(challengeName)));
        console.log(teste)

      
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
      <ContainerG className={styles.container} style={{ backgroundColor: "#4565B7" }}>
        <NavbarGrupo />
        <div className={styles.respostaContainer}>
          <h2>Resposta do Aluno {studentName}</h2>
          <div className={styles.infoBox}>
          </div>
          {teste ? (teste[0].answer.map((a) => (
                      <div className={styles.infoBox}>
                      <span className={styles.label}>Resposta:</span>
                      <span className={`${styles.text} ${styles.destacado}`}>{a.text}</span>
                    </div>
          ))) : (
            <div className={styles.infoBox}>
            <span className={styles.label}>Resposta:</span>
            <span className={`${styles.text} ${styles.destacado}`}></span>
          </div>
          )}
        </div>
        <div className={styles.notaComentariosContainer}>
          <div className={styles.infoBox}>
            <span className={styles.label}>Nota:</span>
            {grade ? <span className={styles.text}>{grade}</span> : <input type="text" placeholder="Atribuir nota" />}
          </div>
          <div className={styles.infoBox}>
            <span className={styles.label}>Comentários:</span>
            {comments ? (
              <span className={styles.text}>{comments}</span>
            ) : (
              <textarea placeholder="Adicionar comentário" rows={4} className={styles.commentInput} />
            )}
          </div>
        </div>
      </ContainerG>
    </div>
  );
};

export default Resposta;
