import { createRef, useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Spinner from "../sspinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import useMarvelService from "../../services/MarvelService";

import "./charList.scss";

const notAvailableImg =
  "https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

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

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setnewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charEnded, setCharEnded] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  const onRequest = useCallback(
    (offset, initial) => {
      initial ? setnewItemLoading(false) : setnewItemLoading(true);
      getAllCharacters(offset)
        .then((newCharList) => {
          setCharList((currentList) => [...currentList, ...newCharList]);
          setnewItemLoading(false);
          setOffset(offset + 9);
          setCharEnded(newCharList.length < 9);
        })
        .then(() => setProcess("confirmed"));
    },
    [getAllCharacters],
  );

  useEffect(() => {
    onRequest(0, true);
  }, [onRequest]);

  const itemRefs = useRef(new Map());

  const focusOnItem = (id) => {
    itemRefs.current.forEach((itemRef) =>
      itemRef.current?.classList.remove("char__item_selected"),
    );
    const selectedItem = itemRefs.current.get(id)?.current;
    if (selectedItem) {
      selectedItem.classList.add("char__item_selected");
      selectedItem.focus();
    }
  };

  const handleImgError = (e) => {
    const img = e.currentTarget;
    if (img.src === notAvailableImg) {
      img.onerror = null;
      return;
    }

    img.src = notAvailableImg;
    img.style.objectFit = "unset";
  };

  function renderItems(arr) {
    const items = arr.map((item, index) => {
      const nodeRef = itemRefs.current.get(item.id) || createRef();
      itemRefs.current.set(item.id, nodeRef);
      const isNotAvailable = item.thumbnail?.includes("image_not_available");
      const imgStyle = { objectFit: isNotAvailable ? "unset" : "cover" };
      const itemStyle = {
        "--char-enter-delay": `${(index % 9) * 55}ms`,
      };

      return (
        <CSSTransition
          key={item.id}
          nodeRef={nodeRef}
          timeout={1100}
          classNames="char__item"
        >
          <li
            className="char__item"
            style={itemStyle}
            tabIndex={0}
            ref={nodeRef}
            onClick={() => {
              props.onCharSelected(item.id);
              focusOnItem(item.id);
            }}
            onKeyPress={(e) => {
              if (e.key === " " || e.key === "Enter") {
                props.onCharSelected(item.id);
                focusOnItem(item.id);
              }
            }}
          >
            <img
              src={isNotAvailable ? notAvailableImg : item.thumbnail}
              alt={item.name}
              style={imgStyle}
              onError={handleImgError}
            />
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      );
    });

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  }

  return (
    <div className="char__list">
      {setContent(process, renderItems(charList), newItemLoading)}
      <button
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        className="button button__main button__long"
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
