import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Rest } from "utils/utils";
import FormErrorField from "utils/form/formErrorField";
import {CarterasServicios} from "types/entities/Carteras";
import View from "./CarterasServiciosModal";

interface IProps {
	idCartera?:number;
	nameCartera?: string;
	visible?: boolean;
	onClose: () => void;
}

export interface IState {
    errorFields: FormErrorField[];
	loaded?: boolean;
	carteraServicios?: CarterasServicios[];
}

class CarterasServiciosModalContainer extends React.Component<WithTranslation & IProps> {
    public state: IState = {
        loaded: false,
		errorFields: [],
	};

    public componentDidMount() {
		if (this.props.visible) {
			this.loadCarteraServicios();
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				visible={this.props.visible}
				nameCarteraSelected={this.props.nameCartera}
				carteraServicios={this.state.carteraServicios}
				onClose={this.props.onClose}
				loadCarteraServiciosData= {this.loadCarteraServicios}
			/>
		) : (
			<></>
		);
	}

    private loadCarteraServicios = () => {

        Rest<{ type: string, idCartera?: number[] }, CarterasServicios[]>()
            .operation({
                type: "GetCarteraServiciosByIdCartera",
                idCartera: this.props.idCartera ? [this.props.idCartera]: []
            })
            .then((response) => {
                this.setState({ carteraServicios: response, loaded:true});
            });
    };
}
export default withTranslation("carterasList")(CarterasServiciosModalContainer);