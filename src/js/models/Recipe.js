import axios from 'axios';
import { key, proxy} from '../config';


export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try {

            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            //console.log(this);

        } catch (e) {
            console.log(e);
            //alert('Something went wrong!');
        }
    }

    // Estimates cooking time, with the assumption that 3 ingredients takes 15mins
    calcTime() {
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients/ 3);
        this.time = periods * 15;
    }

    // Default value of 4 servings
    calcServings() {
        this.servings = 4;
    }
}