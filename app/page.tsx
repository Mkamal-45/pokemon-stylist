"use client";

import React, {useState} from "react";

interface Pokemon{
  name: string;
  sprite: string;
  types: string[];
  id: number;
}

export default function Home(){
  const [query, setQuery]= useState("");
  const [pokemon, setPokemon]= useState<Pokemon | null>(null);
  const handleSearch= async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting API call for:", query);

    try{
      const response= await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      console.log("Response received:", response.ok);
      if (!response.ok){
        throw new Error("PKMN not found");
      }
      const data= await response.json();
      console.log("Data received:", data);
      const pokemonData: Pokemon= {
        name: data.name,
        sprite: data.sprites.front_default,
        types: data.types.map((t: any)=> t.type.name),
        id: data.id,
      };
      console.log("PKMN data extracted:", pokemonData);
      setPokemon(pokemonData);
      alert(`Found ${data.name}! Check console for all the details.`);
    } catch(error){
      console.log("Error:", error);
      alert("Pokemon not found! No fakemon aloud.");
      setPokemon(null);
    }

  };

  return(
  <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
    <h1 className="text-5xl font-extrabold tracking-tighter mb-4 italic">
      POKEMON<span className="text-blue-500"></span>
    </h1>
    <p className="text-gray-400 mb-10 uppercase tracking-widest text-sm">
      Artificial Intelligence x Fantasy Fashion
    </p>
    <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Pokemon Name:  "
            className="flex-1 p-4 bg-transparent border-b-2 border-gray-700 focus:border-blue-500 outline-none text-xl transition-all"/>

      <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold uppercase">
        Analyze
      </button>
    </form>
    {pokemon &&(
      <div className="border-2 border-blue-500 rounded-lg p-8 bg-gray-900 max-w-md w-full">
        <div className="flex flex-col items-center">
          <img src={pokemon.sprite} alt={pokemon.name} className="w-48 h-48"/>
          <h2 className="text-3xl font-bold capitalize mt-4">
            {pokemon.name}
          </h2>
          <p className="text-gray-400 text-lg">
            #{pokemon.id.toString().padStart(3, '0')}
          </p>
          <div className="flex gap-2 mt-4">
            {pokemon.types.map((type, index)=>(
              <span key={index} className="px-4 py-2 bg-blue-600 rounded-full capitalize font-semibold">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
    <div className="mt-8 text center text-gray-400">
      <p className="font-bold text-white mb-2">Testing</p>
      <p>Page Inspect</p>
      <p>Test with valid and fakemons</p>
      <p></p>
    </div>
  </main>

  );
}

