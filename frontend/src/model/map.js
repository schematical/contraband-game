import Lot from './lot';
import _ from "underscore";
class Map{

    constructor(options) {
        this.app = options.app;
        this.cols = {};
    }
    get(x,y){
        if(_.isUndefined(this.cols[x])){
            this.cols[x] = {};
        }
        let lot = this.cols[x][y];
        if(!lot){
            console.log("Populating: ", x,y);
            //generate
            lot = new Lot({
                app: this.app,
                x: x,
                y: y
            })
            lot.populateRandom();
            this.cols[x][y] = lot;
        }
        return lot;
    }

    render(container){
        //Iterate through
        this.each((lot)=>{
            lot.render(container);
        })

    }
    each(iterator){
        Object.keys(this.cols).forEach((x) =>{
            Object.keys(this.cols[x]).forEach((y) =>{
                let lot = this.cols[x][y];
                console.log("Calling Render" , lot.x, lot.y);
                iterator(lot);
            })
        })
    }

}
export default Map;