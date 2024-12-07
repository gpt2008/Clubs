import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, Row } from "antd";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  title: string;
  onPlusClicked?: () => void;
  searchFilter?: (values: any) => void;
  extraContent?: ReactNode;
}

const PageOptions = (props: IProps) => {
  const { t } = useTranslation(["placeholders"]);
  const [form] = Form.useForm();

  return (
    <Row align="middle" gutter={32} className="page--options">
      {/*<Col>
        <FontAwesomeIcon className="page--back--icon" icon={faArrowLeft} />
  </Col>*/}
      <Col>
        <span className="page--title">{props.title}</span>
      </Col>
      {props.onPlusClicked && (
        <>
          <Col className="page--icon--inner">
            <Button
              className="page--icon"
              type="primary"
              shape="circle"
              onClick={() => props.onPlusClicked!()}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
          <Col className="page--icon--inner">
            <Button
              style={{ borderColor: "white" }}
              className="page--icon"
              shape="circle"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </Button>
          </Col>
        </>
      )}
      {props.searchFilter && (
        <Col>
          <Form
            form={form}
            onValuesChange={(values) => props.searchFilter!(values)}
            layout="horizontal"
          >
            <Form.Item name="filter" style={{ marginBottom: 0 }}>
              <Input
                className="page--filter"
                maxLength={256}
                placeholder={t("filterByName")}
                allowClear
              />
            </Form.Item>
          </Form>
        </Col>
      )}
      {props.extraContent}
    </Row>
  );
};

export default PageOptions;
