import React, { ReactElement } from "react";
import {
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeOutlined
  } from '@ant-design/icons';

import { CombiScoring, MahjongScoring } from "../../model/rules/interfacesCsv";
import { getCombiScoring, getMahjongScoring } from "../../model/rules/readCsv";
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
            getMahjongScoring((data : MahjongScoring[]) => { // cant doing in parrallele => doesn't update well the view
                this.setState({combiScoring : this.state.combiScoring, mahjongScoring : data});
            });
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
                <Table pagination={false} title={() => 'Points des combinaisons'} scroll={{ y: 240 }} dataSource={this.state.combiScoring} columns={columns} />;    
            
            ;
        }

        var mahjongComponent : ReactElement<any, any>;
        if(this.state.mahjongScoring == null){
            mahjongComponent = <div></div>;
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

            mahjongComponent = 
                <Table pagination={false} title={() => 'Points des mahjong'} scroll={{ y: 240 }} dataSource={this.state.mahjongScoring} columns={columns} />;    
            
            ;
        }

        return (
            <div>
                {combiComponent}
                {mahjongComponent}
                <embed id="pdf-view" src="/riichi-fr.pdf" height="500px" width="100%" type='application/pdf'/>
            </div>
        )
    }

}