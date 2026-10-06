import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPokemon, type Pokemon } from "./api";
import styles from "./App.module.css";

function ListView() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [error, setError] = useState("");

  useEffect(() => {
    getAllPokemon()
      .then((data) => setPokemon(data))
      .catch(() => setError("Could not load pokemon. Try again later."));
  }, []);

  const shown = pokemon
    .filter((p) => p.name.includes(search.toLowerCase()))
    .sort((a, b) => {
      let result = 0;
      if (sortBy === "name") {
        result = a.name.localeCompare(b.name);
      } else if (sortBy === "height") {
        result = a.height - b.height;
      } else if (sortBy === "weight") {
        result = a.weight - b.weight;
      } else {
        result = a.id - b.id;
      }
      return order === "asc" ? result : -result;
    });

  return (
    <div className={styles.listPage}>
      <div className={styles.controls}>
        <input
          className={styles.searchBox}
          type="text"
          placeholder="Search pokemon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">Sort by Number</option>
          <option value="name">Sort by Name</option>
          <option value="height">Sort by Height</option>
          <option value="weight">Sort by Weight</option>
        </select>
        <select className={styles.select} value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!error && pokemon.length === 0 && <p>Loading...</p>}

      <div>
        {shown.map((p) => (
          <Link className={styles.listItem} key={p.id} to={"/pokemon/" + p.id}>
            <img className={styles.listImage} src={p.image} alt={p.name} />
            <div>
              <div className={styles.listName}>{p.name}</div>
              <div className={styles.listInfo}>
                #{p.id} | height: {p.height}, weight: {p.weight}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ListView;