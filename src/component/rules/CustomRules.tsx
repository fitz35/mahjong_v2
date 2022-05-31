import React, { ReactElement } from "react";
import {
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getCombiScoring, getMahjongScoring } from "../../model/rules/readCsv";
import { Table } from "antd";

/**
 * display the rulling
 */
export class CustomRules extends React.Component {
  
  render() {
    console.log(getCombiScoring());
    var combiComponent: ReactElement<any, any>;
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

    combiComponent = (
      <Table
        pagination={false}
        title={() => "Points des combinaisons"}
        scroll={{ y: 240 }}
        dataSource={getCombiScoring()}
        columns={columns}
      />
    );

    var mahjongComponent: ReactElement<any, any>;
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

    mahjongComponent = (
      <Table
        pagination={false}
        title={() => "Points des mahjong"}
        scroll={{ y: 240 }}
        dataSource={getMahjongScoring()}
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
