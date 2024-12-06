import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currentPage === 1 && numPage > 1)
      return `${this._generatePaginationBtn(currentPage, 'next')}`;

    if (currentPage === numPage && numPage > 1)
      return `${this._generatePaginationBtn(currentPage, 'prev')}`;

    if (currentPage < numPage)
      return `${this._generatePaginationBtn(
        currentPage,
        'prev'
      )} ${this._generatePaginationBtn(currentPage, 'next')}`;

    return '';
  }

  _generatePaginationBtn(curPage, dir) {
    if (dir === 'next')
      return `
        <button data-goto = ${
          curPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
        `;
    if (dir === 'prev')
      return `
      <button data-goto = ${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
      </button>
    `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage)
    })
  }
}

export default new PaginationView();
