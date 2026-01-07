// Tipos para a resposta da query de personagens

type Info = {
  pages: number;
  next: number | null;
  prev: number | null;
};

type Character = {
  id: string;
  name: string;
  status: string;
  image: string;
};

export type CharactersData = {
  characters: {
    info: Info;
    results: Character[];
  };
};

// Novo tipo para o detalhe do personagem

type CharacterDetails = {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  location: {
    name: string;
  };
  origin: {
    name: string;
  };
  episode: Array<{
    id: string;
    name: string;
    episode: string;
  }>;
};

export type GetCharacterResponse = {
  character: CharacterDetails;
};
