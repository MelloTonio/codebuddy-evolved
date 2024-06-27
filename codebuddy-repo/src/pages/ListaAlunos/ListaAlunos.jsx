import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "../GrupoDetails/componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import styles from "./ListaAlunos.module.css";
import BotaoCriarPost from "../GrupoDetails/componentsGrupo/BotaoCriarPost";
import Footer from "../../components/Footer"

const ListaAlunos = () => {
  const path = window.location.pathname;

  // Split the path by '/' and get the last segment
  const lastSegment = path.substring(path.lastIndexOf('/') + 1);

  // Decode the last segment to replace '%20' with spaces
  const decodedLastSegment = decodeURIComponent(lastSegment);
  console.log("bbons", decodedLastSegment)

  const [alunosDoGrupo, setAlunosDoGrupo] = useState([]);
  const [nomeGrupo, setGrupo] = useState("");
  const [loading, setLoading] = useState(true);
  const [alumniType, setalumniType] = useState([]);



  useEffect(() => {
    setalumniType(JSON.parse(localStorage.getItem("data")).profile_type)

    const fetchDesafios = async () => {
      try {
        const pathname = window.location.href;
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 1];

        const responseGrupos = await fetch(`http://localhost:3001/studygroup/groups?studyGroup=${groupName}`);
        const dataGrupos = await responseGrupos.json();
        setAlunosDoGrupo(dataGrupos);
          setGrupo(dataGrupos[0].name);
      
        setLoading(false);
      } catch (error) {
        console.error('Error fetching desafios:', error);
        setLoading(false);
      }
    };

    fetchDesafios();
  }, []);

  return (
    <div>
      <Navbar />
      <ContainerG style={{ backgroundColor: "#4565B7" }}>
        <NavbarGrupo />
        <div className={styles.listaAlunos}>
          {loading ? (
            <p>Carregando...</p>
          ) : alunosDoGrupo.length > 0 ? (
            alunosDoGrupo[0].students.map((aluno, index) => ( // Alterando para receber aluno ao invés de alunoNome
              <div key={index} className={styles.alunoItem}>
                <Link to={`/Historico/${aluno}/${nomeGrupo}`} className={styles.groupLink}>{aluno}</Link>
              </div>
            ))
          ) : (
            <p>Nenhum aluno encontrado.</p>
          )}
        </div>

        <Link to={`/AdicionarAlunos/${encodeURIComponent(decodedLastSegment)}`}>
        {alumniType == "Professor" ? (<> <BotaoCriarPost/></>) : <div className={styles.text}></div> }     
        </Link>
      </ContainerG>
      <Footer />
    </div>
  );
};

export default ListaAlunos;
