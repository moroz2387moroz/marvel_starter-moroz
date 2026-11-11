import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../sspinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ Component, dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const { loading, error, getComic, getCharacter, clearError } =
    useMarvelService();

  useEffect(() => {
    let cancelled = false;
    const handleRequest = (request) => {
      request.then(
        (result) => {
          if (!cancelled) {
            setData(result);
          }
        },
        () => {
          if (!cancelled) {
            setLoadError(true);
          }
        },
      );
    };

    setData(null);
    setLoadError(false);
    clearError();

    switch (dataType) {
      case "comic":
        handleRequest(getComic(id));
        break;
      case "character":
        handleRequest(getCharacter(id));
        break;
      default:
        break;
    }

    return () => {
      cancelled = true;
    };
  }, [id, dataType, clearError, getComic, getCharacter]);

  const errorMessage = error || loadError ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || loadError || !data) ? (
    <Component data={data} />
  ) : null;
  const pageType = dataType === "comic" ? "Comic" : "Character";
  const pageName = dataType === "comic" ? data?.title : data?.name;
  const title = pageName
    ? `${pageName} | Marvel Information Portal`
    : `${pageType} | Marvel Information Portal`;
  const description = data?.description || `Explore Marvel ${pageType.toLowerCase()} details.`;

  return (
    <>
      <Helmet>
        <meta name="description" content={description} />
        <title>{title}</title>
      </Helmet>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

export default SinglePage;
