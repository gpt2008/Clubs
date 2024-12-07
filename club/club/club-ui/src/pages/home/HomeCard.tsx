import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "antd";
import React from "react";

interface IProps {
    color: string;
    title: string;
    value: number | string;
    icon: IconDefinition;
    onClick: () => void;
    valueType?: string;
}

const HomeCard = (props: IProps) => {

    return (
        <Row align='middle' justify='center' className='home-card' style={{backgroundColor: props.color}} onClick={props.onClick}>
            <Col span={12}>
                <FontAwesomeIcon className='card-icon' icon={props.icon} />
            </Col>
            <Col span={12} className='card-info'>
                <Row className='card-title'>{props.title}</Row>
                <Row className='card-value' wrap={false} align={'bottom'} justify={'end'}>
                    <Col>{props.value}</Col>
                    {props.valueType && <Col className='card-value-type'>{props.valueType}</Col>}
                </Row>
            </Col>
        </Row>
    );

}

export default HomeCard;