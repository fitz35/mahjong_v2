import { Collapse } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainsPanel } from "./mainPanel/MainsPanel";
import { GlobalCulatorState } from "../../model/gameStateCalculator/GlobalCalculatorState";
import { UserException } from "../../error/user/UserException";
import { ParamPanel } from "./paramPanel/ParamPanel";
import { useCalculatorHistoricState } from "../../model/gameStateCalculator/useCalculatorHistoricState";
import { MancheResultTab } from "./mancheResultTab/MancheResultTab";
import { ResponsiveLine } from "@nivo/line";
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
    const lineData: { id: string; data: { x: number; y: number }[] }[] = [
        {
            id: utilitiesActu.getLastState().gameState.joueur1.name,
            data: [],
        },
        {
            id: utilitiesActu.getLastState().gameState.joueur2.name,
            data: [],
        },
        {
            id: utilitiesActu.getLastState().gameState.joueur3.name,
            data: [],
        },
        {
            id: utilitiesActu.getLastState().gameState.joueur4.name,
            data: [],
        },
    ];

    for (let i = 0; i < utilitiesHisto.getHistoricLength() - 1; i++) {
        lineData[0].data.push({
            x: i + 1,
            y: utilitiesHisto.getHistoricState(i).gameState.joueur1.points,
        });
        lineData[1].data.push({
            x: i + 1,
            y: utilitiesHisto.getHistoricState(i).gameState.joueur2.points,
        });
        lineData[2].data.push({
            x: i + 1,
            y: utilitiesHisto.getHistoricState(i).gameState.joueur3.points,
        });
        lineData[3].data.push({
            x: i + 1,
            y: utilitiesHisto.getHistoricState(i).gameState.joueur4.points,
        });
        panels.push(
            <MancheResultTab
                key={i}
                mancheState={utilitiesHisto.getHistoricState(i).gameState}
                numberOfManche={i + 1}
            ></MancheResultTab>
        );
    }
    // get the last manche
    lineData[0].data.push({
        x: utilitiesHisto.getHistoricLength(),
        y: utilitiesActu.getLastState().gameState.joueur1.points,
    });
    lineData[1].data.push({
        x: utilitiesHisto.getHistoricLength(),
        y: utilitiesActu.getLastState().gameState.joueur2.points,
    });
    lineData[2].data.push({
        x: utilitiesHisto.getHistoricLength(),
        y: utilitiesActu.getLastState().gameState.joueur3.points,
    });
    lineData[3].data.push({
        x: utilitiesHisto.getHistoricLength(),
        y: utilitiesActu.getLastState().gameState.joueur4.points,
    });

    MyLogger.debug("lineData", lineData);

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
                    <div className="h-64">
                        <ResponsiveLine
                            data={lineData}
                            margin={{
                                top: 20,
                                right: 150,
                                bottom: 50,
                                left: 50,
                            }}
                            yScale={{
                                type: "linear",
                                min: "auto",
                                max: "auto",
                            }}
                            xScale={{
                                type: "linear",
                                min: "auto",
                                max: "auto",
                            }}
                            useMesh={true}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Manche",
                                legendOffset: 36,
                                legendPosition: "middle",
                                format: (e) => Math.floor(e) === e && e,
                            }}
                            axisLeft={{
                                tickSize: 1,
                                tickPadding: 3,
                                tickRotation: 0,
                                legend: "Points",
                                legendOffset: -40,
                                legendPosition: "middle",
                                format: (e) => Math.floor(e) === e && e,
                            }}
                            legends={[
                                {
                                    anchor: "bottom-right",
                                    direction: "column",
                                    justify: false,
                                    translateX: 170,
                                    itemWidth: 150,
                                    itemHeight: 20,
                                },
                            ]}
                            tooltip={({ point }) => (
                                <span>
                                    {point.data.y.toString() + " points"}
                                </span>
                            )}
                            colors={{ scheme: "category10" }}
                        />
                    </div>
                    {panels}
                </Panel>
            </Collapse>
        </>
    );
};
