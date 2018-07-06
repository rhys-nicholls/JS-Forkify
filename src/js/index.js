import Search from  './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader, } from "./views/base";

/*  Global State of the app
*  - Search Object
*  - Current recipe Object
*  - Shopping list Object
*  - Liked recipes
*/
const state = {};

///////// SEARCH CONTROLLER ////////////

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    // For testing purposes
    //const query = 'pizza';

    //console.log(query);

    if(query){
        // 2. New Search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (e) {
            console.log(e);
            alert('Something went wrong whilst searching');
            clearLoader();

        }
    }

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});

/*
// For testing purposes
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();

});
*/

elements.searchrResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

///////// RECIPE CONTROLLER ////////////

const controlRecipe = async () => {

    // window.location gets URL
    const id = window.location.hash.replace('#', '');

    if(id){

        // 1. Prepare UI for changes

        // 2. Create new Recipe object
        state.recipe = new Recipe(id);

        // For testing purposes
        window.r = state.recipe;

        try {
            // 3. Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4. Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. Render results in UI
            console.log(state.recipe);

        } catch (e) {
            console.log(e);
            //alert('Error processing recipe');
        }
    }
};

// Example of multiple eventlisteners with the same function call
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));