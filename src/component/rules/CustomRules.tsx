import React from "react";
import {
    CloseOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import { getCombiScoringRules, getMahjongScoringRules } from "../../model/rules/readScoringRules";
import { Table } from "antd";
import { MyLogger } from "../../model/utils/logger";

/**
 * display the rulling
 */
export class CustomRules extends React.Component {
  
    render() {
        MyLogger.debug("combinaison rules : ", getCombiScoringRules());
        MyLogger.debug("mahjong rule : ", getMahjongScoringRules());
        let columns = [
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
                columns={columns}
            />
        );

        columns = [
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

        const mahjongComponent = (
            <Table
                pagination={false}
                title={() => "Points des mahjong"}
                scroll={{ y: 240 }}
                dataSource={getMahjongScoringRules()}
                columns={columns}
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
