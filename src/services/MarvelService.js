import { useCallback } from "react";
import { useHttp } from "../hooks/http.hook";
import avengersFallback from "../resources/img/Avengers.png";

const apiBase = "https://marvel-server-zeta.vercel.app/";
const apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
const baseOffset = 0;

const transformCharacter = (char) => {
  const thumbnail = `${char.thumbnail.path}.${char.thumbnail.extension}`;

  return {
    id: char.id,
    name: char.name,
    description: char.description
      ? `${char.description.slice(0, 210)}...`
      : "There is no description for this character",
    thumbnail: thumbnail.includes("images.hdqwalls.com")
      ? avengersFallback
      : thumbnail,
    homepage: char.urls[0].url,
    wiki: char.urls[1].url,
    comics: ((char.comics && char.comics.items) || []).map((item) =>
      typeof item === "string" ? item : item.name,
    ),
  };
};

const transformComics = (comics) => {
  return {
    id: comics.id,
    title: comics.title,
    description: comics.description || "There is no description",
    pageCount: comics.pageCount
      ? `${comics.pageCount} p.`
      : "No information about the number of pages",
    thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
    language:
      (comics.textObjects[0] && comics.textObjects[0].language) || "en-us",
    price: comics.prices[0].price
      ? `${comics.prices[0].price}$`
      : "not available",
  };
};

const useMarvelService = () => {
  const { request, clearError, process, setProcess } = useHttp();

  const getAllCharacters = useCallback(
    async (offset = baseOffset) => {
      const res = await request(
        `${apiBase}characters?limit=9&offset=${offset}&${apiKey}`,
      );
      return res.data.results.map(transformCharacter);
    },
    [request],
  );

  const getCharacterByName = useCallback(
    async (name) => {
      const res = await request(`${apiBase}characters?name=${name}&${apiKey}`);
      return res.data.results.map(transformCharacter);
    },
    [request],
  );

  const getCharacter = useCallback(
    async (id) => {
      const res = await request(`${apiBase}characters/${id}?${apiKey}`);
      return transformCharacter(res.data.results[0]);
    },
    [request],
  );

  const getAllComics = useCallback(
    async (offset = 0) => {
      const res = await request(
        `${apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${apiKey}`,
      );
      return res.data.results.map(transformComics);
    },
    [request],
  );

  const getComic = useCallback(
    async (id) => {
      const res = await request(`${apiBase}comics/${id}?${apiKey}`);
      return transformComics(res.data.results[0]);
    },
    [request],
  );

  return {
    process,
    setProcess,
    clearError,
    getAllCharacters,
    getCharacterByName,
    getCharacter,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
