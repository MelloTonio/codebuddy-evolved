import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "../GrupoDetails/componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import styles from "./ListaAlunos.module.css";

const ListaAlunos = () => {
  const { grupoNome, alunoId } = useParams();
  const [alunosDoGrupo, setAlunosDoGrupo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDesafios = async () => {
      try {
        const pathname = window.location.href
        const parts = pathname.split('/');
        const groupName = parts[parts.length - 1];

        const responseGrupos = await fetch(`http://localhost:3001/studygroup/groups?studyGroup=${groupName}`);
        const dataGrupos = await responseGrupos.json();
        setAlunosDoGrupo(dataGrupos)
        console.log(dataGrupos)
      } catch (error) {
        console.error('Error fetching desafios:', error);
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
                <div>{aluno} </div>
              </div>
            ))
          ) : (
            <p>Nenhum aluno encontrado.</p>
          )}
        </div>
      </ContainerG>
    </div>
  );
};

export default ListaAlunos;
