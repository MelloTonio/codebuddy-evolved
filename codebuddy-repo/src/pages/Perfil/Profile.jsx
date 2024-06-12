import React, { useEffect, useState } from "react";
import ContainerP from "../../components/container/ContainerM";
import styles from "./Profile.module.css";
import WhiteBall from "../../components/form/WhiteBall";
import Navbar from '../../components/Navbar';
import TextContainer from "../../components/container/TextContainer";
import BotaoGrupo from "./botao/BotaoGrupo";
import BotaoCriarGrupo from "../CriarGrupo/botao/BotaoCriarGrupo";
import Footer from "../../components/Footer"

const Profile = () => {
  const [alunos, setAlunos] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      fetch(`http://localhost:3001/profile?username=${storedUsername}`)
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
  }, []);

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
     <div className={styles.texto}>Criar Grupo </div>
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
