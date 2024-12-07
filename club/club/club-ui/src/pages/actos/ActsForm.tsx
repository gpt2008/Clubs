import {Form, FormInstance, Modal, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";

interface IProps {
	visible?: boolean;
	idAct?: number;
  codeAct?: string;
	nameAct?: string;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
}

const ActForm = (props: IProps) => {
	const { t } = useTranslation(["actsForm"]);

	const [form] = Form.useForm();

	const initialValues = {
		key: props.idAct,
		nameAct: props.nameAct,
    codeAct: props.codeAct
	};

	return (
    <Modal
      title={
        props.nameAct
          ? t("editActTitle", {
              NameAct: props.nameAct,
            })
          : t("newActTitle")
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
        <Form.Item label={t("codeLabel")} name="codeAct" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label={t("nameLabel")} name="nameAct" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default ActForm;
