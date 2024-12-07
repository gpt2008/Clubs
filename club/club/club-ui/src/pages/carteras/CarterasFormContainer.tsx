import React from "react";

import { FormInstance } from "antd/es/form/Form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./CarterasForm";
import {IState as IStateContainer} from "./CarterasListContainer";
import SpecialityDetails from "types/entities/Especialidad";

interface IProps {
	visible?: boolean;
	idCartera?: number;
	nameCartera?: string;
	nameGarantia?: string;
	speciality: SpecialityDetails[];
	filterOptions: (inputValue: string) => void;
	onChangeSearch: (idGarantia?: number) => void;
	onClose: (save: boolean) => void;
}
export interface IState {
    errorFields: FormErrorField[];
	loaded?: boolean;
	speciality: SpecialityDetails[];
}

class CarteraFormContainer extends React.Component<WithTranslation & IProps & IStateContainer> {
	public state: IState = {
        loaded: false,
		errorFields: [],
		speciality: []
	};

	public componentDidMount() {
		this.setState({
            loaded: true,
    	});
	}
	
	public render() {
		return this.state.loaded ? (
			<View
				visible={this.props.visible}
				idCartera={this.props.idCartera}
				nameCartera={this.props.nameCartera}
                nameGarantia={this.props.nameGarantia}
				speciality={this.props.speciality}
				filterOptions={this.props.filterOptions}
				onChangeSearch={this.props.onChangeSearch}
				idGarantia={this.props.idGarantiaSelectedSet ? this.props.idGarantiaSelectedSet : this.props.idGarantiaSelected}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.validateAndSave}
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
                    idCartera?: number;
                    nameCartera?:string;
                    idEspecialidad?: number;
                },
                any
                >()
                .operation({
                    type: this.props.idCartera ? "EditCartera" : "NewCartera",
                    idCartera: this.props.idCartera,
                    nameCartera: values.nameCartera,
                    idEspecialidad: values.nameGarantia
                })
                .then(() => this.props.onClose(true));
		
	};
}

export default withTranslation("carterasForm")(CarteraFormContainer);