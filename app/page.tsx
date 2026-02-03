"use client";

import React, {useState} from "react";

export default function Home(){
  const [query, setQuery]= useState("");
  const handleSearch= async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Starting API call for:", query);
    try{
      const response= await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );
      console.log("2. Response received:",  response);
      console.log("3. Response ok?", response.ok);
      const data= await response.json();
      console.log("4. Data received:", data);
      console.log("5. Pokemon name:", data.name);
      console.log("6. Pokemon sprite:", data.sprites.front_default);
      console.log("7. Pokemon types:", data.types.map((t:any)=> t.type.name));
      console.log("8. Pokemon ID:", data.id);
      alert(`Found ${data.name}! Check console for all the details.`);
    } catch(error){
      console.log("Error:", error);
      alert("Pokemon not found! No fakemon aloud.");
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
    <div className="mt-8 text center text-gray-400">
      <p className="font-bold text-white mb-2">Testing</p>
      <p>Page Inspect</p>
      <p>Test with valid and fakemons</p>
    </div>
  </main>

  );
}

