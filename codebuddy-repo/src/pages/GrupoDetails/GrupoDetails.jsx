import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarGrupo from "./componentsGrupo/NavbarGrupo";
import ContainerG from "../../components/container/ContainerG";
import styles from "./GrupoDetails.module.css";
import Posts from "./posts/Posts";
import PopupComponent from "./componentsGrupo/PopupComponent";
import { usePosts } from "./posts/PostsProvider";
import Footer from "../../components/Footer";

const GrupoDetails = () => {
  const { nome } = useParams();
  const { posts, setPosts } = usePosts();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/studygroup/warnings/${nome}`);
      const postData = await response.json();
      setPosts(postData);
      console.log(postData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [nome, setPosts]);

  const handleCreatePost = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    fetchPosts(); // Refresh posts after closing the popup
  };

  return (
    <div>
      <Navbar />
      <ContainerG style={{ backgroundColor: "#4565B7" }}>
        <NavbarGrupo />
        <div className={styles.postsContainer}>
          <div className={styles.postsWrapper}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Posts key={post.id} groupName={nome} text={post.warning_text} />
              ))
            ) : (
              <div className={styles.noPosts}>Nenhum aviso ainda...</div>
            )}
          </div>
        </div>
        <div className={styles.botaoCriarPostIntegrated} onClick={handleCreatePost}>
          <div className={styles.text}>+</div>
        </div>
        {isPopupOpen && (
          <div className={styles.popupOverlay}>
            <PopupComponent onClose={handleClosePopup} nome={nome} />
          </div>
        )}
        <div className={styles.bottomImagesContainer}>
          {/* <img src={nextright} alt="nextright" className={`${styles.bottomImage} ${styles.inverted}`} />
          <img src={nextleft} alt="nextleft" className={styles.bottomImage} /> */}
        </div>
      </ContainerG>
      <Footer />
    </div>
  );
};

export default GrupoDetails;