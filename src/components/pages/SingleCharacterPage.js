import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../sspinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import AppBanner from "../appBanner/AppBanner";
import "./singleCharacterPage.scss";

const SingleCharacterPage = () => {
  const { charId } = useParams();
  const [char, setChar] = useState(null);
  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    setChar(null);
    clearError();
    getCharacter(charId).then(setChar);
  }, [charId]);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const isNotAvailable = thumbnail.includes("image_not_available");
  const image = isNotAvailable
    ? "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
    : thumbnail;

  return (
    <div className="single-character">
      <img src={image} alt={name} className="single-character__img" />
      <div className="single-character__info">
        <h2 className="single-character__name">{name}</h2>
        <p className="single-character__descr">{description}</p>
        <div className="single-character__links">
          <a href={homepage} className="button button__main">
            <div className="inner">Homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
        <h3 className="single-character__comics-title">Comics:</h3>
        {comics.length > 0 ? (
          <ul className="single-character__comics">
            {comics.slice(0, 10).map((comic, index) => (
              <li key={`${comic}-${index}`}>{comic}</li>
            ))}
          </ul>
        ) : (
          <p className="single-character__descr">
            There is no comics with this character
          </p>
        )}
      </div>
      <Link to="/" className="single-character__back">
        Back to all
      </Link>
    </div>
  );
};

export default SingleCharacterPage;
