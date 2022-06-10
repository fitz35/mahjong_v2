import { Card, Form, Input, Select } from "antd";
import { NumeroVent } from "../../../model/dataModel/dataUtils";
import { JoueurCalculatorState } from "../../../model/gameStateCalculator/MancheCalculatorState";
import { getSelectOptionsForVents } from "./ParamPanel";

/**
 * get the props for the joueur card
 */
interface JoueurCardProps {
    joueur: JoueurCalculatorState;
    canBeModify: boolean;
    number: number;
    /**
     * the function to call when the vent is changed. Check the other vents and if they are the same, set the error and return true (ie : error)
     */
    onChangeVent: (newVent: NumeroVent, index: number) => boolean;
}

/**
 * manage the card of the joueur's param
 * @param param0 the joueur
 * @returns
 */
export function JoueurCard({
    joueur,
    canBeModify,
    number,
    onChangeVent,
}: JoueurCardProps) {
    return (
        <>
            <Card
                key={joueur.name}
                title={
                    <Form.Item
                        name={"name" + number}
                        rules={[{ required: true }]}
                        initialValue={joueur.name}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input disabled={!canBeModify} />
                    </Form.Item>
                }
                style={{ width: 300, height: 200 }}
            >
                <Form.Item
                    name={"vent" + number}
                    label="Vent"
                    initialValue={joueur.vent}
                    rules={[
                        { required: true },
                        {
                            validator: (_: unknown, value: NumeroVent) => {
                                if (onChangeVent(value, number)) {
                                    return Promise.reject(
                                        new Error("Vent identique")
                                    );
                                } else {
                                    return Promise.resolve();
                                }
                            },
                        },
                    ]}
                >
                    <Select
                        disabled={!canBeModify}
                        style={{ width: "100%" }}
                        placeholder="Choisir un vent"
                    >
                        {getSelectOptionsForVents()}
                    </Select>
                </Form.Item>
            </Card>
        </>
    );
}
