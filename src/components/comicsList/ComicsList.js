import { createRef, useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../sspinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const setContent = (process, content, newItemLoading) => {
  let status = null;

  switch (process) {
    case "waiting":
      status = <Spinner />;
      break;
    case "loading":
      status = newItemLoading ? null : <Spinner />;
      break;
    case "confirmed":
      break;
    case "error":
      status = <ErrorMessage />;
      break;
    default:
      throw new Error("Unexpected process state");
  }

  return (
    <>
      {status}
      {content}
    </>
  );
};

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setnewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);
  const itemRefs = useRef(new Map());

  const { getAllComics, process, setProcess } = useMarvelService();

  const onRequest = useCallback(
    (offset, initial) => {
      initial ? setnewItemLoading(false) : setnewItemLoading(true);
      getAllComics(offset)
        .then((newComicsList) => {
          setComicsList((currentList) => [...currentList, ...newComicsList]);
          setnewItemLoading(false);
          setOffset(offset + 8);
          setComicsEnded(newComicsList.length < 8);
        })
        .then(() => setProcess("confirmed"));
    },
    [getAllComics, setProcess],
  );

  useEffect(() => {
    onRequest(0, true);
  }, [onRequest]);

  function renderItems(arr) {
    const items = arr.map((item, index) => {
      const nodeRef = itemRefs.current.get(item.id) || createRef();
      itemRefs.current.set(item.id, nodeRef);

      return (
        <CSSTransition
          key={item.id}
          nodeRef={nodeRef}
          timeout={1100}
          classNames="comics__item"
        >
          <li
            className="comics__item"
            style={{ "--comic-enter-delay": `${(index % 8) * 55}ms` }}
            ref={nodeRef}
          >
            <Link to={`/comics/${item.id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="comics__item-img"
              />
              <div className="comics__item-name">{item.title}</div>
              <div className="comics__item-price">{item.price}</div>
            </Link>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  return (
    <div className="comics__list">
      {setContent(process, renderItems(comicsList), newItemLoading)}
      <button
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        className="button button__main button__long"
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
