import { Card, Form, Input, Select } from "antd";
import { Famille, NumeroVent } from "../../../model/dataModel/dataUtils";
import { Piece } from "../../../model/dataModel/Piece";
import { SearchParamsJoueur } from "../../../model/gameStateCalculator/GameSearchParamsCalculator";

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
function getSelectOptions(): JSX.Element[] {
    const options: JSX.Element[] = [];
    const vents: NumeroVent[] = [
        NumeroVent.Nord,
        NumeroVent.Sud,
        NumeroVent.Est,
        NumeroVent.Ouest,
    ];
    for (let i = 0; i < vents.length; i++) {
        options.push(
            <Select.Option value={vents[i] as string}>
                {getFrVentName(vents[i])}
            </Select.Option>
        );
    }
    return options;
}

/**
 * get the props for the joueur card
 */
interface JoueurCardProps {
    joueur: SearchParamsJoueur;
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
                style={{ width: 300 }}
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
                        {getSelectOptions()}
                    </Select>
                </Form.Item>
            </Card>
        </>
    );
}
