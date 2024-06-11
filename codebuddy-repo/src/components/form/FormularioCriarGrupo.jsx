import React, { useState } from "react";
import styles from "./FormularioCriarGrupo.module.css";
import { useNavigate } from 'react-router-dom';


const FormularioCriarGrupo = () => {
  const [formData, setFormData] = useState({ StudyGroups: [""] });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    const updatedStudyGroups = [formData.name, ...formData.StudyGroups];
    const storedUsername = localStorage.getItem('username');
    // Send POST request with form data
    fetch('http://localhost:3001/studygroup/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: formData.name, subject: formData.foco, students: formData.adicionarAluno + `, ${storedUsername}`, description: formData.descricao})
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
      navigate("/Profile")
    })
    .catch(error => {

      console.log(error)
      console.error('There was a problem with your fetch operation:', error);
      // Handle error
    });
  };

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <input type="text" id="nome" name="name" value={formData.name} onChange={handleChange} placeholder="Nome"/>
      </div>
      <div className={styles.formGroup}>
        <select id="foco" name="foco" value={formData.foco} onChange={handleChange} placeholder="Foco">
          <option value="programacao">Programação</option>
          <option value="bancodeDados">Banco de Dados</option>
          <option value="algoritmo">Algoritmo</option>
          <option value="arquitetura">Arquitetura</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <input type="text" id="adicionarAluno" name="adicionarAluno" value={formData.adicionarAluno} onChange={handleChange} placeholder="Enzo, Alexandre, Gabriel..." />
      </div>
      <div className={styles.formGroupDescription}>
        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} className={styles.textAreaDescription} placeholder="Descrição"/>
      </div>
      <button onClick={handleSubmit} className={styles.submitButton} type="submit">
        Criar Grupo
      </button>
    </form>
  );
};

export default FormularioCriarGrupo;
