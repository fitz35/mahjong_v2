import { Button, Card, Form, Input, Select } from "antd";
import { GameSearchParamsCalculator, SearchParamsJoueur, transformSearchParamsCalculatorToString } from "../../model/gameState/GameSearchParamsCalculator";
import { GlobalCulatorState } from "../../model/gameState/GlobalCalculatorState";
import { getJoueurGenerator } from "../../model/utils/joueursUtils";
import { MyLogger } from "../../model/utils/logger";

function generationJoueurCard(joueur: SearchParamsJoueur): JSX.Element {
    const onFinish = (values: any) => {
        MyLogger.debug(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        MyLogger.error(errorInfo);
    };

    return (
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
                    <Form.Item name="name" rules={[{ required: true }]} initialValue={joueur.name}>
                        <Input />
                    </Form.Item>
                }
            >
                <Form.Item name="vent" label="Vent" rules={[{ required: true }]} initialValue={joueur.name}>
                    <Select>
                        {}
                    </Select>
                </Form.Item>
            </Card>
        </Form>
    );
}

/**
 * display the different parameters of the calculator
 * @returns
 */
export function ParamPanel(
    calculatorState: GlobalCulatorState,
    setCalculatorState: React.Dispatch<React.SetStateAction<GlobalCulatorState>>
) {

    // generation of the card for every player
    const cardGeneration = [];
    const iterator = getJoueurGenerator<SearchParamsJoueur, GameSearchParamsCalculator>(calculatorState.gameState);
    for (const joueur of iterator) {
        if(joueur !== undefined) {
            cardGeneration.push(generationJoueurCard(joueur));
        }
    }

    return <>
        <Button type="primary" onClick={() => {
            navigator.clipboard.writeText(
                window.location.href + "?" + 
                transformSearchParamsCalculatorToString(calculatorState.gameState)
            );
        }}>
            Sauvegarder !
        </Button>
        {/*cardGeneration*/}
    </>;
}
