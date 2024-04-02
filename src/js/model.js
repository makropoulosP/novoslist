import { API_URL, SEARCH_RESULTS_PER_PAGE, OPTIONS } from './config';
import { getJSON } from './helpers';

//import { async } from 'regenerator-runtime';
export const state = {
  movie: {},
  genres: [],
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: SEARCH_RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

const getGenres = async function () {
  try {
    const data = await getJSON(
      `${API_URL}genre/movie/list?language=en`,
      OPTIONS
    );

    state.genres = data.genres.map(genre => {
      return {
        id: genre.id,
        name: genre.name.toLowerCase(),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResults = async function (query) {
  state.search.query = query;
  state.search.page = 1;
  try {
    await getGenres();
    if (state.genres.find(el => el.name != query)) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer',
        },
      };
      const getPageData = async (page, query) => {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`,
          options
        );
        return res.json();
      };
      const pagePromises = [1, 2, 3, 4].map(page => getPageData(page, query));
      const dataArray = await Promise.all(pagePromises);
      const data = {
        results: dataArray.flatMap(data => data.results),
      };

      state.search.results = data.results
        .filter(el => el.media_type === 'movie')
        .map(movie => {
          return {
            id: movie.id,
            title: movie.title.toLowerCase(),
            releaseDate: movie.release_date,
            overview: movie.overview,
            voteAverage: movie.vote_average,
            genreIds: movie.genre_ids,
            genres: movie.genre_ids.map(id => {
              return state.genres.find(el => el.id === id).name;
            }),
            path: movie.poster_path,
          };
        });
    }
    if (state.genres.find(el => el.name === query)) {
      const genreId = state.genres.find(element => element.name === query).id;
      const getPageData = async page => {
        return await getJSON(
          `${API_URL}discover/movie?page=${page}&sort_by=popularity.desc&with_genres=${genreId}`,
          OPTIONS
        );
      };
      const pagePromises = [1, 2, 3, 4].map(page => getPageData(page));
      const dataArray = await Promise.all(pagePromises);
      const data = {
        results: dataArray.flatMap(data => data.results),
      };

      state.search.results = data.results.map(movie => {
        return {
          id: movie.id,
          title: movie.title.toLowerCase(),
          releaseDate: movie.release_date,
          overview: movie.overview,
          voteAverage: movie.vote_average,
          genreIds: movie.genre_ids,
          genres: movie.genre_ids.map(id => {
            return state.genres.find(el => el.id === id).name;
          }),
          path: movie.poster_path,
        };
      });
    }
  } catch (err) {
    throw err;
  }
};

export const loadMovie = async function (id) {
  try {
    const data = await getJSON(`${API_URL}movie/${id}`, OPTIONS);

    const dirData = await getJSON(`${API_URL}movie/${id}/credits`, OPTIONS);
    const directorsList = dirData.crew
      .filter(({ job }) => job === 'Director')
      .map(el => el.name);

    state.movie = {
      id: data.id,
      budget: data.budget,
      genres: data.genres, //First letter is capital
      homepage: data.homepage,
      originalTitle: data.original_title,
      releaseDate: data.release_date,
      title: data.title,
      overview: data.overview,
      runtime: data.runtime,
      path: data.backdrop_path,
      productionCompanies: data.production_companies,
      productionCountries: data.production_countries,
      tagline: data.tagline,
      directors: directorsList,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === state.movie.id)) {
      state.movie.bookmarked = true;
    } else state.movie.bookmarked = false;
  } catch (err) {
    throw err;
  }
};
//////////////////////////////////////////////////////

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (movie) {
  //add bookmark
  state.bookmarks.push(movie);

  //mark movie as bookmark
  if (movie.id === state.movie.id) state.movie.bookmarked = true;
  persistBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (state.movie.id === id) state.movie.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
//////////////////////////////////////////
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();

/*

{id: 28, name: 'action'}

{id: 12, name: 'adventure'}

{id: 16, name: 'animation'}

{id: 35, name: 'comedy'}

{id: 80, name: 'crime'}

{id: 99, name: 'documentary'}

{id: 18, name: 'drama'}

{id: 10751, name: 'family'}
 
{id: 14, name: 'fantasy'}

{id: 36, name: 'history'}

{id: 27, name: 'horror'}

{id: 10402, name: 'music'}

{id: 9648, name: 'mystery'}

{id: 10749, name: 'romance'}
 
{id: 878, name: 'science fiction'}

{id: 10770, name: 'tv movie'}

{id: 53, name: 'thriller'}

{id: 10752, name: 'war'}
 
{id: 37, name: 'western'}*/

/*
///////////////// TV /////////////
adult;
false;
backdrop_path;
('/7aMoV1v6A8uwTRaGV8LHIBcVBuN.jpg');
first_air_date;
('2020-04-12');
genre_ids(2)[(35, 18)];
id;
87393;
media_type;
('tv');
name;
('RUN');
origin_country(3)[('CA', 'GB', 'US')];
original_language;
('en');
original_name;
('RUN');
overview;
('Ruby is living a humdrum existence when one day she gets a text inviting her to fulfill a youthful pact, promising true love and self-reinvention, by stepping out of her life to take a journey with her oldest flame.');
popularity;
20.605;
poster_path;
('/rbYfDspa6vUTAxif5SZJABgB8pr.jpg');
vote_average;
6.6;
vote_count;
163;
*/
