import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CadastroForm.module.css';

function CadastroForm() {
  const [loginData, setLoginData] = useState({ login: '', senha: '', confirmSenha: '', option: '' });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    console.log(loginData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted:', loginData);

    try {
      const response = await fetch('http://localhost:3001/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: loginData.login, password: loginData.senha, groups: [], profile_type: loginData.option })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/login');
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      alert('Erro ao criar usuário.');
    }
  };

  return (
    <div className={styles.formContainer}>
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

        <div className={`${styles.formGroup} ${styles.radioGroup}`}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="option"
              value="Professor"
              checked={loginData.option === 'Professor'}
              onChange={handleInputChange}
            />
            Professor
          </label>
          <label className={styles.radioLabel2}>
            <input
              type="radio"
              name="option"
              value="Aluno"
              checked={loginData.option === 'Aluno'}
              onChange={handleInputChange}
            />
            Aluno
          </label>
          <button className={styles.button} type="submit">
          Cadastrar
        </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroForm;