import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllPokemon, type Pokemon } from "./api";
import styles from "./App.module.css";

function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [error, setError] = useState("");
  const [entry, setEntry] = useState("");
  const [genus, setGenus] = useState("");

  useEffect(() => {
    getAllPokemon()
      .then((data) => setPokemon(data))
      .catch(() => setError("Could not load pokemon. Try again later."));
  }, []);

  useEffect(() => {
    setEntry("");
    setGenus("");
    axios
      .get("https://pokeapi.co/api/v2/pokemon-species/" + id)
      .then((res) => {
        const entries = res.data.flavor_text_entries.filter(
          (e: any) => e.language.name === "en"
        );
        let found = entries.find((e: any) => e.version.name === "yellow");
        if (!found) {
          found = entries[0];
        }
        if (found) {
          setEntry(found.flavor_text.replace(/[\n\f]/g, " "));
        }
        const g = res.data.genera.find((x: any) => x.language.name === "en");
        if (g) {
          setGenus(g.genus);
        }
      })
      .catch(() => setEntry("Could not load the pokedex entry."));
  }, [id]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }
  if (pokemon.length === 0) {
    return <p>Loading...</p>;
  }

  const index = pokemon.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return <p>Pokemon not found.</p>;
  }

  const current = pokemon[index];
  const prev = pokemon[(index - 1 + pokemon.length) % pokemon.length];
  const next = pokemon[(index + 1) % pokemon.length];

  return (
    <div className={styles.detail}>
      <button className={styles.button} onClick={() => navigate("/pokemon/" + prev.id)}>
        &larr; Previous
      </button>
      <button className={styles.button} onClick={() => navigate("/pokemon/" + next.id)}>
        Next &rarr;
      </button>
      <h2>
        #{current.id} {current.name}
      </h2>
      <img className={styles.detailImage} src={current.image} alt={current.name} />
      <p className={styles.genus}>{genus}</p>

      <p className={styles.entry}>{entry || "Loading pokedex entry..."}</p>

      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Height</th>
            <td>{current.height / 10} m</td>
          </tr>
          <tr>
            <th>Weight</th>
            <td>{current.weight / 10} kg</td>
          </tr>
          <tr>
            <th>Type(s)</th>
            <td>
              {current.types.map((t) => (
                <span className={styles.typeBadge + " " + styles[t]} key={t}>
                  {t}
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <th>Abilities</th>
            <td>{current.abilities.join(", ")}</td>
          </tr>
        </tbody>
      </table>

      <h3>Base Stats</h3>
      <table className={styles.table}>
        <tbody>
          {current.stats.map((s) => (
            <tr key={s.name}>
              <th>{s.name}</th>
              <td>{s.value}</td>
              <td>
                <progress value={s.value} max={255}></progress>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailView;