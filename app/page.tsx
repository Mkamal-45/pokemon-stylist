"use client";

import React, {useState} from "react";

interface Pokemon{
  name: string;
  sprite: string;
  types: string[];
  id: number;
  color: string;
}

export default function Home(){
  const [query, setQuery]= useState("");
  const [currentPokemon, setCurrentPokemon]= useState<Pokemon | null>(null);
  const [team ,setTeam]= useState<Pokemon[]>([]);
  const [storeLinkInput, setStoreLinkInput]= useState("");
  const[storeLinks, setStoreLinks]=useState<string[]>([]);
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
      console.log("Fetching color data from pkmn species");
      const speciesResponse= await fetch(data.species.url);
      const speciesData= await speciesResponse.json();
      console.log("Color found:", speciesData.color.name);
      const pokemonData: Pokemon= {
        name: data.name,
        sprite: data.sprites.front_default,
        types: data.types.map((t: any)=> t.type.name),
        id: data.id,
        color: speciesData.color.name,
      };
      console.log("PKMN found:", pokemonData.name);
      console.log("PKMN color:", pokemonData.color);
      setCurrentPokemon(pokemonData);
    } catch(error){
      console.log("Error:", error);
      alert("Pokemon not found! No fakemon aloud.");
      setCurrentPokemon(null);
    }

  };

  const addToTeam=()=>{
    if(!currentPokemon){
      alert("Please choose a Pokemon first!");
      return;
    }
    if(team.length >=6){
      alert("Your party is full! You can only have 6 PKMN in your party");
      return;
    }
    const isDuplicate= team.some(p=> p.id=== currentPokemon.id);
    if (isDuplicate){
      alert(`${currentPokemon.name} is already in your team!`);
      return;
    }
    setTeam([...team, currentPokemon]);
    console.log("Added to your party:", currentPokemon.name);
    console.log("Current team:", team.length +1);
    setCurrentPokemon(null);
    setQuery("");
  };

  const removeFromTeam=(index: number)=>{
    const newTeam= team.filter((_, i)=> i !==index);
    console.log("Removed POkemon at:", index);
    setTeam(newTeam);
  };

  const addStoreLink=()=>{
    if (!storeLinkInput){
      alert("Please enter a link to your favorite store!");
      return;
    }
    if(!storeLinkInput.startsWith('http://')&& !storeLinkInput.startsWith('https://')){
      alert("Please enter a valid website url");
      return;
    }
    if (storeLinks.length>=5){
      alert("Currently we are limited to 5 stores!");
      return;
    }
    if(storeLinks.includes(storeLinkInput)){
      alert("You have already picked this store!");
      return;
    }

    setStoreLinks([...storeLinks, storeLinkInput]);
    console.log("Added store:", storeLinkInput);
    console.log("Total Stores:", storeLinks.length +1);

    setStoreLinkInput("");
  };
  
  const removeStoreLink= (index : number) =>{
    const newStoreLinks= storeLinks.filter((_, i)=> i !==index);
    console.log("Removing store at position:", index);
    console.log("Remaining Stores:", newStoreLinks.length);
    setStoreLinks(newStoreLinks);
  };

  return(
  <main className="min-h-screen bg-black text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-6xl font-extrabold italic text-center mb-2">
        POKEMON <span className="text-blue-500">STYLIST</span>
      </h1>
      <p className="text-gray-400 text-center mb-12 uppercase tracking-widest text-sm">
        Artificial Intelligence x Fantasy Fashion
      </p>
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Search Pokemon ({team.length}/6 in team)
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            placeholder="Enter Pokemon name..."
            className="flex-1 p-4 bg-transparent border-b-2 border-gray-700 focus:border-blue-500 oytline-none text-xl"/>
          <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold uppercase transition">
            Search
          </button>
        </form>
        {currentPokemon &&(
          <div className="border border-gray-700 p-6 rounded-lg mb-6 bg-gray-900">
            <div className="flex items-center gap-4">
              <img src={currentPokemon.sprite} alt={currentPokemon.name} className="w-24 h-24"/>
              <div>
                <h3 className="text-2xl font-bold capitalize">
                  {currentPokemon.name}
                </h3>
                <p className="text-gray-400">
                  Types: {currentPokemon.types.join(", ")}
                </p>
              <p className="text-gray-400">
                #{currentPokemon.id.toString().padStart(3, '0')}
              </p>
              <p className="text-gray-400">
                Color:<span className="capitalize font-semibold text-white">{currentPokemon.color}</span>
              </p>
              </div>
              <button onClick={addToTeam} disabled={team.length>=6}
                className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold rounded transition">
                  {team.length >=6? "Team Full": "Add to Team"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Your Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {team.map((pokemon, index)=>(
            <div key={index} className="border border-gray-700 p-4 rounded-lg">
              <button onClick={()=> removeFromTeam(index)}
                className="absolute top-2 right-2 bg-red hover:bg-red-700">
                  x
              </button>
              <img src={pokemon.sprite} alt={pokemon.name} className="w-full"/>
              <p className="text-center capitalize mt-2 text-sm">
                {pokemon.name}
              </p>
              <p className="text-center text-xs text-gray-400">
                {pokemon.types.join("/")}
              </p>
            </div>
          ))}
          {Array(6- team.length).fill(null).map((_, index)=>(
            <div key={`empty-${index}`}
                className="border-2 border-dasheed border-gray-700 flex items-center justify-center">
                  <p className="text-gray-600 text-sm">Empty Slot</p>
                </div>
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Your Favorite Fashion Outlet ({storeLinks.length}/5)
        </h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="url"
            value={storeLinkInput}
            onChange={(e)=> setStoreLinkInput(e.target.value)}
            placeholder="Paste store url!"
            className="flex p-4 bg-transparent border-b-2 border-gray-700 focus:border-blue-500 outline-none"/>
          <button 
            onClick={addStoreLink}
            type="button"
            disabled={storeLinks.length>=5}
            className="px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold transition">
            {storeLinks.length >=5 ? "Max Stores" : "Add Store"}
            </button>
        </div>
        {storeLinks.length >0 && (
          <div className="space-y-2">
            {storeLinks.map((link, index)=>(
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-900 p-3 rounded border border-gray-700">
                <span className="text-2xl">Store</span>
                <span className="flex-1 truncate text-gray-300">{link}</span>
                <button
                  onClick={()=> removeStoreLink(index)}
                  className="text-red-500 hover:text-red-400 px-3 py-1 hover:bg-red-900/20 rounded transition">
                  Remove
                </button>
              </div>
            ))}
        </div>
        )}

        {storeLinks.length===0 &&(
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-800 rounded-lg">
            <p className="text-lg mb-2">No stores added yet</p>
            <p className="text-sm">Add your favorite shopping websites to get personalized outfit recommendations</p>
          </div>
        )}
      </div>

      
    <div className="text-center text-gray-400 text-sm">
      <p className="font-bold text-white mb-2">Testing</p>
      </div>
    </div>
  </main>

  );
}

