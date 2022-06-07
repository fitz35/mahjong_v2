import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Famille, NumeroVent } from "../../model/dataModel/dataUtils";
import { Piece } from "../../model/dataModel/Piece";
import { GameSearchParamsCalculator, SearchParamsJoueur, transformSearchParamsCalculatorToString } from "../../model/gameState/GameSearchParamsCalculator";
import { GlobalCulatorState } from "../../model/gameState/GlobalCalculatorState";
import { getJoueurGenerator } from "../../model/utils/joueursUtils";
import { MyLogger } from "../../model/utils/logger";


/**
 * get the vent translation in french
 * @param vent the vent
 * @returns the vent translation in french
 */
function getFrVentName(vent : NumeroVent) : string {
    return new Piece(vent as string, Famille.Vent).getNumeroDisplay();
}

function getSelectOptions(vent : NumeroVent) : JSX.Element[] {
    const options : JSX.Element[] = [];
    const vents : NumeroVent[] = [NumeroVent.Nord, NumeroVent.Sud, NumeroVent.Est, NumeroVent.Ouest];
    for (let i = 0; i < vents.length; i++) {
        if(vent !== vents[i]) {
            options.push(<Select.Option value={vents[i]}>{getFrVentName(vents[i])}</Select.Option>);
        }
    }
    return options;
}

interface JoueurCardProps {
    joueur: SearchParamsJoueur
}


function JoueurCard({ joueur }: JoueurCardProps) {
    const [canBeModify, setCanBeModify] = useState(false);

    const onFinish = (values: any) => {
        MyLogger.debug(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        MyLogger.error(errorInfo);
    };

    const onEdit = () => {
        // TODO
    };



    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Card 
                    key={joueur.name} 
                    title={
                        <Form.Item name="name" rules={[{ required: true }]}  initialValue={joueur.name}>
                            <Input disabled={!canBeModify}/>
                        </Form.Item>
                    }
                >
                    <Form.Item name="vent" label="Vent" rules={[{ required: true }]} initialValue={getFrVentName(joueur.vent)}>
                        <Select disabled={!canBeModify}>
                            {getSelectOptions(joueur.vent)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" icon={<CheckOutlined />} disabled={!canBeModify}>Valider !</Button>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} />
                    </Form.Item>
                </Card>
            </Form>
        </>
    );
}

interface ParamPanelProps {
    calculatorState: GlobalCulatorState,
    setCalculatorState: React.Dispatch<React.SetStateAction<GlobalCulatorState>>,
    gutter : {
        xs: number;
        sm: number;
        md: number;
        lg: number;
    }
}


/**
 * display the different parameters of the calculator
 * @returns
 */
export function ParamPanel(
    {calculatorState, setCalculatorState, gutter} : ParamPanelProps
) {

    // generation of the card for every player
    const cardGeneration = [];
    const iterator = getJoueurGenerator<SearchParamsJoueur, GameSearchParamsCalculator>(calculatorState.gameState);
    for (const joueur of iterator) {
        if(joueur !== undefined) {
            cardGeneration.push(<Col span={4}><JoueurCard joueur={joueur}></JoueurCard></Col>);
        }
    }

    return <>
        
        <Row gutter={gutter}>
            {cardGeneration}
            <Col className="gutter-row" span={2}>
                <Button type="primary" onClick={() => {
                    navigator.clipboard.writeText(
                        window.location.href + "?" + 
                        transformSearchParamsCalculatorToString(calculatorState.gameState)
                    );
                }}>
                    Sauvegarder !
                </Button>
            </Col>
        </Row>
       
    </>;
}
