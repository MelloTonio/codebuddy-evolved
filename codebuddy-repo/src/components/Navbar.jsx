import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [loggedin, setloggedin] = useState(false);
  const [NomePessoa, setNomePessoa] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const profileName = localStorage.getItem("data");
        if (profileName) {
          const parsedProfile = JSON.parse(profileName);
          setNomePessoa(parsedProfile.username);

          if (parsedProfile.username) {
            setloggedin(true);
          }
        }
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchHistorico();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("data");
    localStorage.removeItem("token");
    setloggedin(false);
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <h2 className={styles.right}>
          <Link to="/">CodeBuddy</Link>
        </h2>
      </div>
      <div className={styles.right}>
        {!loggedin ? (
          <>
            <Link className={styles.button} to="/login">Login</Link>
            <Link className={styles.button} to="/register">Registrar</Link>
          </>
        ) : (
          <>
            <Link className={styles.button} to="/profile">Profile</Link> 
            <button className={styles.button} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
