import { Col, Row } from "antd";
import { MahjongPiecesPannel } from "./MahjongPiecesPannel";
import { Mains } from "./Mains";

/**
 * manage all the element at the screen for the calculator
 * @returns 
 */
export const CustomCalculator = () => {




        return (
        <>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

                        <Col className="gutter-row" span={13}>
                                {MahjongPiecesPannel()}
                        </Col>
                        <Col className="gutter-row" span={11}>
                                {Mains()}
                        </Col>
                </Row>
                
        </>    
)
    

}