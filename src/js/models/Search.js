import axios from "axios/index";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '2de0178cc242d5cbc0e51fc782642dcc';

        try {

            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);

        } catch (error) {
            alert(error);
        }
    }
}
