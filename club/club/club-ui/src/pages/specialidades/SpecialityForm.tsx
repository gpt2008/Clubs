import {Form, FormInstance, Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";

interface IProps {
	visible?: boolean;
	idSpeciality?: number;
  codeSpeciality?: String;
	nameSpeciality?: string;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
}

const SpecialityForm = (props: IProps) => {
	const { t } = useTranslation(["specialityForm"]);

	const [form] = Form.useForm();

	const initialValues = {
		key: props.idSpeciality,
    codeSpeciality: props.codeSpeciality,
		nameSpeciality: props.nameSpeciality,
	};

	return (
    <Modal
      title={
        props.nameSpeciality
          ? t("editSpecialityTitle", {
              NameEspecialidad: props.nameSpeciality,
            })
          : t("newSpecialityTitle")
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
        <Form.Item label={t("codeLabel")} name="codeSpeciality" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label={t("nameLabel")} name="nameSpeciality" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default SpecialityForm;
