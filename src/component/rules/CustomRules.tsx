import React, { ReactElement } from "react";
import {
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeOutlined
  } from '@ant-design/icons';

import { CombiScoring, MahjongScoring } from "../../model/rules/interfacesCsv";
import { getCombiScoring } from "../../model/rules/readCsv";
import { CombiRuleComponent } from "./CombiRuleComponent";

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
            combiComponent = 
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th><EyeOutlined /></th>
                        <th><EyeInvisibleOutlined /></th>
                        <th><CloseOutlined /></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.combiScoring.map((value : CombiScoring) => {
                        return (<CombiRuleComponent combi={value}></CombiRuleComponent>);
                    })}
                </tbody>
                
            </table>
            
            
            ;
        }

        return (
            <div>
                {combiComponent}
            </div>
        )
    }

}