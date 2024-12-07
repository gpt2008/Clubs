import {Form, FormInstance, Modal, Input } from "antd";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";
import SpecialitiesDropdown from "components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import SpecialityDetails from "types/entities/Especialidad";
import { useEffect } from "react";

interface IProps {
	visible?: boolean;
	idSubspeciality?: number;
  codeSubspeciality?: string;
	nameSubspeciality?: string;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
	idSpeciality?: number;
  nameSpeciality?: string;
  specialities?: SpecialityDetails[];
  filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
}

const SubspecialityForm = (props: IProps) => {
	const { t } = useTranslation(["subspecialityForm"]);

	const [form] = Form.useForm();

	const initialValues = {
		key: props.idSubspeciality,
    codeSubspeciality: props.codeSubspeciality,
		nameSubspeciality: props.nameSubspeciality,
    nameSpeciality: props.idSpeciality
	};

  useEffect(() => {form.setFieldValue("nameSpeciality", props.idSpeciality)},[props.idSpeciality]);

	return (
    <Modal
      title={
        props.nameSubspeciality
          ? t("editSubspecialityTitle", {
              NameSubspecialidad: props.nameSubspeciality,
            })
          : t("newSubspecialityTitle")
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
        
        <Form.Item label={t("nameSpeciality")} name="nameSpeciality" rules={[{required : true}]}>
          <SpecialitiesDropdown
            idSpecialitySelected={props.idSpeciality}
            specialities={props.specialities}
            filterOptions={props.filterOptions}
            onChangeSearch={props.onChangeSearch}
          />
        </Form.Item>
        <Form.Item label={t("codeLabel")} name="codeSubspeciality" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item label={t("nameLabel")} name="nameSubspeciality" rules={[{ required: true }]}>
          <TextArea rows={2}/>
        </Form.Item>

      </Form>
    </Modal>
  );
};


export default SubspecialityForm;
