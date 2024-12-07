import { Button, Col, Form, Row, Input } from "antd";
import { useTranslation } from "react-i18next";
import NomenclatorFormContainer from "./NomenclatorFormContainer";
import { IProps as IState } from "./NomenclatorList";
import { IState as IStateContainer } from "./NomenclatorListContainer";


const NomenclatorFilter = (props: IStateContainer & IState) => {
	const [form] = Form.useForm();
	const { t } = useTranslation("subspecialityFilter");

	const resetFilters = () => {
		props.onChangeSpeciality(undefined);
		props.onChangeSubspeciality(undefined);
		props.onChangeAct(undefined);
		props.loadNomenclatorData!(0,undefined, undefined,undefined);
	};

	const apply = () => {
		props.loadNomenclatorData!(0,props.idSpecialitySelectedSet, props.idSubspecialitySelectedSet, props.idActSelectedSet);
	};
	

	return (
		<>
			<NomenclatorFormContainer
                onChangeSpeciality={props.onChangeSpeciality}
                onChangeSubspeciality={props.onChangeSubspeciality}
                onChangeAct={props.onChangeAct}
				onClose={props.onClose}
                check={props.check}
				modal={false}
				visible={true}
				idSpeciality={props.idSpecialitySelectedSet}
				idSubspeciality={props.idSubspecialitySelectedSet}
				idAct={props.idActSelectedSet}
			/> 
			<Row gutter={16}>
				<Col span={12}>
					<Button
						type="primary"
						block
						onClick={() =>
							apply()
						}>
						{t("apply")}
					</Button>
				</Col>
				<Col span={12}>
					<Button danger block onClick={resetFilters}>
						{t("reset")}
					</Button>
				</Col>
			</Row>
        </>
	);
};

export default NomenclatorFilter;