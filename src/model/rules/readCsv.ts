import { CombiScoring, MahjongScoring } from "./interfacesCsv";

/**
 * get the combi scoring in the csv file
 * @param callBack function to call with the data
 */
export function getCombiScoring(callBack : {(record : CombiScoring[])  : void}) : void {
    fetch('/scoring_rule.csv').then(function (response) {
        if(response.body != null){
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');
    
            reader.read().then(function (result) {
                const text : string = decoder.decode(result.value);

                const rowArray : Array<string> = text.split("\n");
                rowArray.shift();
                callBack (
                    rowArray.map((value : string) => {return value.split(";")}).map((value : string[]) : CombiScoring => {
                        return {
                            name : value[0],
                            open : value[1] === "" ? 0 : parseInt(value[1]),
                            hidden : value[2] === "" ? 0 : parseInt(value[2]),
                            multiplicator : value[3] === "" ? 1 : parseInt(value[3])
                        }
                    })
                );
            });
        }        
    });
}

/**
 * get the mahjong scoring in the csv file
 * @param callBack function to call with the data
 */
 export function getMahjongScoring(callBack : {(record : MahjongScoring[])  : void}) : void {
    fetch('/scoring_rule_mahjong.csv').then(function (response) {
        if(response.body != null){
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');
    
            reader.read().then(function (result) {
                const text : string = decoder.decode(result.value);

                const rowArray : Array<string> = text.split("\n");
                rowArray.shift();
                callBack (
                    rowArray.map((value : string) => {return value.split(";")}).map((value : string[]) : MahjongScoring => {
                        return {
                            name : value[0],
                            open : value[1] === "" ? 0 : parseInt(value[1]),
                            hidden : value[2] === "" ? 0 : parseInt(value[2]),
                            multiplicator : value[3] === "" ? 1 : parseInt(value[3])
                        }
                    })
                );
            });
        }        
    });
}