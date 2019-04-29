import Lot from './lot';
import _ from "underscore";
class Map{

    constructor(options) {
        this.app = options.app;
        this.cols = {};
    }
    get(x,y, _options){
        let options = {
            autoGen:true
        };
        _.extend(options, _options)
        if(_.isUndefined(this.cols[x])){
            this.cols[x] = {};
        }
        let lot = this.cols[x][y] || null;

        if(!lot && options.autoGen){

            //generate
            lot = new Lot({
                app: this.app,
                x: x,
                y: y
            })
            if(x != 0 || y != 0) {
                lot.populateRandomBuilding();
            }
             lot.cacheEmptyTiles();
            if(
                (
                    x < -1 ||
                    x > 1
                ) &&
                (
                    y < -1 ||
                    y > 1
                )
            ){
                lot.populateNPCs();
            }
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
                iterator(lot);
            })
        })
    }
    refreshLotVisibility(container){
        this.each((lot)=>{
            if(
                lot.x + this.app.Enum.LOT_WIDTH > container.left &&
                lot.x < container.right &&
                lot.y + this.app.Enum.LOT_WIDTH > container.top &&
                lot.y < container.bottom
            ){
                lot.visible = true;
            }else{
                lot.visible = false;
            }
        })
    }

}
export default Map;