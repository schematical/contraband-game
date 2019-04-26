import _ from 'underscore';
class Population{
    static get Type(){
        return {
            ZOMBIE: "ZOMBIE",
            HUMAN: "HUMAN"
        }
    }

    constructor(data){

        _.extend(this, data);


    }

}
export default Population;