import view from './view.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends view {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'Could not find movies for your query!';
  _message = '';
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }
  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        result.id === id ? 'preview__link--active' : ''
      }" href="#${result.id}">
        <figure class="preview__fig">
          <img <img src="https://image.tmdb.org/t/p/w500/${
            result.path
          }"alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${result.title}</h4>
          <p class="preview__publisher">${result.genres.join(' ')}</p>
        </div>
      </a>
    </li>
    `;
  }
}
export default new ResultsView();
