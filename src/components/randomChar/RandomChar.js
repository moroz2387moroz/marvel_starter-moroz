import { useState, useEffect, useCallback } from "react";
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

const notAvailableImg =
  "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

const RandomChar = () => {
  const [char, setChar] = useState(null);
  const { getCharacter, clearError, process, setProcess } = useMarvelService();

  const updateChar = useCallback(() => {
    clearError();
    const id = Math.floor(Math.random() * (20 - 1) + 1);
    getCharacter(id)
      .then(setChar)
      .then(() => setProcess("confirmed"));
  }, [clearError, getCharacter]);

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [updateChar]);

  return (
    <div className="randomchar">
      {setContent(process, View, char)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button onClick={updateChar} className="button button__main">
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki } = data;
  const isNotAvailable = thumbnail?.includes("image_not_available");
  const imgStyle = { objectFit: isNotAvailable ? "unset" : "cover" };

  const handleImgError = (e) => {
    const img = e.currentTarget;
    if (img.src === notAvailableImg) {
      img.onerror = null;
      return;
    }

    img.src = notAvailableImg;
    img.style.objectFit = "unset";
  };

  return (
    <div className="randomchar__block">
      <img
        src={isNotAvailable ? notAvailableImg : thumbnail}
        alt="Random character"
        className="randomchar__img"
        style={imgStyle}
        onError={handleImgError}
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
