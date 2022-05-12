import React, { ReactElement } from "react";
import { CombiScoring, MahjongScoring } from "../../model/rules/interfacesCsv";
import { getCombiScoring } from "../../model/rules/readCsv";

type RulesState = {
    combiScoring : CombiScoring[] | null,
    mahjongScoring : MahjongScoring[] | null

}


export class CustomRules extends React.Component <{}, RulesState>{
    constructor(props: {}) {
        super(props)

        this.state = {combiScoring : null, mahjongScoring : null};
        getCombiScoring((data : CombiScoring[]) => {
            this.setState({combiScoring : data, mahjongScoring : this.state.mahjongScoring});
        });

    }

    render() {
        var combiComponent : ReactElement<any, any>;
        if(this.state.combiScoring == null){
            combiComponent = <div></div>;
        }else{
            combiComponent = <div></div>
            
            
            ;
        }

        return (
            <div>
                {combiComponent}
            </div>
        )
    }

}