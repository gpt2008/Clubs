import React from "react";
import { FormInstance } from "antd/es/form/Form";
import { Store } from "antd/lib/form/interface";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./PreciosForm";

interface IProps {
	visible?: boolean;
	idPrecio?: React.ReactNode;
	namePrecio?: string;
	onClose: (save: boolean) => void;
}
export interface IState {
    errorFields: FormErrorField[];
	loaded?: boolean;
}

class PreciosFormContainer extends React.Component<WithTranslation & IProps> {
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
				visible={this.props.visible}
				idPrecio={this.props.idPrecio}
				namePrecio={this.props.namePrecio}
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
				idPrecio?: React.ReactNode;
                namePrecio?: string;
			},
			any
		>()
			.operation({
				type: this.props.idPrecio ? "EditPrecio" : "NewPrecio",
				idPrecio: this.props.idPrecio,
                namePrecio: values.namePrecio
			})
			.then(() => this.props.onClose(true));
	};
}

export default withTranslation("PreciosForm")(PreciosFormContainer);