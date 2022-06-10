import { Collapse } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { InvalidSearchParamException } from "../../error/user/InvalidSearchParamException";
import {
    MancheCalculatorState,
    getGameSearchParamsCalculatorKey,
} from "../../model/gameStateCalculator/MancheCalculatorState";
import { MainsPanel } from "./mainPanel/MainsPanel";
import { convertUrlSearchParamsInGameParamsCalculator } from "./GameStateParams";
import { GlobalCulatorState } from "../../model/gameStateCalculator/GlobalCalculatorState";
import { UserException } from "../../error/user/UserException";
import { ParamPanel } from "./paramPanel/ParamPanel";
import { useCalculatorHistoricState } from "../../model/gameStateCalculator/useCalculatorHistoricState";
import { MyLogger } from "../../model/utils/logger";
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
            MyLogger.debug("test");
            const searchParamCalculate: MancheCalculatorState | undefined =
                convertUrlSearchParamsInGameParamsCalculator(searchParams);
            searchParams.delete(getGameSearchParamsCalculatorKey());

            setSearchParams(searchParams);
            if (searchParamCalculate != undefined) {
                utilitiesHisto.addHistoricState(
                    new GlobalCulatorState(searchParamCalculate)
                );
            } else {
                // charge default parameter and add error if the parameter is not valid
                const defaultParams: MancheCalculatorState = JSON.parse("");
                utilitiesHisto.addHistoricState(
                    new GlobalCulatorState(
                        defaultParams,
                        new InvalidSearchParamException()
                    )
                );
            }
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
