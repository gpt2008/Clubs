import {Form, FormInstance, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";

interface IProps {
	visible?: boolean;
	idPrecio?: React.ReactNode;
	namePrecio?: string;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
}

const PreciosForm = (props: IProps) => {
	const { t } = useTranslation(["preciosForm"]);

	const [form] = Form.useForm();

	const initialValues = {
		key: props.idPrecio,
		namePrecio: props.namePrecio,
	};

	return (
    <Modal
      title={
        props.namePrecio
          ? t("editPreciosTitle", {
              NamePrecio: props.namePrecio,
            })
          : t("newPreciosTitle")
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
        <Form.Item label={t("nameLabel")} name="namePrecio" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default PreciosForm;