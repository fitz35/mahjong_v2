import {
    ArrowRightOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    RedoOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Select,
    Space,
} from "antd";
import { useEffect, useState } from "react";
import {
    Famille,
    getNextVent,
    getRandomVent,
    NumeroVent,
} from "../../../model/dataModel/dataUtils";
import { Piece } from "../../../model/dataModel/Piece";
import {
    MancheCalculatorState,
    JoueurCalculatorState,
} from "../../../model/gameStateCalculator/MancheCalculatorState";
import {
    UtilitiesActualType,
    UtilitiesHistoryType,
} from "../../../model/gameStateCalculator/useCalculatorHistoricState";
import { getJoueurGenerator } from "../../../model/utils/joueursUtils";
import { MyLogger } from "../../../model/utils/logger";
import { JoueurCard } from "./JoueurCard";
import { SavePanel } from "./SavePanel";

/**
 * get the vent translation in french
 * @param vent the vent
 * @returns the vent translation in french
 */
function getFrVentName(vent: NumeroVent): string {
    return new Piece(vent as string, Famille.Vent).getNumeroDisplay();
}

/**
 * get the vent options minus the current vent
 * @returns the vent options
 */
export function getSelectOptionsForVents(): JSX.Element[] {
    const options: JSX.Element[] = [];
    const vents: NumeroVent[] = [
        NumeroVent.Nord,
        NumeroVent.Sud,
        NumeroVent.Est,
        NumeroVent.Ouest,
    ];
    for (let i = 0; i < vents.length; i++) {
        options.push(
            <Select.Option
                key={"selectOptionVent" + i}
                value={vents[i] as string}
            >
                {getFrVentName(vents[i])}
            </Select.Option>
        );
    }
    return options;
}

interface ParamPanelProps {
    utilitiesActu: UtilitiesActualType;
    utilitiesHistory: UtilitiesHistoryType;
}

/**
 * get the form data
 */
interface formData {
    name0: string;
    vent0: NumeroVent;
    name1: string;
    vent1: NumeroVent;
    name2: string;
    vent2: NumeroVent;
    name3: string;
    vent3: NumeroVent;

    ventDominant: NumeroVent;
}

/**
 * display the different parameters of the calculator
 * @returns
 */
export function ParamPanel({
    utilitiesActu,
    utilitiesHistory,
}: ParamPanelProps) {
    const [form] = Form.useForm();
    const [canBeModify, setCanBeModify] = useState(false);

    const actuallyState = utilitiesActu.getLastState();

    // reset field when the state change
    useEffect(() => {
        form.resetFields();
    }, [form, actuallyState]);

    const onFinish = (values: formData) => {
        MyLogger.debug("values : ", values);
        message.success("Modification des joueurs effectuée");
        // get the old joueur
        const oldJoueur1 = utilitiesActu.getLastState().gameState.joueur1;
        const oldJoueur2 = utilitiesActu.getLastState().gameState.joueur2;
        const oldJoueur3 = utilitiesActu.getLastState().gameState.joueur3;
        const oldJoueur4 = utilitiesActu.getLastState().gameState.joueur4;

        // update the calculator
        utilitiesActu.modifyActuParams(
            new JoueurCalculatorState(
                oldJoueur1.main,
                values.vent0,
                values.name0,
                oldJoueur1.points
            ),
            new JoueurCalculatorState(
                oldJoueur2.main,
                values.vent1,
                values.name1,
                oldJoueur2.points
            ),
            new JoueurCalculatorState(
                oldJoueur3.main,
                values.vent2,
                values.name2,
                oldJoueur3.points
            ),
            new JoueurCalculatorState(
                oldJoueur4.main,
                values.vent3,
                values.name3,
                oldJoueur4.points
            ),
            values.ventDominant
        );

        setCanBeModify(false);
    };

    const onFinishFailed = () => {
        MyLogger.debug("Failed: ");
        message.error("Modification du joueur impossible");
    };

    const onEditButton = () => {
        if (canBeModify) {
            // reset the form to player param
            form.resetFields();
            setCanBeModify(false);
        } else {
            setCanBeModify(true);
        }
    };

    /**
     * check the vent fields
     */
    const checkManualyVent = (
        newVent: NumeroVent,
        indexPlayer: number
    ): boolean => {
        const joueursError = [false, false, false, false];
        for (let joueur1 = 0; joueur1 < 4; joueur1++) {
            for (let joueur2 = 0; joueur2 < 4; joueur2++) {
                if (joueur1 !== joueur2) {
                    if (
                        form.getFieldValue("vent" + joueur1) ===
                        form.getFieldValue("vent" + joueur2)
                    ) {
                        joueursError[joueur1] = true;
                        joueursError[joueur2] = true;
                    }
                }
            }
        }

        form.setFields(
            joueursError.map((error, index) => {
                return {
                    name: "vent" + index,
                    errors: error ? ["Vent identique"] : [],
                    value:
                        index === indexPlayer
                            ? newVent
                            : form.getFieldValue("vent" + index),
                };
            })
        );

        return joueursError[indexPlayer];
    };

    /**
     * decal the vent
     */
    const onDecalageVent = () => {
        const vent1: NumeroVent = form.getFieldValue("vent0");
        const vent2: NumeroVent = form.getFieldValue("vent1");
        const vent3: NumeroVent = form.getFieldValue("vent2");
        const vent4: NumeroVent = form.getFieldValue("vent3");
        form.setFields([
            {
                name: "vent0",
                value: getNextVent(vent1),
            },
            {
                name: "vent1",
                value: getNextVent(vent2),
            },
            {
                name: "vent2",
                value: getNextVent(vent3),
            },
            {
                name: "vent3",
                value: getNextVent(vent4),
            },
        ]);
    };

    const onRandomVent = () => {
        const vents: NumeroVent[] = [
            NumeroVent.Nord,
            NumeroVent.Sud,
            NumeroVent.Est,
            NumeroVent.Ouest,
        ];
        const randomDominant: NumeroVent = vents[Math.floor(Math.random() * 4)];
        const randomVents: NumeroVent[] = new Array(4);
        for (let i = 0; i < 4; i++) {
            const indexRandom = Math.floor(Math.random() * vents.length);
            randomVents[i] = vents[indexRandom];
            vents.splice(indexRandom, 1);
        }
        form.setFields([
            {
                name: "vent0",
                value: randomVents[0],
            },
            {
                name: "vent1",
                value: randomVents[1],
            },
            {
                name: "vent2",
                value: randomVents[2],
            },
            {
                name: "vent3",
                value: randomVents[3],
            },
            {
                name: "ventDominant",
                value: randomDominant,
            },
        ]);
    };

    const onRandomVentDominant = () => {
        form.setFields([
            {
                name: "ventDominant",
                value: getRandomVent(),
            },
        ]);
    };

    const onConfirmReset = () => {
        // confirm
        utilitiesHistory.resetHistoricState();
        message.success("Historique réinitialisé");
    };

    const onNotConfirmReset = () => {
        // nothing to do
    };

    // generation of the card for every player
    const cardGeneration = [];
    const iterator = getJoueurGenerator<
        JoueurCalculatorState,
        MancheCalculatorState
    >(utilitiesActu.getLastState().gameState);
    for (const [joueur, i] of iterator) {
        if (joueur !== undefined) {
            cardGeneration.push(
                <JoueurCard
                    key={"joueurCard" + i}
                    onChangeVent={checkManualyVent}
                    canBeModify={canBeModify}
                    joueur={joueur}
                    number={i}
                ></JoueurCard>
            );
        }
    }

    const labelCol = 10;
    const wrapperCol = 14;

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: labelCol }}
                wrapperCol={{ span: wrapperCol }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Row gutter={24}>
                    <Col span={2}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={
                                canBeModify ? (
                                    <CloseOutlined />
                                ) : (
                                    <EditOutlined />
                                )
                            }
                            onClick={onEditButton}
                        />
                    </Col>
                    <Col span={2}>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            htmlType="submit"
                            disabled={!canBeModify}
                        >
                            Valider !
                        </Button>
                    </Col>
                    <Col span={6} offset={9}>
                        <SavePanel></SavePanel>
                    </Col>
                    <Col span={5}>
                        <Popconfirm
                            title="Etes-vous sur de vouloir réinitialiser la partie ?"
                            onConfirm={onConfirmReset}
                            onCancel={onNotConfirmReset}
                            okText="Oui"
                            cancelText="Non"
                        >
                            <Button type="primary">Reset !</Button>
                        </Popconfirm>
                    </Col>
                </Row>
                <Space size={[8, 16]} wrap>
                    {cardGeneration}
                    <Card
                        key="generalAndDominant"
                        title="Général"
                        style={{ width: 300, height: 200 }}
                    >
                        <Form.Item
                            label="Vent dominant"
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.Group compact>
                                <Form.Item
                                    name={"ventDominant"}
                                    initialValue={
                                        utilitiesActu.getLastState().gameState
                                            .dominantVent
                                    }
                                    rules={[{ required: true }]}
                                    noStyle
                                >
                                    <Select
                                        disabled={!canBeModify}
                                        placeholder="Vent dominant"
                                        style={{ width: "110px" }}
                                    >
                                        {getSelectOptionsForVents()}
                                    </Select>
                                </Form.Item>
                                <Form.Item noStyle>
                                    <Button
                                        type="primary"
                                        disabled={!canBeModify}
                                        icon={<RedoOutlined />}
                                        onClick={onRandomVentDominant}
                                    ></Button>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                disabled={!canBeModify}
                                icon={<ArrowRightOutlined />}
                                onClick={onDecalageVent}
                                style={{ width: 150, marginBottom: 5 }}
                            >
                                Décaler les vents
                            </Button>
                            <Button
                                type="primary"
                                disabled={!canBeModify}
                                icon={<RedoOutlined />}
                                onClick={onRandomVent}
                                style={{ width: 150 }}
                            >
                                Vents aléatoires
                            </Button>
                        </Form.Item>
                    </Card>
                </Space>
            </Form>
        </>
    );
}
