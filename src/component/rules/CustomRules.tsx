import React, { ReactElement } from "react";
import {
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeOutlined
  } from '@ant-design/icons';

import { CombiScoring, MahjongScoring } from "../../model/rules/interfacesCsv";
import { getCombiScoring } from "../../model/rules/readCsv";
import { Table } from "antd";

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
            const columns = [
                {
                  title: 'Nom',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: <EyeOutlined></EyeOutlined>,
                  dataIndex: 'open',
                  key: 'open',
                },
                {
                  title: <EyeInvisibleOutlined></EyeInvisibleOutlined>,
                  dataIndex: 'hidden',
                  key: 'hidden',
                },
                {
                    title: <CloseOutlined></CloseOutlined>,
                    dataIndex: 'multiplicator',
                    key: 'multiplicator',
                  },
              ];

            combiComponent = 
                <Table id="combiTableRules" title={() => 'Points des combinaisons'} pagination={{ pageSize: 1000 }} scroll={{ y: 240 }} dataSource={this.state.combiScoring} columns={columns} />;    
            
            ;
        }

        return (
            <div>
                {combiComponent}
            </div>
        )
    }

}