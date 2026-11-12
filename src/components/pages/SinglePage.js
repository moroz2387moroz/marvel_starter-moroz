import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ Component, dataType }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const { getComic, getCharacter, clearError, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    let cancelled = false;
    const handleRequest = (request) => {
      request.then(
        (result) => {
          if (!cancelled) {
            setData(result);
            setProcess("confirmed");
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
  }, [id, dataType, clearError, getComic, getCharacter, setProcess]);

  const content = setContent(loadError ? "error" : process, Component, data);
  const pageType = dataType === "comic" ? "Comic" : "Character";
  const pageName = dataType === "comic" ? data?.title : data?.name;
  const title = pageName
    ? `${pageName} | Marvel Information Portal`
    : `${pageType} | Marvel Information Portal`;
  const description =
    data?.description || `Explore Marvel ${pageType.toLowerCase()} details.`;

  return (
    <>
      <Helmet>
        <meta name="description" content={description} />
        <title>{title}</title>
      </Helmet>
      <AppBanner />
      {content}
    </>
  );
};

export default SinglePage;
