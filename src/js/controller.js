import * as model from './model.js';
import movieView from './views/movieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import { async } from 'regenerator-runtime';
import 'core-js/stable'; //pollyfilling everything
import 'regenerator-runtime/runtime'; //pollyfilling async await

const controlMovieList = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    movieView.renderSpinner();

    //update results view to make selected search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmark view
    bookmarksView.update(model.state.bookmarks);

    //Loading movie
    await model.loadMovie(id);

    //Rendering movie
    movieView.render(model.state.movie);
  } catch (err) {
    movieView.renderError();
    console.log(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //Get query
    const query = searchView.getQuery();
    if (!query) return;

    //Loading Results
    await model.getSearchResults(query);

    //Rendering Results
    resultsView.render(model.getSearchResultsPage());

    //Render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //rendering new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //rendering new pagination buttons
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  if (!model.state.movie.bookmarked) model.addBookmark(model.state.movie);
  else model.deleteBookmark(model.state.movie.id);
  movieView.update(model.state.movie);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmars = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmars);
  movieView.addHandlerRender(controlMovieList);
  movieView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSeach(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
