import { Alert, Button, Card, Drawer, Form, message, Select } from "antd";
import { useState } from "react";
import { GlobalCulatorState } from "../../../model/gameStateCalculator/GlobalCalculatorState";
import {
    JoueurCalculatorState,
    MancheCalculatorState,
} from "../../../model/gameStateCalculator/MancheCalculatorState";
import {
    UtilitiesActualType,
    UtilitiesHistoryType,
} from "../../../model/gameStateCalculator/useCalculatorHistoricState";
import { getMahjongScoringRules } from "../../../model/rules/readScoringRules";
import { getJoueurGenerator } from "../../../model/utils/joueursUtils";
import { MyLogger } from "../../../model/utils/logger";
import { MancheResultTab } from "../mancheResultTab/MancheResultTab";

const { Option } = Select;

interface PlayerTabProps {
    utilitiesActu: UtilitiesActualType;
    utilitiesHistory: UtilitiesHistoryType;
    visible: boolean;
    onClose: () => void;
}

interface FormData {
    mahjongPlayer: string;
    mahjongType?: string;
}

export function MahjongDrawer({
    utilitiesActu,
    visible,
    onClose,
}: PlayerTabProps) {
    const [state, setState] = useState<GlobalCulatorState>(
        utilitiesActu.getLastState()
    );
    const [form] = Form.useForm();

    const onFinish = (values: FormData) => {
        const newState = utilitiesActu.calculateMahjongPlayer(
            parseInt(values.mahjongPlayer),
            values.mahjongType !== undefined
                ? parseInt(values.mahjongType)
                : undefined
        );
        message.success("Le mahjong a bien était pris en compte !");
        setState(newState);
    };

    const onFinishFailed = () => {
        // on failed
        MyLogger.warn("form failed in mahjong drawer");
    };

    // calculate the option for the player

    const players = getJoueurGenerator<
        JoueurCalculatorState,
        MancheCalculatorState
    >(utilitiesActu.getLastState().gameState);

    // get if there is an invalid combi
    const invalidCombi: Map<number, number> = new Map();
    const selectPlayerOptions: JSX.Element[] = [];
    const playerArray: JoueurCalculatorState[] = [];
    for (const [player, i] of players) {
        selectPlayerOptions.push(
            <Option key={i} value={i}>
                {player.name}
            </Option>
        );
        playerArray.push(player);
        for (const combi of player.main) {
            if (!combi.isValid()) {
                if (!invalidCombi.has(i)) {
                    invalidCombi.set(i, 1);
                } else {
                    const count = invalidCombi.get(i);
                    if (count !== undefined) {
                        invalidCombi.set(i, count + 1);
                    } else {
                        invalidCombi.set(i, 1);
                    }
                }
            }
        }
    }

    // calculate alert message
    const alertMessage: JSX.Element[] = [];

    for (const [playerIndex, count] of invalidCombi) {
        if (count > 0) {
            alertMessage.push(
                <Alert
                    key={playerIndex}
                    message={`${playerArray[playerIndex].name} a ${count} combinaison(s) invalide(s).`}
                    type="error"
                />
            );
        }
    }

    // calculate the option for the mahjong

    const selectMahjongOptions: JSX.Element[] = getMahjongScoringRules()
        .filter((rule) => !rule.canBeIdentified)
        .map((rule, i) => (
            <Option key={i} value={rule.id}>
                {rule.name}
            </Option>
        ));

    return (
        <Drawer
            title={"Calcul du mahjong"}
            placement="right"
            size={"large"}
            closable={true}
            onClose={() => {
                onClose();
                setState(utilitiesActu.getLastState());
            }}
            visible={visible}
        >
            {alertMessage}
            <Form
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
                initialValues={{ remember: true }}
                onFinish={(value: FormData) => {
                    onFinish(value);
                }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Card title={"Détails du mahjong"}>
                    <Form.Item
                        name={"mahjongPlayer"}
                        label={"Mahjong de "}
                        rules={[{ required: true }]}
                        initialValue={0}
                    >
                        <Select
                            placeholder={"Choisissez un joueur"}
                            disabled={invalidCombi.size > 0}
                        >
                            {selectPlayerOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item name={"mahjongType"} label={"Type de mahjong "}>
                        <Select
                            placeholder={"Choisissez un type"}
                            disabled={invalidCombi.size > 0}
                            allowClear
                        >
                            {selectMahjongOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="button"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={invalidCombi.size > 0}
                        >
                            Valider
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
            <MancheResultTab mancheState={state.gameState}></MancheResultTab>
        </Drawer>
    );
}
