import { Collapse } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainsPanel } from "./mainPanel/MainsPanel";
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
    // have already load the search params (no need to reload it)
    const [utilitiesActu, utilitiesHisto] = useCalculatorHistoricState();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (isInError !== undefined) {
            /// if we have an error, we reset the calculator
            utilitiesHisto.addHistoricState(
                GlobalCulatorState.getDefault(isInError)
            );
        }
        if (utilitiesActu.getLastState().isError()) {
            utilitiesActu.getLastState().getError()?.openNotification();
            utilitiesActu.removeError();
        }
    }, [
        isInError,
        searchParams,
        setSearchParams,
        utilitiesActu,
        utilitiesHisto,
    ]);

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
