import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import { IState as IStateContainer } from "./CarterasListContainer";
import { notification } from "antd";
import ActDetails from "types/entities/Actos";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import View from "./CarterasCompareModal";
import Carteras, {ComparisonRecord} from "types/entities/Carteras";

interface IProps {
	visible?: boolean;
    onChangeCartera: (idCarteraSelected: number[]) => void;
	onCancel: () => void;
}

export interface IState {
	errorFields: FormErrorField[];
	loaded?: boolean;
    loadedComparison?: boolean;
	carteras?: Carteras[];

    serviceAmt?: ComparisonRecord[];
    idSpecialitySelected?: number;
    idSubspecialitySelected?: number;
    idActSelected?: number;
    specialities?: SpecialityDetails[];
    subspecialities?: SubspecialityDetails[];
    acts?: ActDetails[];
}


class CarterasCompareModalContainer extends React.Component<WithTranslation & IProps & IStateContainer, IState> {
	public state: IState = {
		loaded: false,
        loadedComparison: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadCarterasData();
		}
	}

	public render() {
		return this.state.loaded ? (
                <View
                    {...this.state}
                    visible={this.props.visible}
                    loadCompasison= {this.state.loadedComparison}
                    nameCarteraSelected={this.props.nameCarterasSelected}
                    specialities={this.state.specialities}
                    subspecialities={this.state.subspecialities}
                    acts={this.state.acts}
                    idCarterasSelected={this.props.idCarterasSelected}
                    onfilterOptionsCarteras={this.filterOptionsCarteras}
                    onChangeCartera={this.props.onChangeCartera}
                    onFinish={this.onFinish}
                    onCancel={this.onCancel}
                    loadCarterasData= {this.loadCarterasData}
                    onChangeSpeciality={this.onChangeSpeciality}
                    onChangeSubspeciality={this.onChangeSubspeciality}
                    onChangeAct={this.onChangeAct}
                    onfilterOptionsSpeciality={this.loadSpecialityData}
                    onfilterOptionsSubspeciality={this.loadSubspecialityData}
                    onfilterOptionsAct={this.loadActData}
                />
		    ) : (
			<></>
		    );
	}

    private onCancel = () => { 
        this.setState({
            loadedComparison: false
        });
        this.props.onCancel();
    }

    private sortedData = (comparisonRecords: ComparisonRecord[]) => {
        return comparisonRecords.sort((a, b) => {
        // Comparar por nameEspecialidad
        if (a.nameEspecialidad < b.nameEspecialidad) return -1;
        if (a.nameEspecialidad > b.nameEspecialidad) return 1;
      
        // Si nameEspecialidad es igual, comparar por nameSubespecialidad
        if (a.nameSubespecialidad < b.nameSubespecialidad) return -1;
        if (a.nameSubespecialidad > b.nameSubespecialidad) return 1;
      
        // Si nameSubespecialidad es igual, comparar por nameAct
        if (a.nameAct < b.nameAct) return -1;
        if (a.nameAct > b.nameAct) return 1;

        // Si nameAct es igual, comparar por codeActo
        if (a.codeActo < b.codeActo) return -1;
        if (a.codeActo > b.codeActo) return 1;

        // Si todos son iguales
        return 0;
      })
    };

    private onFinish = () => {
        if (this.props.idCarterasSelected.length > 1){
            Rest<{ type: string; idCarterasSelected: number[],idSpeciality?:number, idSubspeciality?: number, idAct?: number}, {carteras:Carteras[],data:ComparisonRecord[]}>()
            .operation({
            type: "GetCarterasComparison",
            idCarterasSelected: this.props.idCarterasSelected,
            idSpeciality: this.state.idSpecialitySelected,
            idSubspeciality: this.state.idSubspecialitySelected,
            idAct: this.state.idActSelected,
        })
        .then((response) => {
            this.setState({
                serviceAmt: this.sortedData(response.data),
                carteras: response.carteras,
                loadedComparison: true,
            });
            this.loadSpecialityData();
        });
        }
        else {
            if(this.props.idCarterasSelected.length <= 1){
                notification["error"]({
                    message: this.props.t("titles:notenoughvalues"),
                });
            }
        }
        
    }

    private loadCarterasData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string}, Carteras[]>()
			.operation({
				type: "GetCarteras",
                filter: inputValue,
			})
			.then((response) => {
				this.setState({
					carteras: response,
					loaded: true,
			    });
		    });
	};

    private filterOptionsCarteras =  (inputValue: string) => {
        if (inputValue !== "") {
			this.loadCarterasData(inputValue);
		}
        else{
            this.loadCarterasData();
        }
    };

    private onChangeSpeciality = (idSpecialitySelected?: number) => {
        this.setState({
            idSpecialitySelected: idSpecialitySelected
        })
    };

    private onChangeSubspeciality = (idSubspecialitySelected?: number) => {
        this.setState({
            idSubspecialitySelected: idSubspecialitySelected
        })
    };

    private onChangeAct = (idActSelected?: number) => {
        this.setState({
            idActSelected: idActSelected
        })
    };

    private loadSpecialityData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idSpeciality?: number }, SpecialityDetails[]>()
			.operation({
				type: "GetEspecialidadesFromPrices",
                filter: inputValue,
				idSpeciality: this.state.idSpecialitySelected,
			})
			.then((response) => {
				this.setState({
					specialities: response,
				});
                this.loadSubspecialityData();
			});
	};

    private loadSubspecialityData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idSpeciality?: number }, SubspecialityDetails[]>()
			.operation({
				type: "GetSubespecialidadesFromPrices",
                filter: inputValue,
				idSpeciality: this.state.idSpecialitySelected,
			})
			.then((response) => {
				this.setState({
					subspecialities: response,
				});
                this.loadActData();
			});
	};

    private loadActData = (inputValue?:string) => {
		Rest<{ type: string; filter?: string, idSpeciality?: number}, ActDetails[]>()
			.operation({
				type: "GetActosFromPrices",
                filter: inputValue,
				idSpeciality: this.state.idSpecialitySelected,
			})
			.then((response) => {
				this.setState({
					acts: response,
				});
			});
	};
}

export default withTranslation("carterasList")(CarterasCompareModalContainer);
