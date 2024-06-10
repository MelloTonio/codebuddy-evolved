import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CadastroForm.module.css';
import WhiteBall from './WhiteBall';
import { Link } from 'react-router-dom';

function CadastroForm() {
  const [loginData, setLoginData] = useState({ login: '', senha: '', confirmSenha: '', option: '' });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    console.log(loginData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', loginData);
    // Navigate to another page or perform any other actions

    fetch('http://localhost:3001/profile/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: loginData.login, password: loginData.senha, groups: [], profile_type: loginData.option})
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response
    })
    .catch(error => {

      console.log(error)
      console.error('There was a problem with your fetch operation:', error);
      // Handle error
    });
  };

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input 
          type="text" 
          id="login" 
          name="login" 
          placeholder="Login" 
          value={loginData.login} 
          onChange={handleInputChange} 
        />
      </div>

      <div className={styles.formGroup}>
        <input 
          type="password" 
          id="senha" 
          name="senha" 
          placeholder="Senha" 
          value={loginData.senha} 
          onChange={handleInputChange} 
        />
      </div>
      <div className={styles.formGroup}>
        <input 
          type="password" 
          id="confirmSenha" 
          name="confirmSenha" 
          placeholder="Confirmar Senha" 
          value={loginData.confirmSenha} 
          onChange={handleInputChange} 
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            className={`${styles.radioLabel} ${styles.checkboxLabel}`}
            type="radio"
            name="option"
            value="Professor"
            checked={loginData.option === 'Professor'}
            onChange={handleInputChange}
          />{' '}
          Professor
        </label>
        <label>
          <input
            className={`${styles.radioLabel} ${styles.checkboxLabel}`}
            type="radio"
            name="option"
            value="Aluno"
            checked={loginData.option === 'Aluno'}
            onChange={handleInputChange}
          />
          Aluno
        </label>
      </div>

      <button className={styles.button} type="submit">
        Cadastrar
      </button>
    </form>
  );
}

export default CadastroForm;
