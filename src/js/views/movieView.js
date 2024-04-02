//import icons from '../img/icons.svg'; //parcel1
import icons from 'url:../../img/icons.svg'; //parcel2
import view from './view.js';
class MovieView extends view {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'Could not find movie with that id';
  _message = '';
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return `
          <figure class="recipe__fig">
            <img src="https://image.tmdb.org/t/p/w500/${
              this._data.path
            }" alt="${this._data.title}" class="recipe__img" />
            <h1 class="recipe__title">
              <span>${this._data.title}</span>
            </h1>
          </figure>

          <div class="recipe__details">
            <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--minutes">${
                this._data.runtime
              }</span>
              <span class="recipe__info-text">minutes</span>
            </div>

              <div class="recipe__info">
              <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
              </svg>
              <span class="recipe__info-data recipe__info-data--people"><p>Directors:</p>${this._data.directors.join(
                ',<p></p> '
              )}</span>
            </div>


            
            <div class="recipe__info">
             
              <span class="recipe__info-data recipe__info-data--people"><p>Release Date</p>${
                this._data.releaseDate
              }</span>
            </div>

            
            <button class="btn--round btn--bookmark">
              <svg class="">
                <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
            </button>
          </div>

          <div class="recipe__ingredients">
            <h2 class="heading--2">Genres</h2>
            <ul class="recipe__ingredient-list">
              ${this.generateGenres(this._data.genres)}
            </ul>
          </div>
    
          <div class="recipe__directions">
          <h1 class="heading--1">${this._data.tagline}</h1> 
           <h2 class="heading--2">Plot</h2> 
            <p class="recipe__directions-text">${this._data.overview}
             
            </p>
           ${
             this._data.homepage
               ? this.generateHomePage(this._data.homepage)
               : ''
           }

          </div>`;
  }

  generateHomePage = function (page) {
    return `<a class="btn--small recipe__btn" href="${page}" 
              target="_blank"> <span>Official page</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </a>`;
  };
  generateGenres = function (genres) {
    const genre = genres
      .map(el => {
        return `<li>${el.name}</li>`;
      })
      .join(' ');
    return `${genre}`;
  };
}
export default new MovieView();
