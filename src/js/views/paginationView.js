import view from './view.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends view {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //page 1 + other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateNextButton(currentPage);
    }
    //last page
    if (currentPage === numPages && numPages > 1) {
      return this._generatePreviousButton(currentPage);
    }
    //page that has prev + other pages
    if (currentPage < numPages) {
      return (
        this._generatePreviousButton(currentPage) +
        this._generateNextButton(currentPage)
      );
    }
    //page 1 + NO other pages
    return '';
  }

  _generatePreviousButton(currentPage) {
    return `
    <button data-goto=${
      currentPage - 1
    } class="btn--inline pagination__btn--prev">
      
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>`;
  }
  _generateNextButton(currentPage) {
    return `
      <button data-goto=${
        currentPage + 1
      } class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }
}
export default new PaginationView();
