import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Troque useHistory por useNavigate
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
    // Handle form submission logic here
    console.log('Form submitted:', loginData);
    // Navigate to another page or perform any other actions

    fetch('http://localhost:3001/profile/validate', {
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
      localStorage.setItem('username', loginData.login);
      navigate('/Profile'); 
    })
    .catch(error => {
      console.log(error)
      console.error('There was a problem with your fetch operation:', error);
      alert('Usuário, senha ou tipo de usuário incorretos.');
    });
  };

  return (
    <form className={styles.body} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input type="text" id="login" name="login" placeholder="Login" onChange={handleInputChange} />
      </div>

      <div className={styles.formGroup}>
        <input type="password" id="senha" name="senha" placeholder="Senha" onChange={handleInputChange} />
      </div>

      <button className={styles.button} type="submit">
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
 