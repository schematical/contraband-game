import Lot from './lot';
class Map{

    constructor(options) {
        this.app = options.app;
        this.cols = [];
    }
    get(x,y){
        if(!this.cols[x]){
            this.cols[x] = [];
        }
        let lot = this.cols[x][y];
        if(!lot){
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
        this.cols.forEach((col) =>{
            col.forEach((lot) =>{
                iterator(lot);
            })
        })
    }

}
export default Map;