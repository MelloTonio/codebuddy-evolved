import React, { useEffect, useState } from "react";
import ContainerP from "../../components/container/ContainerM";
import styles from "./Profile.module.css";
import { useNavigate } from 'react-router-dom'; // Troque useHistory por useNavigate
import WhiteBall from "../../components/form/WhiteBall";
import CryptoJS from 'crypto-js';
import Navbar from '../../components/Navbar';
import TextContainer from "../../components/container/TextContainer";
import BotaoGrupo from "./botao/BotaoGrupo";
import BotaoCriarGrupo from "../CriarGrupo/botao/BotaoCriarGrupo";
import Footer from "../../components/Footer";

const Profile = () => {
  const [alunos, setAlunos] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate inside the component

  const base64UrlDecode = (str) => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      console.error('Failed to decode base64 URL:', e);
      return null;
    }
  };


  const sha256 = (message, secretKey) => {
    return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Base64);
  };

  const verifyToken = (token, secretKey) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      throw new Error('Invalid token format');
    }

    const [headerB64, payloadB64, signature] = parts;
    let header, payload;

    try {
      header = JSON.parse(atob(headerB64));
      payload = JSON.parse(atob(payloadB64));
    } catch (e) {
      console.error('Failed to parse token:', e);
      throw new Error('Invalid token');
    }

    // Step 1: Verify the signature
    const message = `${headerB64}.${payloadB64}`;
    const computedSignature = sha256(message, secretKey).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    if (computedSignature !== signature) {
      console.error('Invalid token signature');
      throw new Error('Invalid signature');
    }

    // Step 2: Validate payload (e.g., expiration)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.error('Token has expired');
      throw new Error('Token has expired');
    }

    const decodedData = base64UrlDecode(payloadB64);
    if (decodedData) {
      localStorage.setItem("data", decodedData);
    } else {
      throw new Error('Failed to decode token');
    }

    return payload;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      console.error('No token found');
      return;
    }

    try {
      verifyToken(token, "beniciogay");
    } catch (error) {
      navigate('/login');
      return;
    }

    const storedUsername = localStorage.getItem('data');
    if (storedUsername) {
      setUsername(JSON.parse(storedUsername).username)
      fetch(`http://localhost:3001/profile?username=${JSON.parse(storedUsername).username}`)
        .then(response => response.json())
        .then(data => {
          setAlunos(data);
          console.log(data);
          setLoading(false); // Data fetching is complete
        })
        .catch(error => {
          console.error('Error fetching students:', error);
          setLoading(false); // Even if there's an error, stop the loading state
        });
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching data
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.infosContainer}>
        <WhiteBall className={styles.whiteBall} />
        <ContainerP backgroundColor="orange" className={styles.container}>
          <div className={styles.textContainer}>
            {username && (
              <>
                <div>
                  <TextContainer texto={`Nome: ${username}`} />
                </div>
                <div>
                  <TextContainer texto={`Grupos: ${alunos.groups.length}`} />
                </div>
              </>
            )}
          </div>
        </ContainerP>
      </div>
      <div className={styles.botaoGrupo}>
        {username && alunos.profile_type === 'Professor' ? (
          <>
            <BotaoGrupo />
            <div className={styles.criarGrupoContainer}>
              <BotaoCriarGrupo />
              <div className={styles.texto}>Criar Grupo</div>
            </div>
          </>
        ) : (
          username && alunos.groups.length > 0 ? (
            <BotaoGrupo />
          ) : (
            <div className={styles.texto}>Você não está em nenhum grupo ainda :(</div>
          )
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
