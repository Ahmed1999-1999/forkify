//! [ 011 Implementing Error and Succsess messeges ]
import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './configurations/config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
///////////////////////////////////////
const controlRecipes = async function () {
  try {
    //* 1) Get recipe ID
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //* 2) Highlight Selected Recipe in Search Results
    resultsView.update(model.getSearchResultsPage());
    //* 3) Highlight Selected Recipe in Bookmarks
    bookmarksView.update(model.state.bookmarks);
    //* 4) Load Recipe
    await model.loadRecipe(id);
    //* 5) Render Recipe
    recipeView.render(model.state.recipe);
    //* 6) Render Recipe
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //* 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //* 2) Load search results
    await model.loadSearchResults(query);
    //* 3) Render initial search results
    resultsView.render(model.getSearchResultsPage());
    //* 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //* 1) Render updated search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //* 2) Render updated pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //* 1) Update the recipe servings (in Model)
  model.updateServings(newServings);
  //* 2) Update the recipe servings (in Views)
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //* 1) Add / Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //* 2) Update recipe view
  recipeView.update(model.state.recipe);
  //* 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //* 1) Show loading spinner
    addRecipeView.renderSpinner();
    //* 2) Uploade new recipe data
    await model.uploadRecipe(newRecipe);
    //* 3) Render recipe
    recipeView.render(model.state.recipe);
    //* 4) Success message
    addRecipeView.renderMessage();
    //* 5) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
    //* 6) Change ID in url to the created recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //* 7) Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
};
init();
