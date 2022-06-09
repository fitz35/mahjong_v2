import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, Row, Space } from "antd";
import { useState } from "react";
import { NumeroVent } from "../../../model/dataModel/dataUtils";
import {
    GameSearchParamsCalculator,
    SearchParamsJoueur,
} from "../../../model/gameStateCalculator/GameSearchParamsCalculator";
import {
    UtilitiesActualType,
    UtilitiesHistoryType,
} from "../../../model/gameStateCalculator/useCalculatorHistoricState";
import { getJoueurGenerator } from "../../../model/utils/joueursUtils";
import { MyLogger } from "../../../model/utils/logger";
import { JoueurCard } from "./JoueurCard";
import { SavePanel } from "./SavePanel";

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

    const onFinish = (values: formData) => {
        MyLogger.debug("values : ", values);
        message.success("Modification des joueurs effectuée");
        // get the old joueur
        const oldJoueur1 = utilitiesActu.getLastState().gameState.joueur1;
        const oldJoueur2 = utilitiesActu.getLastState().gameState.joueur2;
        const oldJoueur3 = utilitiesActu.getLastState().gameState.joueur3;
        const oldJoueur4 = utilitiesActu.getLastState().gameState.joueur4;

        // update the calculator
        utilitiesActu.modifyJoueur(
            new SearchParamsJoueur(
                oldJoueur1.main,
                values.vent0,
                values.name0,
                oldJoueur1.points
            ),
            new SearchParamsJoueur(
                oldJoueur2.main,
                values.vent1,
                values.name1,
                oldJoueur2.points
            ),
            new SearchParamsJoueur(
                oldJoueur3.main,
                values.vent2,
                values.name2,
                oldJoueur3.points
            ),
            new SearchParamsJoueur(
                oldJoueur4.main,
                values.vent3,
                values.name3,
                oldJoueur4.points
            )
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

    // generation of the card for every player
    const cardGeneration = [];
    const iterator = getJoueurGenerator<
        SearchParamsJoueur,
        GameSearchParamsCalculator
    >(utilitiesActu.getLastState().gameState);
    for (const [joueur, i] of iterator) {
        if (joueur !== undefined) {
            cardGeneration.push(
                <JoueurCard
                    onChangeVent={checkManualyVent}
                    canBeModify={canBeModify}
                    joueur={joueur}
                    number={i}
                ></JoueurCard>
            );
        }
    }

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
                </Row>
                <Space size={[8, 16]} wrap>
                    {cardGeneration}

                    <SavePanel utilitiesActu={utilitiesActu}></SavePanel>
                </Space>
            </Form>
        </>
    );
}
