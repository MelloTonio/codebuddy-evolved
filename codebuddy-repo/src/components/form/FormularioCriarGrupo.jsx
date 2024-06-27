import React, { useEffect, useState } from "react";
import styles from "./FormularioCriarGrupo.module.css";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FormularioCriarGrupo = () => {
  const [formData, setFormData] = useState({ name: "", foco: "", adicionarAluno: "", descricao: "", StudyGroups: [""] });
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [alunos, setAlunos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedOptions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedOptions(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUsername = localStorage.getItem('data');
    const updatedStudyGroups = [formData.name, ...formData.StudyGroups];

    const commaSeparatedValues = selectedOptions.map(item => item.value).join(', ');
    try {
      const response = await fetch('http://localhost:3001/studygroup/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          subject: formData.foco,
          students: `${commaSeparatedValues}, ${JSON.parse(storedUsername).username}`,
          description: formData.descricao
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate("/Profile");
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const responseAlunos = await fetch(`http://localhost:3001/profiles`);
        const dataAlunos = await responseAlunos.json();
        const optionsAlunos = dataAlunos.map(user => ({
          value: user.username,
          label: user.username
        }))
        setAlunos(optionsAlunos)
        console.log(optionsAlunos)
      } catch (error) {
        console.error('Error fetching Alunos:', error);
      }
    };

    fetchAlunos();
  }, []);

  return (
    <div className={styles.formContainer}>
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
          <Select
            isMulti
            options={alunos}
            value={selectedOptions}
            onChange={handleSelectChange}
            placeholder="Nome do Aluno"
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="selected-options">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedOptions.map((option, index) => (
                    <Draggable key={option.value} draggableId={option.value} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={styles.sortableItem}
                        >
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
    </div>
  );
};

export default FormularioCriarGrupo;
