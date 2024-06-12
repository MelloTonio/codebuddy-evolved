import React, { useState } from "react";
import styles from "./FormularioCriarGrupo.module.css";
import { useNavigate } from 'react-router-dom';

const FormularioCriarGrupo = () => {
  const [formData, setFormData] = useState({ name: "", foco: "", adicionarAluno: "", descricao: "", StudyGroups: [""] });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const storedUsername = localStorage.getItem('username');
    const updatedStudyGroups = [formData.name, ...formData.StudyGroups];

    try {
      const response = await fetch('http://localhost:3001/studygroup/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          subject: formData.foco,
          students: `${formData.adicionarAluno}, ${storedUsername}`,
          description: formData.descricao
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle successful response
      navigate("/Profile");
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          id="nome"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome"
        />
      </div>
      <div className={styles.formGroup}>
        <select
          id="foco"
          name="foco"
          value={formData.foco}
          onChange={handleChange}
        >
          <option value="">Selecione um foco</option>
          <option value="programacao">Programação</option>
          <option value="bancodeDados">Banco de Dados</option>
          <option value="algoritmo">Algoritmo</option>
          <option value="arquitetura">Arquitetura</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          id="adicionarAluno"
          name="adicionarAluno"
          value={formData.adicionarAluno}
          onChange={handleChange}
          placeholder="Enzo, Alexandre, Gabriel..."
        />
      </div>
      <div className={styles.formGroupDescription}>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className={styles.textAreaDescription}
          placeholder="Descrição"
        />
      </div>
      <button className={styles.submitButton} type="submit">
        Criar Grupo
      </button>
    </form>
  );
};

export default FormularioCriarGrupo;