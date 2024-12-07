import {Form, FormInstance, Modal, DatePicker } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";

interface IProps {
	visible?: boolean;
	dateFrom?: Date;
	dateTo?: Date;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
  onChangeDateFrom :(dateFrom: string)=> void;
  onChangeDateTo :(dateTo: string)=> void;
}

const InvoiceExportModal = (props: IProps) => {
	const { t } = useTranslation(["invoiceList"]);

	const [form] = Form.useForm();

	const initialValues = {
		dateFrom: props.dateFrom,
        dateTo: props.dateTo
	};

	return (
    <Modal
      title={
        t("export") + " " + t("title")
      }
      open={props.visible || false}
      onCancel={props.onCancel}
      onOk={() => props.onSubmit(form)}
      cancelText={t("buttons:cancel")}
      okText={t("buttons:save")}
      style={{ top: 40 }}
      destroyOnClose
      width={600}
    >
      <Form layout="vertical" form={form} size="large" initialValues={initialValues}>
        <Form.Item label={t("dateFrom")} name="dateFrom" rules={[{ required: true }]}>
            <DatePicker
              placeholder={t("selectDate")}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              onChange={(dayjs, dateString) =>
                props.onChangeDateFrom(dateString.toString())
				}
				/>
        </Form.Item>
        <Form.Item label={t("dateTo")} name="dateTo" rules={[{ required: true }]}>
          <DatePicker
            placeholder={t("selectDate")}
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            onChange={(dayjs, dateString) =>
              props.onChangeDateTo( dateString.toString())
            }
          />  
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default InvoiceExportModal;
