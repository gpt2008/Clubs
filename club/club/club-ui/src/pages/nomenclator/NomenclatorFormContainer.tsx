import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import View from "./NomenclatorForm";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import ActDetails from "types/entities/Actos";
import { IState as IStateContainer } from "./NomenclatorListContainer";

interface IProps {
	visible?: boolean;
    onChangeSpeciality: (idSpecialitySelected?: number) => void;
    onChangeSubspeciality: (idSubspecialitySelected?: number) => void;
    onChangeAct: (idActSelected?: number) => void;
    onClose: (save: boolean) => void;
    check: () => void;
    modal: boolean;
	idSpeciality?: number;
	idSubspeciality?: number;
	idAct?: number;
}
export interface IState {
	errorFields: FormErrorField[];
	loaded?: boolean;
    specialities?: SpecialityDetails[];
    subspecialities?: SubspecialityDetails[];
    acts?: ActDetails[];
}

class NomenclatorFormContainer extends React.Component<WithTranslation & IProps & IStateContainer, IState> {
	public state: IState = {
		loaded: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadSpecialityData();
		}
	}

	public render() {
		return this.state.loaded ? (
			<View
				{...this.state}
				visible={this.props.visible}
                idSpeciality={this.props.idSpeciality ? this.props.idSpeciality: this.props.idSubspecialitySelected}
                idSubspeciality={this.props.idSubspeciality ? this.props.idSubspeciality: this.props.idSubspecialitySelected}
                idAct={this.props.idAct ? this.props.idAct: this.props.idActSelected}
                nameSpeciality={this.props.nameSpecialitySelected}
                nameSubspeciality={this.props.nameSubspecialitySelected}
                nameAct={this.props.nameActSelected}
                onfilterOptionsSpeciality={this.filterOptionsSpeciality}
                onChangeSpeciality = {this.props.onChangeSpeciality}
                onfilterOptionsSubspeciality={this.filterOptionsSubspeciality}
                onChangeSubspeciality = {this.props.onChangeSubspeciality}
                onfilterOptionsAct={this.filterOptionsAct}
                onChangeAct = {this.props.onChangeAct}
				onCancel={() => this.props.onClose(false)}
				onSubmit={this.props.check}
                modal={this.props.modal}
			/>
		) : (
			<></>
		);
	}

    private loadSpecialityData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idSpeciality?: number }, any>()
			.operation({
				type: "GetEspecialidades",
                filter: inputValue,
				idSpeciality: this.props.idSpeciality ? this.props.idSpeciality: this.props.idSpecialitySelected
			})
			.then((response) => {
				this.setState({
					specialities: response,
				});
                if(!inputValue){
                    this.loadSubspecialityData();
                }
			});
	};

    private filterOptionsSpeciality =  (inputValue: string) => {
        if (inputValue !== "") {
			this.loadSpecialityData(inputValue);
		}
        else{
            this.loadSpecialityData();
        }
    };

    private loadSubspecialityData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idSubspeciality?:number }, any>()
			.operation({
				type: "GetSubespecialidades",
                filter: inputValue,
				idSubspeciality: this.props.idSubspecialitySelectedSet ? this.props.idSubspecialitySelectedSet: this.props.idSubspecialitySelected
			})
			.then((response) => {
				this.setState({
					subspecialities: response,
				});
                if(!inputValue){
                    this.loadActData();
                }
			});
	};

    private filterOptionsSubspeciality =  (inputValue: string) => {
        if (inputValue !== "") {
			this.loadSubspecialityData(inputValue);
		}
        else{
            this.loadSpecialityData();
        }
    };
    
    private loadActData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idAct?: number}, any>()
			.operation({
				type: "GetActos",
                filter: inputValue,
				idAct: this.props.idActSelectedSet ? this.props.idActSelectedSet: this.props.idActSelected
			})
			.then((response) => {
				this.setState({
					acts: response,
					loaded: true,
				});
			});
	};

    private filterOptionsAct =  (inputValue: string) => {
        if (inputValue !== "") {
			this.loadActData(inputValue);
		}
        else{
            this.loadActData();
        }
    };

}

export default withTranslation("nomenclatorForm")(NomenclatorFormContainer);
