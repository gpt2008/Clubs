import {Form, FormInstance, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import SpecialitiesDropdown from "../../components/filterDropdowns/specialitiesDropDown/SpecialitiesDropDown";
import SubspecialitiesDropdown from "../../components/filterDropdowns/subspecialitiesDropdown/SubspecialitiesDropDown"
import ActsDropdown from "../../components/filterDropdowns/actsDropdown/ActsDropDown";
import { IState as IStateContainer } from "./NomenclatorFormContainer";

interface IProps {
	visible?: boolean;
	idSpeciality?: number;
    idSubspeciality?: number;
    idAct?: number;
	nameSpeciality?: string;
	nameSubspeciality?: string;
	nameAct?: string;
    onfilterOptionsSpeciality: (inputValue: string) => void;
    onChangeSpeciality: (idSpecialitySelected?: number) => void;
    onfilterOptionsSubspeciality: (inputValue: string) => void;
    onChangeSubspeciality: (idSubspecialitySelected?: number) => void;
    onfilterOptionsAct: (inputValue: string) => void;
    onChangeAct: (idActSelected?: number) => void;
	onCancel: () => void;
	onSubmit: (form: FormInstance) => void;
    modal: boolean;
}

const NomenclatorForm = (props: IProps & IStateContainer) => {
	const { t } = useTranslation("nomenclatorForm");

	const [form] = Form.useForm();

	return props.modal ? (
        <Modal
        title={
            props.nameSpeciality && props.nameSubspeciality && props.nameAct
            ? t("editNomenclatorTitle", {
                nameSpeciality: props.nameSpeciality,
                nameSubspeciality: props.nameSubspeciality,
                nameAct: props.nameAct,
                })
            : t("newNomenclatorTitle")
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
        <Form layout="vertical" form={form} size="large">
            <Form.Item label={t("specialityForm:nameLabel")} name="nameSpeciality" rules={[{ required: true }]}>
                <SpecialitiesDropdown
                    idSpecialitySelected={props.idSpeciality}
                    specialities={props.specialities}
                    filterOptions={props.onfilterOptionsSpeciality}
                    onChangeSearch={props.onChangeSpeciality}
                />
            </Form.Item>
            <Form.Item label={t("subspecialityForm:nameLabel")} name="nameSubspeciality" rules={[{ required: true }]}>
                <SubspecialitiesDropdown
                    idSubspecialitySelected={props.idSubspeciality}
                    subspecialities={props.subspecialities}
                    filterOptions={props.onfilterOptionsSubspeciality}
                    onChangeSearch={props.onChangeSubspeciality}
                />
            </Form.Item>
            <Form.Item label={t("actsForm:nameLabel")} name="nameAct" rules={[{ required: true }]}>
                <ActsDropdown
                    idActSelected={props.idAct}
                    acts={props.acts}
                    filterOptions={props.onfilterOptionsAct}
                    onChangeSearch={props.onChangeAct}
                />
            </Form.Item>
        </Form>
    </Modal>
  ) : (
    <Form layout="vertical" form={form} size="large">
            <Form.Item label={t("specialityForm:nameLabel")} name="nameSpeciality" rules={[{ required: true }]}>
                <SpecialitiesDropdown
                    idSpecialitySelected={props.idSpeciality}
                    specialities={props.specialities}
                    filterOptions={props.onfilterOptionsSpeciality}
                    onChangeSearch={props.onChangeSpeciality}
                />
            </Form.Item>
            <Form.Item label={t("subspecialityForm:nameLabel")} name="nameSubspeciality" rules={[{ required: true }]}>
                <SubspecialitiesDropdown
                    idSubspecialitySelected={props.idSubspeciality}
                    subspecialities={props.subspecialities}
                    filterOptions={props.onfilterOptionsSubspeciality}
                    onChangeSearch={props.onChangeSubspeciality}
                />
            </Form.Item>
            <Form.Item label={t("actsForm:nameLabel")} name="nameAct" rules={[{ required: true }]}>
                <ActsDropdown
                    idActSelected={props.idAct}
                    acts={props.acts}
                    filterOptions={props.onfilterOptionsAct}
                    onChangeSearch={props.onChangeAct}
                />
            </Form.Item>
        </Form>
  );
};


export default NomenclatorForm;
