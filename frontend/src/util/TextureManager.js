import {Helper} from "./Helper";
import * as PIXI from "pixi.js";
import _ from "underscore";
const LOT_SIZE = 64;
const NPC_SIZE = 4;
const TILE_SIZE = 16;
class TextureManager{
    constructor(){
        this.cache = {};
    }
    getLotObservedDefault(){
        if(!this.cache["LotObservedDefault"]){
            return this.cache["LotObservedDefault"] =  this.generateSquare(LOT_SIZE, LOT_SIZE, "#ffffff", 8);
        }
        return this.cache["LotObservedDefault"];

    }
    getLotObservedHovered(){
        if(!this.cache["LotObservedHovered"]){
            return this.cache["LotObservedHovered"] =  this.generateSquare(LOT_SIZE, LOT_SIZE, "#ffffff", 32);
        }
        return this.cache["LotObservedHovered"];
    }
    getLotObservedSelected(){
        if(!this.cache["LotObservedSelected"]){
            return this.cache["LotObservedSelected"] =  this.generateSquare(LOT_SIZE, LOT_SIZE, "#ffffff", 64);
        }
        return this.cache["LotObservedSelected"];
    }
    getNPCZombieObservedDefault(){
        if(!this.cache["NPCZombieObservedDefault"]){
            return this.cache["NPCZombieObservedDefault"] =  this.generateSquare(NPC_SIZE, NPC_SIZE, "#008800", 255);
        }
        return this.cache["NPCZombieObservedDefault"];
    }
    getNPCZombieObservedDowned(){
        if(!this.cache["NPCZombieObservedDowned"]){
            return this.cache["NPCZombieObservedDowned"] =  this.generateSquare(NPC_SIZE, NPC_SIZE, "#448844", 255);
        }
        return this.cache["NPCZombieObservedDowned"];
    }
    getNPCCivilianObservedDefault(){
        if(!this.cache["NPCCivilianObservedDefault"]){
            return this.cache["NPCCivilianObservedDefault"] =  this.generateSquare(NPC_SIZE, NPC_SIZE, "#666666", 255);
        }
        return this.cache["NPCCivilianObservedDefault"];
    }
    getNPCAllieObservedDefault(){
        if(!this.cache["AllieObservedDefault"]){
            return this.cache["AllieObservedDefault"] =  this.generateSquare(NPC_SIZE, NPC_SIZE, "#6666ff", 255);
        }
        return this.cache["AllieObservedDefault"];
    }
    getNPCRecentlyDeceasedObservedDefault(){
        if(!this.cache["NPCRecentlyDeceasedObservedDefault"]){
            return this.cache["NPCRecentlyDeceasedObservedDefault"] =  this.generateSquare(NPC_SIZE, NPC_SIZE, "#333366", 255);
        }
        return this.cache["NPCRecentlyDeceasedObservedDefault"];
    }
    getBuildingTileDefault(tile){
        let color = Helper.hexToRgb(tile.building.primaryMaterial.color);
        let secondaryColor = Helper.hexToRgb(tile.building.secondaryMaterial.color);
        return this.generateSquare(TILE_SIZE, TILE_SIZE, color, 255, (x,y, color)=>{
            let multiplier = 1;

            if(y > TILE_SIZE  * .5) {

                if(
                    tile.ingress &&
                    y > TILE_SIZE * .7 &&
                    x > TILE_SIZE * .4 &&
                    x < TILE_SIZE * .6
                ) {

                    multiplier = .3;
                    color = _.clone(secondaryColor)

                }else if(tile.bottom){
                    multiplier = .2;
                    color = _.clone(color);

                }
                color.r *= multiplier;
                color.g *= multiplier;
                color.b *= multiplier;


            }
            return color;
        });
    }
    generateSquare(width, height, color, alpha, pixelModifier){
        if(_.isUndefined(alpha)){
            alpha = 255;
        }
        if(!this.canvas) {
            this.canvas = document.getElementById("sketchPad")
            this.ctx = this.canvas.getContext('2d');
        }


        this.ctx.clearRect(0,0,  this.canvas.width, this.canvas.height);
        this.canvas.width = width;
        this.canvas.height = height;
        var img = new ImageData(height, width);

        if(_.isString(color)) {
            color = Helper.hexToRgb(color);
        }
        let i = 0;
        let origColor = _.clone(color);
        for(let y = 0; y < width; y++){
            for(let x = 0; x < height; x++){
                if(pixelModifier){
                    color = pixelModifier(x,y,origColor)
                }
                img.data[i * 4] = color.r;
                img.data[i * 4 + 1] = color.g;
                img.data[i * 4 + 2] = color.b;
                img.data[i * 4 + 3] = alpha;

                i++;
            }
        }

        this.ctx.putImageData(img, 0, 0);

        let url = this.canvas.toDataURL()

        let texture = PIXI.Texture.fromImage(url);
        return texture;
    }
    getTextStyle(){
        if(!this.cache["TextStyle"]) {
            this.cache["TextStyle"] = new PIXI.TextStyle({
                fontFamily: 'DOS',
                fontSize: 8,
                fontWeight: 'bold',
                fill: '#ffffff',
                //stroke: '#4a1850',
                //strokeThickness: 5,

              /*  dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,*/


                //wordWrap: true,
                wordWrapWidth: 440,
            });
        }
        return this.cache["TextStyle"];
    }
}
export default TextureManager