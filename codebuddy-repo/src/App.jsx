import React from "react";
import { Link } from "react-router-dom";
import './App.css';
import pc_main from "/pc_main.png";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import styles from "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div className='content'>
        <div className='text-container'>
          <h1>Comece uma nova jornada de estudos</h1>
          <Link to="/Register">
            <button className='button'>Cadastro</button>
          </Link>
        </div>
        <div className='image-pc'>
          <img className={styles.img} src={pc_main} alt="CodeBoddy logo" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
