import { Component } from "react";
import Spinner from "../sspinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";

const notAvailableImg =
  "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  }

  onCharListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  handleImgError = (e) => {
    e.target.src = notAvailableImg;
    e.target.style.objectFit = "unset";
  };

  renderItems(arr) {
    const items = arr.map((item) => {
      const isNotAvailable = item.thumbnail?.includes("image_not_available");
      const imgStyle = { objectFit: isNotAvailable ? "unset" : "cover" };

      return (
        <li
          className="char__item"
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
        >
          <img
            src={item.thumbnail}
            alt={item.name}
            style={imgStyle}
            onError={this.handleImgError}
          />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error } = this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
