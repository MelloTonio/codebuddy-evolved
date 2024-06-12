import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom'; 
import styles from "./Grupos.module.css";
import CryptoJS from 'crypto-js';
import TextContainer from "../../components/container/TextContainer";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const Grupos = () => {
  const [aluno, setAluno] = useState(null);
  const navigate = useNavigate(); // Use useNavigate at the top level of the component

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
    const fetchDesafios = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }
  
      try {
        verifyToken(token, "beniciogay");
      } catch (error) {
        console.error(error.message);
        navigate('/login');
        return;
      }

      try {
        const storedUsername = localStorage.getItem('data');
        console.log(storedUsername)
        const responseGrupos = await fetch(`http://localhost:3001/studygroup/students?studyGroup=${JSON.parse(storedUsername).username}`);
        const dataGrupos = await responseGrupos.json();
        setAluno(dataGrupos);
        console.log(dataGrupos);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchDesafios();
  }, [navigate]);

  const renderGroups = () => {
    if (aluno && aluno.length > 0) {
      return (
        <div className={styles.groupsGrid}>
          {aluno.map((grupo, index) => (
            <div key={index} className={styles.groupContainer}>
              <Link key={index} to={`/Grupo/${encodeURIComponent(grupo.name)}`}>
                <TextContainer texto={`${grupo.name}`} />
              </Link>
            </div>
          ))}
        </div>
      );
    } else {
      return <div>No groups available.</div>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.titulo}>
        <h4>Grupos</h4>
        <input
          type="text"
          className={styles.buscarGrupo}
          placeholder="Buscar Grupo"
        />
      </div>
      <div>
        {console.log('Rendering Grupos component')}
        {aluno && aluno.length ? (
          <div>
            {renderGroups()}
          </div>
        ) : (
        <div>
          <p className={styles.noGroupsText}>Sem grupos disponíveis :(</p>
          <p className={styles.noGroupsText}>Experimente criar um novo grupo !!!</p>
        </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Grupos;
