"use client";

import { gql } from "@apollo/client";
import { useQuery, ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GetCharacterResponse } from "@/app/types/rickandmorty";

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      location {
        name
      }
      origin {
        name
      }
      episode {
        id
        name
        episode
      }
    }
  }
`;

function CharacterDetail() {
  const params = useParams();
  const id = params.id;

  const { loading, error, data } = useQuery<GetCharacterResponse>(
    GET_CHARACTER,
    {
      variables: { id },
    }
  );

  if (loading)
    return (
      <div className="text-white text-center mt-20 text-2xl animate-pulse">
        Loading info...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center mt-20">
        Error: {error.message}
      </div>
    );

  if (!data) return null;

  const char = data.character;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white">
      <Link
        href="/"
        className="mb-8 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
      >
        ← Voltar para a Lista
      </Link>

      <div className="max-w-4xl w-full bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <img
            src={char.image}
            alt={char.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detalhes */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold text-blue-400">{char.name}</h1>

          <div className="space-y-2 text-lg text-slate-300">
            <p>
              <strong className="text-white">Status:</strong> {char.status}
            </p>
            <p>
              <strong className="text-white">Species:</strong> {char.species}
            </p>
            <p>
              <strong className="text-white">Gender:</strong> {char.gender}
            </p>
            <p>
              <strong className="text-white">Origin:</strong> {char.origin.name}
            </p>
            <p>
              <strong className="text-white">Location:</strong>{" "}
              {char.location.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharacterPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <ApolloProvider client={client}>
        <CharacterDetail />
      </ApolloProvider>
    </main>
  );
}
