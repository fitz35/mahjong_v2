import React from "react";
import { CombiScoring } from "../../model/rules/interfacesCsv";

export class CombiRuleComponent extends React.Component <{combi : CombiScoring}, {}>{
    constructor(props: {combi : CombiScoring}) {
        super(props)
    }

    render(){
        return (
            <tr>
                <td>
                    {this.props.combi.name}
                </td>
                <td>
                    {this.props.combi.open}
                </td>
                <td>
                    {this.props.combi.hidden}
                </td>
                <td>
                    {this.props.combi.multiplicator}
                </td>
            </tr>
        )
    }
}