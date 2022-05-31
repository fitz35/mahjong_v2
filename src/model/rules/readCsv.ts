import { CombiScoringRules, MahjongScoringRules } from "./interfacesCsv";
import combiData from "../../data/combiScoring.json";
import mahjongData from "../../data/mahjongScoring.json";

/**
 * get the combi scoring in the json file
 * @return the combi scoring
 */
export function getCombiScoring() : CombiScoringRules[] {
    return combiData.map(
        (value: 
            { id: number; 
                name: string; 
                open: number; 
                hidden: number; 
                multiplicator: number; 
                baseCombi: string; 
                modificateur: string[]; 
            }) => {return value as CombiScoringRules}
        );
}

/**
 * get the mahjong scoring in the json file
 * @return the mahjong scoring
 */
 export function getMahjongScoring() : MahjongScoringRules[] {
    return mahjongData.map(
        (value:
            { id: number;
                name: string;
                open: number;
                hidden: number;
                multiplicator: number;
            }) => {return value as MahjongScoringRules});
}