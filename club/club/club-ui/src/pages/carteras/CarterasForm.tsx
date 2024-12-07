import {Form, FormInstance, Modal, Input, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import SpecialitiesDropdown from "components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SpecialityDetails from "types/entities/Especialidad";

interface IProps {
	visible?: boolean;
	idCartera?: number;
	nameCartera?: string;
  nameGarantia?: string;
  speciality: SpecialityDetails[];
  idGarantia?: number;
  filterOptions: (inputValue: string) => void;
  onChangeSearch: (idGarantia?: number) => void;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
}

const CarteraForm = (props: IProps) => {
	const { t } = useTranslation(["carterasForm"]);
	const [form] = Form.useForm();

	const initialValues = {
		key: props.idCartera,
		nameCartera: props.nameCartera,
    idGarantia: props.idGarantia
	};

  useEffect(() => {
    form.setFieldValue("nameGarantia", props.idGarantia)
  },[props.idGarantia]);

	return (
    <Modal
      title={
        props.nameCartera
          ? t("editCarteraTitle", {
              NameCartera: props.nameCartera,
            })
          : t("newCarteraTitle")
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
        <Form.Item label={t("nameLabel")} name="nameCartera" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item label={t("nameGarantiaLabel")} name="nameGarantia" rules={[{ required: true }]}>
          <SpecialitiesDropdown
              idSpecialitySelected={props.idGarantia}
              specialities={props.speciality}
              filterOptions={props.filterOptions}
              onChangeSearch={props.onChangeSearch}
            />
        </Form.Item>
      </Form>
    </Modal>
  );
};


export default CarteraForm;