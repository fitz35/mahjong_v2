import React from "react";
import {
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { getCombiScoringRules, getMahjongScoringRules } from "../../model/rules/readScoringRules";
import { Table, Tag } from "antd";
import { MyLogger } from "../../model/utils/logger";
import { ColumnsType } from "antd/lib/table";
import { CombiScoringRule, MahjongScoringRule } from "../../model/rules/interfacesScoringRules";

/**
 * display the rulling
 */
export class CustomRules extends React.Component {
  
    render() {
        MyLogger.debug("combinaison rules : ", getCombiScoringRules());
        MyLogger.debug("mahjong rule : ", getMahjongScoringRules());
        const columnsCombi : ColumnsType<CombiScoringRule> = [
            {
                title: "Nom",
                dataIndex: "name",
                key: "name",
            },
            {
                title: <EyeOutlined></EyeOutlined>,
                dataIndex: "open",
                key: "open",
            },
            {
                title: <EyeInvisibleOutlined></EyeInvisibleOutlined>,
                dataIndex: "hidden",
                key: "hidden",
            },
            {
                title: <CloseOutlined></CloseOutlined>,
                dataIndex: "multiplicator",
                key: "multiplicator",
            },
        ];

        const combiComponent = (
            <Table
                pagination={false}
                title={() => "Points des combinaisons"}
                scroll={{ y: 240 }}
                dataSource={getCombiScoringRules()}
                columns={columnsCombi}
            />
        );

        const columnsMahjong : ColumnsType<MahjongScoringRule> = [
            {
                title: "Nom",
                dataIndex: "name",
                key: "name",
            },
            {
                title: <EyeOutlined></EyeOutlined>,
                dataIndex: "open",
                key: "open",
            },
            {
                title: <CloseOutlined></CloseOutlined>,
                dataIndex: "multiplicator",
                key: "multiplicator",
            },
            {
                title: "Peut-être automatiquement identifié ?",
                dataIndex: "canBeIdentified",
                key: "canBeIdentified",
                render: (canBeIdentified : boolean, _, index : number) => {
                    if (canBeIdentified) {
                        return (
                            <Tag color='green' key={index.valueOf()}>
                                oui
                            </Tag>
                        );
                    }else{
                        return (
                            <Tag color='volcano' key={index.valueOf()}>
                                non
                            </Tag>
                        );
                    }
                }
            },

        ];

        const mahjongComponent = (
            <Table
                pagination={false}
                title={() => "Points des mahjong"}
                scroll={{ y: 240 }}
                dataSource={getMahjongScoringRules()}
                columns={columnsMahjong}
            />
        );

        return (
            <div>
                {combiComponent}
                {mahjongComponent}
                <embed
                    id="pdf-view"
                    src="/riichi-fr.pdf"
                    height="500px"
                    width="100%"
                    type="application/pdf"
                />
            </div>
        );
    }
}
