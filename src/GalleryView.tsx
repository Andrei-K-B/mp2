import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPokemon, type Pokemon } from "./api";
import styles from "./App.module.css";

const allTypes = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "steel", "fairy",
];

function GalleryView() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPokemon()
      .then((data) => setPokemon(data))
      .catch(() => setError("Could not load pokemon. Try again later."));
  }, []);

  function toggleType(type: string) {
    if (selected.includes(type)) {
      setSelected(selected.filter((t) => t !== type));
    } else {
      setSelected([...selected, type]);
    }
  }

  const shown = pokemon.filter((p) => {
    return selected.every((t) => p.types.includes(t));
  });

  return (
    <div className={styles.galleryPage}>
      <div className={styles.filters}>
        <button
          className={selected.length === 0 ? styles.filterButton + " " + styles.filterOn : styles.filterButton}
          onClick={() => setSelected([])}
        >
          All
        </button>
        {allTypes.map((type) => (
          <button
            key={type}
            className={selected.includes(type) ? styles.filterButton + " " + styles.filterOn : styles.filterButton}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!error && pokemon.length === 0 && <p>Loading...</p>}
      {!error && pokemon.length > 0 && shown.length === 0 && <p>No pokemon have all of those types.</p>}

      <div className={styles.gallery}>
        {shown.map((p) => (
          <Link className={styles.card} key={p.id} to={"/pokemon/" + p.id}>
            <img className={styles.cardImage} src={p.image} alt={p.name} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GalleryView;