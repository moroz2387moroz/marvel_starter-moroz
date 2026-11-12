import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";

import "./charInfo.scss";

const notAvailableImg =
  "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { getCharacter, clearError, process, setProcess } = useMarvelService();

  useEffect(() => {
    if (!props.charId) {
      return;
    }

    clearError();

    getCharacter(props.charId)
      .then(setChar)
      .then(() => setProcess("confirmed"));
  }, [props.charId, clearError, getCharacter]);

  return <div className="char__info">{setContent(process, View, char)}</div>;
};

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data;

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
    <>
      <div className="char__basics">
        <img
          src={isNotAvailable ? notAvailableImg : thumbnail}
          alt={name}
          style={imgStyle}
          onError={handleImgError}
        />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? (
          comics.slice(0, 10).map((comic, i) => (
            <li key={`${comic}-${i}`} className="char__comics-item">
              {comic}
            </li>
          ))
        ) : (
          <li className="char__comics-item">
            There is no comics with this character
          </li>
        )}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
