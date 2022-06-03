import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { InvalidSearchParamException } from "../../error/user/InvalidSearchParamException";
import { defaultGameSearchParamsCalculator, GameSearchParamsCalculator } from "../../model/gameState/GameSearchParamsCalculator";
import { MahjongPiecesPannel } from "./MahjongPiecesPannel";
import { Mains } from "./Mains";
import { convertUrlSearchParamsInGameParamsCalculator } from "./GameStateParams";
import { GlobalCulatorState } from "../../model/gameState/GlobalCalculatorState";
import { UserException } from "../../error/user/UserException";

interface CustomCalculatorProps {
    isInError? : UserException | undefined
}
/**
 * manage all the element at the screen for the calculator
 * @returns
 */
export const CustomCalculator = ({isInError = undefined} : CustomCalculatorProps ) => {
    const [calculatorState, setCalculatorState] = useState<
        GlobalCulatorState
    >(GlobalCulatorState.getDefault());
    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
        if(isInError !== undefined) {
            setCalculatorState(GlobalCulatorState.getDefault(isInError));
        }
        // charge the game with the parameters
        else if (searchParams.toString() != "") {
            const searchParamCalculate: GameSearchParamsCalculator | undefined =
                convertUrlSearchParamsInGameParamsCalculator(searchParams);
            setSearchParams("");
            if(searchParamCalculate != undefined) {
                setCalculatorState(new GlobalCulatorState(searchParamCalculate));
            }else{
                // charge default parameter and add error if the parameter is not valid
                const defaultParams : GameSearchParamsCalculator = defaultGameSearchParamsCalculator;
                setCalculatorState(new GlobalCulatorState(defaultParams, new InvalidSearchParamException()));
            }
        }
    }, [isInError, searchParams, setSearchParams]);

    if(calculatorState.isError()){
        calculatorState.getError()?.openNotification();
        setCalculatorState(GlobalCulatorState.copyWithoutError(calculatorState));
    }

    const gutterPropper = { xs: 8, sm: 16, md: 24, lg: 32 };

    return (
        <>
            <Row gutter={gutterPropper}>
                <Col span={3} offset={6}>
                </Col>
            </Row>
            <Row gutter={gutterPropper}>
                <Col className="gutter-row" span={8}>
                    {MahjongPiecesPannel()}
                </Col>
                <Col className="gutter-row" span={8}>
                    {Mains()}
                </Col>
            </Row>
        </>
    );
};
