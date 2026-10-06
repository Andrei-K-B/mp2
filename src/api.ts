import axios from "axios";

export interface Stat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: Stat[];
  image: string;
}

let cache: Pokemon[] | null = null;

export async function getAllPokemon(): Promise<Pokemon[]> {
  if (cache) {
    return cache;
  }
  const list = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
  const requests = list.data.results.map((p: { url: string }) => axios.get(p.url));
  const responses = await Promise.all(requests);

  const all: Pokemon[] = responses.map((r: any) => ({
    id: r.data.id,
    name: r.data.name,
    height: r.data.height,
    weight: r.data.weight,
    types: r.data.types.map((t: any) => t.type.name),
    abilities: r.data.abilities.map((a: any) => a.ability.name),
    stats: r.data.stats.map((s: any) => ({
      name: s.stat.name.replace("-", " "),
      value: s.base_stat,
    })),
    image: r.data.sprites.other["official-artwork"].front_default,
  }));

  cache = all;
  return all;
}