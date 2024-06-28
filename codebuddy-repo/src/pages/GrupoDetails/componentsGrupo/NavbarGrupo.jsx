import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./NavbarGrupo.module.css";
import backarrow from "../../../img/backarrow.png";

const NavbarGrupo = () => {
  const { nome } = useParams();
  const [alumniType, setalumniType] = useState("");

  useEffect(() => {
    setalumniType(JSON.parse(localStorage.getItem("data")).profile_type)
    console.log(alumniType)
  }, [alumniType],);


  return (
    <div className={styles.navbarGrupo}>
      <div className={styles.title}>{nome}</div>
      <Link to={`/Desafios/${encodeURIComponent(nome)}`}>
        <div className={styles.text}>Desafios</div>
      </Link>
      {alumniType == "Professor" ?(<Link to={`/listaAlunos/${encodeURIComponent(nome)}`}>
        <div className={styles.text}>Participantes</div>
      </Link>) : <div>   </div>}
      
      <div className={styles.img}>
        <Link to="/profile" className={styles.link}>
          <img src={backarrow} alt="Back Arrow" />
        </Link>
      </div>
    </div>
  );
};

export default NavbarGrupo;