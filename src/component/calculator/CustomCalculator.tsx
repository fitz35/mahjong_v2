import { Collapse } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainsPanel } from "./mainPanel/MainsPanel";
import { GlobalCulatorState } from "../../model/gameStateCalculator/GlobalCalculatorState";
import { UserException } from "../../error/user/UserException";
import { ParamPanel } from "./paramPanel/ParamPanel";
import { useCalculatorHistoricState } from "../../model/gameStateCalculator/useCalculatorHistoricState";
import { MancheResultTab } from "./mancheResultTab/MancheResultTab";
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

    // display the historic
    const panels: JSX.Element[] = [];
    for (let i = 0; i < utilitiesHisto.getHistoricLength() - 1; i++) {
        panels.push(
            <MancheResultTab
                key={i}
                mancheState={utilitiesHisto.getHistoricState(i).gameState}
                numberOfManche={i + 1}
            ></MancheResultTab>
        );
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
                <Panel header="Historique" key={"historic"}>
                    {panels}
                </Panel>
            </Collapse>
        </>
    );
};
