"use client";
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import Link from "next/link";
import { CharactersData } from "@/app/types/rickandmorty";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $name: String) {
    characters(page: $page, filter: { name: $name }) {
      info {
        pages
        next
        prev
      }
      results {
        id
        name
        status
        image
      }
    }
  }
`;

function CharacterList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    //
    const timer = setTimeout(() => {
      setSearchTerm(valor);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [valor]);

  const { loading, error, data } = useQuery<CharactersData>(GET_CHARACTERS, {
    variables: { page: page, name: searchTerm },
  });

  if (loading)
    return (
      <p className="text-white text-center mt-10 animate-pulse">
        Loading data form Dimension C-137...
      </p>
    );
  if (error) {
    if (error.message.includes("404")) {
      return (
        <div className="flex flex-col items-center justify-center mt-10 text-slate-400">
          <p className="text-2xl font-bold">Wubba Lubba Dub Dub!</p>
          <p>Nenhum personagem encontrado com o nome {valor}.</p>
        </div>
      );
    }

    return (
      <p className="text-red-500 text-center mt-10">Error: {error.message}</p>
    );
  }
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Digite seu personagem favorito"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="px-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {data.characters.results.map((char) => (
          <Link href={`/character/${char.id}`} key={char.id} className="group">
            <div className="bg-slate-800 p-4 rounded-lg text-white shadow-lg border border-slate-700 group-hover:border-blue-500 transition-colors cursor-pointer">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-xl font-bold truncate group-hover:text-blue-400 transition-colors">
                {char.name}
              </h2>
              <p
                className={`text-sm ${
                  char.status === "Alive" ? "text-green-400" : "text-red-400"
                }`}
              >
                {char.status}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 py-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition"
        >
          Previous
        </button>

        <span className="text-white font-mono">
          Page <span className="text-green-400 font-bold">{page}</span> of{" "}
          {data.characters.info.pages}
        </span>

        <button
          disabled={page === data.characters.info.pages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-400 my-8">
        Rick and Morty GraphQL
      </h1>

      <ApolloProvider client={client}>
        <CharacterList />
      </ApolloProvider>
    </main>
  );
}
