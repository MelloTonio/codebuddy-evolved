import React, { useState, useEffect } from "react";
import ContainerG from "../../components/container/ContainerG";
import Navbar from "../../components/Navbar";
import styles from "./AdicionaAlunos.module.css";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AdicionarAlunos = () => {
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const navigate = useNavigate()
  const [inputEsperado, setInputEsperado] = useState("");
  const [outputEsperado, setOutputEsperado] = useState("");
  const [dificuldade, setDificuldade] = useState("Fácil");
  const [alunos, setAlunos] = useState("");

  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUsername = localStorage.getItem('data');
    const commaSeparatedValues = selectedOptions.map(item => item.value).join(', ');
    console.log(commaSeparatedValues)

    const pathname = window.location.href;
    const parts = pathname.split('/');
    const groupName = decodeURIComponent(parts[parts.length - 1])

    try {
      const response = await fetch('http://localhost:3001/studygroup/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupName,
          students: `${commaSeparatedValues}`,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


      navigate(`/listaAlunos/${groupName}`);
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const lastSegment = path.substring(path.lastIndexOf('/') + 1);
    // Decode the last segment to replace '%20' with spaces
    const decodedLastSegment = decodeURIComponent(lastSegment);
    console.log(decodedLastSegment)
    const fetchAlunos = async () => {
      try {
        const responseAlunos = await fetch(`http://localhost:3001/profiles/notIn?groupName=${lastSegment}`);
        const dataAlunos = await responseAlunos.json();
        console.log(dataAlunos)
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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedOptions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedOptions(items);
  };


  const handleCriarDesafio = () => {
    const pathname = window.location.href;
    const parts = pathname.split('/');
    const groupName = decodeURIComponent(parts[parts.length - 2]);  

    console.log(groupName, nome, texto, inputEsperado, outputEsperado, dificuldade);
    fetch('http://localhost:3001/challenge/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nome, text: texto, group: groupName, input: inputEsperado, output: outputEsperado, difficulty: dificuldade})
    })
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
      // Handle error
    });
  };

  return (
    <div>
      <Navbar />
      <ContainerG className={styles.containerGDesafio}>
        <div className={styles.formContainerDesafio}>
          <form className={styles.formDesafio} onSubmit={handleSubmit}>
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
          <button> adicionar </button>
          </form>
        </div>
      </ContainerG>
    </div>
  );
};

export default AdicionarAlunos;