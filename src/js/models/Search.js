import axios from "axios/index";
import { key, proxy} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {

        try {

            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);

        } catch (e) {
            console.log(e);
            //alert(error);
        }
    }
}
