import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "../GrupoDetails/componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from "./Resposta.module.css";
import Footer from "../../components/Footer"

const Resposta = () => {
  const { alunoId, grupoNome, desafioNome } = useParams();
  const [studentName, setStudentName] = useState("");
  const [response, setResponse] = useState("");
  const [grade, setGrade] = useState("");
  const [comments, setComments] = useState("");
  const [nomePessoa, setNomePessoa] = useState("");
  const [teste, setTeste] = useState([]);
  const [loading, setLoading] = useState(true);


  function filterByAlumni(data, alumniName) {
    return data.map(item => {
        const filteredAnswers = item.answer.filter(ans => ans.name.includes(alumniName));
        return {
            ...item,
            answer: filteredAnswers
        };
    });
  }
  
  const filterChallengesByAlumniName = (challenges, name) => {
    return challenges.filter(challenge => challenge.name === name);
  };

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const alumniName = parts[parts.length - 2];
        const groupName = parts[parts.length - 3];
        const challengeName = parts[parts.length - 4];
        const profileName = localStorage.getItem("data");
        setNomePessoa(JSON.parse(profileName).username);

        const responseGrupos = await fetch(`http://localhost:3001/challenges/solved?studyGroup=${groupName}&challengeName=${challengeName}&profileName=${alumniName}`);
        const dataGrupos = await responseGrupos.json();
        console.log(dataGrupos)
        setTeste(filterByAlumni(dataGrupos,alumniName ));
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
          <h2 className={styles.title}>Resposta do Aluno {studentName}</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : teste.length > 0 ? (
            teste[0].answer.map((a, index) => (
              <div key={index} className={styles.infoBox}>
                <SyntaxHighlighter language="javascript" style={tomorrow} className={styles.syntaxHighlighter}>
                  {a.text}
                </SyntaxHighlighter>
              </div>
            ))
          ) : (
            <div className={styles.infoBox}>
              <span className={styles.label}>Resposta:</span>
              <span className={`${styles.text} ${styles.destacado}`}></span>
            </div>
          )}
        </div>
        <div className={styles.notaComentariosContainer}>
          <div className={styles.infoBox}>
          </div>
        </div>
      </ContainerG>
      <Footer /> 
    </div>
  );
};

export default Resposta;