import React from "react";
import { FormInstance } from "antd/es/form/Form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./SubspecialityForm";
import {IState as IStateContainer} from "./SubspecialityListContainer";

interface IProps {
	onClose: (save: boolean) => void;
	filterOptions: (inputValue: string) => void;
	onChangeSearch: (idSpeciality?: number) => void;
}
export interface IState {
    errorFields: FormErrorField[];
	loaded?: boolean;
}

class SubspecialityFormContainer extends React.Component<WithTranslation & IProps & IStateContainer> {
	public state: IState = {
        loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		this.setState({
            loaded: true,
        });
	}
	
	public render() {
		return this.state.loaded ? (
			<View
				visible={this.props.subspecialityFormVisible}
				idSubspeciality={this.props.idSubspecialitySelected}
				codeSubspeciality={this.props.codeSubspeciality}
				nameSubspeciality={this.props.nameSubspecialitySelected}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
				idSpeciality={this.props.idSpecialitySelectedSet ? this.props.idSpecialitySelectedSet : this.props.idSpecialitySelected}
				nameSpeciality={this.props.nameSubspecialitySelected}
				specialities={this.props.specialities}
				filterOptions={this.props.filterOptions}
				onChangeSearch={this.props.onChangeSearch}
			/>
		) : (
			<></>
		);
	}

	private validateAndSave = (form: FormInstance) => {
		form
			.validateFields()
			.then((values) => {
				this.internalValidation(values, true);
			})
			.catch((info) => {
				this.internalValidation(info.values, false);
			});
	};

	private internalValidation = (values: Store, formValidationSucceded: boolean) => {
		this.validate(values)?.then((errors) => {
			if (formValidationSucceded && (!errors || errors.length === 0)) {
				this.save(values);
			} else {
				this.setState({ errorFields: errors });
			}
		});
	};

	private validate = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];
			resolve(errors);
		});
	};

	private save = async (values: Store) => {
		Rest<
			{
				type: string;
				idSubspeciality?: number;
				codeSubspeciality?: string;
				nameSubspeciality?: string;
				idSpeciality?: number;
			},
			any
		>()
			.operation({
				type: this.props.idSubspecialitySelected ? "EditSubspeciality" : "NewSubspeciality",
				idSubspeciality: this.props.idSubspecialitySelected,
				codeSubspeciality: values.codeSubspeciality,
				nameSubspeciality: values.nameSubspeciality,
				idSpeciality: this.props.idSpecialitySelectedSet ? this.props.idSpecialitySelectedSet : this.props.idSpecialitySelected
			})
			.then(() => this.props.onClose(true));
		
	};
}

export default withTranslation("subspecialityForm")(SubspecialityFormContainer);
