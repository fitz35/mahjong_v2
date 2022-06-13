import { Collapse } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { InvalidSearchParamException } from "../../error/user/InvalidSearchParamException";
import { MancheCalculatorState } from "../../model/gameStateCalculator/MancheCalculatorState";
import { MainsPanel } from "./mainPanel/MainsPanel";
import {
    convertUrlSearchParamsInHistoricCalculator,
    getGameSearchParamsCalculatorKey,
} from "../../model/gameStateCalculator/GameStateSearchParamsUtilities";
import { GlobalCulatorState } from "../../model/gameStateCalculator/GlobalCalculatorState";
import { UserException } from "../../error/user/UserException";
import { ParamPanel } from "./paramPanel/ParamPanel";
import { useCalculatorHistoricState } from "../../model/gameStateCalculator/useCalculatorHistoricState";
const { Panel } = Collapse;

interface CustomCalculatorProps {
    isInError?: UserException | undefined;
}
/**
 * manage all the element at the screen for the calculator
 * @returns
 */
export const CustomCalculator = ({
    isInError = undefined,
}: CustomCalculatorProps) => {
    const [utilitiesActu, utilitiesHisto] = useCalculatorHistoricState();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (isInError !== undefined) {
            /// if we have an error, we reset the calculator
            utilitiesHisto.addHistoricState(
                GlobalCulatorState.getDefault(isInError)
            );
        }
        // else, we charge the game with the parameters
        else if (searchParams.has(getGameSearchParamsCalculatorKey())) {
            let isSubscribed = true;

            const fetchData = async () => {
                const datas: MancheCalculatorState[] | undefined =
                    await convertUrlSearchParamsInHistoricCalculator(
                        searchParams
                    );
                if (isSubscribed) {
                    if (datas !== undefined) {
                        // we have found a new historic
                        utilitiesHisto.replaceHistoricState(
                            datas.map((data) => new GlobalCulatorState(data))
                        );
                    } else {
                        //else we had an error to the historic, and restore the default one
                        utilitiesHisto.addHistoricState(
                            GlobalCulatorState.getDefault(
                                new InvalidSearchParamException()
                            )
                        );
                    }
                }
                searchParams.delete(getGameSearchParamsCalculatorKey());
                setSearchParams(searchParams);
            };
            fetchData();
            return () => {
                isSubscribed = false;
            };
        }
    }, [isInError, searchParams, setSearchParams, utilitiesHisto]);

    if (utilitiesActu.getLastState().isError()) {
        utilitiesActu.getLastState().getError()?.openNotification();
        utilitiesActu.removeError();
    }

    return (
        <>
            <Collapse defaultActiveKey={["mains"]}>
                <Panel header="Paramètres" key={"param"}>
                    <ParamPanel
                        utilitiesActu={utilitiesActu}
                        utilitiesHistory={utilitiesHisto}
                    ></ParamPanel>
                </Panel>
                <Panel header="Mains" key={"mains"}>
                    <MainsPanel
                        utilitiesActu={utilitiesActu}
                        utilitiesHistory={utilitiesHisto}
                    ></MainsPanel>
                </Panel>
            </Collapse>
        </>
    );
};
