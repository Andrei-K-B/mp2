import { Routes, Route, Link } from "react-router-dom";
import ListView from "./ListView.tsx";
import GalleryView from "./GalleryView";
import DetailView from "./DetailView";
import styles from "./App.module.css";

function App() {
  return (
    <div>
      <div className={styles.nav}>
        <h1 className={styles.title}>Pokedex</h1>
        <Link className={styles.navLink} to="/">List</Link>
        <Link className={styles.navLink} to="/gallery">Gallery</Link>
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;