import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [loginData, setLoginData] = useState({ login: '', senha: '', option: '' });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted:', loginData);

    try {
      const response = await fetch('http://localhost:3001/profile/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: loginData.login, password: loginData.senha, groups: [], profile_type: loginData.option })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      localStorage.setItem('token', data);
      navigate('/Profile');
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      alert('Usuário, senha ou tipo de usuário incorretos.');
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.body} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="login"></label>
          <input className={styles.input} type="text" id="login" name="login" placeholder="Login" onChange={handleInputChange} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="senha"></label>
          <input type="password" id="senha" name="senha" placeholder="Senha" onChange={handleInputChange} />
        </div>

        <button className={styles.button} type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;