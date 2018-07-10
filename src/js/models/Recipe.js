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

    parseIngredients() {
        const unitsLong = [ 'tablespoons',
                            'tablespoon',
                            'ounces',
                            'ounce',
                            'teaspoons',
                            'teaspoon',
                            'cups',
                            'cup',
                            'pounds',];

        const unitsShort = ['tbsp',
                            'tbsp',
                            'oz',
                            'oz',
                            'tsp',
                            'tsp',
                            'cup',
                            'cup',
                            'lb(s)'];

        const units = [...unitsShort, 'g', 'kg'];

        const newIngredients = this.ingredients.map(el => {

            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;

            if(unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // There is not unit but first element is num
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1){
                // There is no unit and no num
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;

    }

    updateServings (type) {

        //Servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *=  (newServings / this.servings);
        });

        this.servings = newServings;
    }
}