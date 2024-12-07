import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import FormErrorField from "utils/form/formErrorField";
import { Rest } from "utils/utils";
import { IState as IStateContainer } from "./PreciosListContainer";
import { notification } from "antd";
import ActDetails from "types/entities/Actos";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import View from "./PreciosCompareModal";
import PreciosDetails, { ComparisonRecord, Precios } from "types/entities/Precios";

interface IProps {
	visible?: boolean;
    onChangePrecios: (idCarteraSelected: number[]) => void;
	onCancel: () => void;
}

export interface IState {
	errorFields: FormErrorField[];
	loaded?: boolean;
    loadedComparison?: boolean;
	precios?: Precios[];
    serviceAmt?: ComparisonRecord[];
    
    idSpecialitySelected?: number;
    idSubspecialitySelected?: number;
    idActSelected?: number;
    specialities?: SpecialityDetails[];
    subspecialities?: SubspecialityDetails[];
    acts?: ActDetails[];
}


class PreciosCompareModalContainer extends React.Component<WithTranslation & IProps & IStateContainer, IState> {
	public state: IState = {
		loaded: false,
        loadedComparison: false,
		errorFields: [],
	};

	public componentDidMount() {
		if (this.props.visible) {
			this.loadPreciosData();
		}
	}

	public render() {
		return this.state.loaded ? (
                <View
                    {...this.state}
                    visible={this.props.visible}
                    loadCompasison= {this.state.loadedComparison}
                    namePrecioSelected={this.props.namePrecioSelected}
                    specialities={this.state.specialities}
                    subspecialities={this.state.subspecialities}
                    acts={this.state.acts}
                    idPreciosSelected={this.props.idPreciosSelected}
                    onfilterOptionsPrecios={this.filterOptionsPrecios}
                    onChangePrecios={this.props.onChangePrecios}
                    onFinish={this.onFinish}
                    onCancel={this.onCancel}
                    loadPreciosData= {this.loadPreciosData}
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
        if (this.props.idPreciosSelected.length > 1){
            Rest<{ type: string; idPreciosSelected: number[],idSpeciality?:number, idSubspeciality?: number, idAct?: number}, {precios:Precios[],data:ComparisonRecord[]}>()
            .operation({
            type: "GetPreciosComparison",
            idPreciosSelected: this.props.idPreciosSelected,
            idSpeciality: this.state.idSpecialitySelected,
            idSubspeciality: this.state.idSubspecialitySelected,
            idAct: this.state.idActSelected,
        })
        .then((response) => {
            this.setState({
                serviceAmt: this.sortedData(response.data),
                precios: response.precios,
                loadedComparison: true,
            });
            this.loadSpecialityData();
        });
        }
        else {
            if(this.props.idPreciosSelected.length <= 1){
                notification["error"]({
                    message: this.props.t("titles:notenoughvalues"),
                });
            }
        }
        
    }

    private loadPreciosData = (inputValue?:string) => {
		Rest<{ type: string; idCartera?: number; filter?: string, idPrecio?: number, idGarantia?: number}, Precios[]>()
			.operation({
				type: "GetPrecios",
                filter: inputValue,
                idPrecio: Number(this.props.idPrecioSelected),
                idGarantia: this.props.idGarantiaSelected
			})
			.then((response) => {
				this.setState({
					precios: response,
					loaded: true,
			    });
		    });
	};

    private filterOptionsPrecios =  (inputValue: string) => {
        if (inputValue !== "") {
			this.loadPreciosData(inputValue);
		}
        else{
            this.loadPreciosData();
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

export default withTranslation("preciosList")(PreciosCompareModalContainer);
