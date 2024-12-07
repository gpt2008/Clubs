import { notification } from "antd";
import _, { unset } from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import CarterasDetails from "types/entities/Carteras";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./CarterasList";
import CarterasFormContainer from "./CarterasFormContainer";
import CarteraRemoveConfirmation from "./CarteraRemoveConfiguration";
import CarterasServiciosModalContainer from "./CarterasServiciosModalContainer";
import CarterasCompareModalContainer from "./CarterasCompareModalContainer";
import SpecialityDetails from "types/entities/Especialidad";

export interface IState {
	carteras?: CarterasDetails[];
	speciality: SpecialityDetails[];
	loaded?: boolean;
	CarterasFormVisible?: boolean;
	CarterasFormKey?: number;
	carterasServiciosKey?: number;
	carterasServiciosVisible?: boolean;
	carterasCompareKey?: number;
	carterasCompareVisible?: boolean;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
	idCarteraSelected?: number;
	idGarantiaSelectedSet?: number;
	idGarantiaSelected?:number;
	nameCarterasSelected?: string;
    nameGarantiaSelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	removeCarterasKey?: number;
	removeCarterasVisible?: boolean;
	idCarterasSelected :number[];
}

class CarterasListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {
		speciality: [],
		idCarterasSelected: []
	};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					{...this.state}
					carteras={this.state.carteras}
					limit={this.state.limit ? this.state.limit : 1}
					highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadCarterasData={this.loadData}
					onClickEditCarteraForm={this.onClickEditCarterasForm}
					onClickRemoveCartera={this.onClickRemoveCarteras} 
					speciality={this.state.speciality}
					filterOptions = {this.onfilterOptions}
					onChangeSearch={this.onChangeGarantia}
					onClickDetails={this.onClickCarteraServicios}
					onClickCompare={this.onClickCarteraCompare}
				/>
				<CarterasFormContainer
					{...this.state}
					key={this.state.CarterasFormKey}
					visible= {this.state.CarterasFormVisible}
					idCartera={this.state.idCarteraSelected}
					speciality = {this.state.speciality}
					filterOptions = {this.onfilterOptions}
					nameCartera={this.state.nameCarterasSelected}
                    nameGarantia={this.state.nameGarantiaSelected}
					onClose={this.onCloseEditCarterasForm}
					onChangeSearch={this.onChangeGarantia}
				/>

				<CarteraRemoveConfirmation
					key={this.state.removeCarterasKey}
					nameCartera={this.state.nameCarterasSelected}
					visible={this.state.removeCarterasVisible}
					onClose={this.onCloseRemoveCarteras}
					removeCartera={this.removeCarteras}
				/>

				<CarterasServiciosModalContainer
					key={this.state.carterasServiciosKey}
					visible={this.state.carterasServiciosVisible}
					idCartera={this.state.idCarteraSelected}
					nameCartera={this.state.nameCarterasSelected}
					onClose={this.onCloseCarteraServicios}
				/>

				<CarterasCompareModalContainer
					{...this.state}
					key={this.state.carterasCompareKey}
					visible= {this.state.carterasCompareVisible}
					onCancel={this.onCloseCarteraCompare}
					onChangeCartera={this.onChangeCartera}
				/>
            </>
        )
    };

    private loadData = (offset?: number, nameCarteras?: string,idEspecialidad?:number) => {
		if (offset) this.setState({page: offset});
		Rest<{ type: string, offset?:number, limit: number, filter?:string, idEspecialidad?: number },
         {limit:number, offset:string, dataCount:string, data: CarterasDetails[]}>()
			.operation({
				type: "SelectCarteras",
				limit: UTILS.calculatePageSizeForMainTableOther().limit,
				offset: offset ? (offset - 1) * 10 : 0,
				filter: nameCarteras,
                idEspecialidad: idEspecialidad
			})
			.then((response) => {
				this.setState({ carteras: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private removeCarteras = () => {
		Rest<{ type: string; idCarteras: number }, any>()
			.operation({
				type: "DeleteCartera",
				idCarteras: this.state.idCarteraSelected!,
			})
			.then(() => {
				this.onCloseRemoveCarteras(true);
			});
	};

	private onfilterOptions = (inputValue?:string) => {
		Rest<{ type: string; filter?: string; idSpeciality?: number }, any>()
			.operation({
				type: "GetEspecialidades",
                filter: inputValue,
				idSpeciality: this.state.idGarantiaSelectedSet ? this.state.idGarantiaSelectedSet : this.state.idGarantiaSelected
			})
			.then((response) => {
				this.setState({
					speciality: response,
				});
			});
	};
    
	private onClickRemoveCarteras = (idCartera: number, nameCartera: string,idGarantiaSelected:number) => {
		this.setState({
			idCarteraSelected: idCartera,
			nameCarterasSelected: nameCartera,
			removeCarterasVisible: true,
			removeCarterasKey: new Date().getTime(),
			idGarantiaSelected:idGarantiaSelected
		});
	};

	private onCloseRemoveCarteras = (save: boolean) => {
		this.setState(
			{
				idCarteraSelected: undefined,
				nameCarterasSelected: undefined,
				removeCarterasVisible: false,
				idGarantiaSelected: undefined
			},
			() => save && this.loadData(this.state.page)
		);
	};

    private onClickEditCarterasForm = (idCarteraSelected?: number, nameCarteraSelected?: string, nameGarantiaSelected?:string,idGarantiaSelected?: number) => {
		this.setState({
			CarterasFormVisible: true,
			CarterasFormKey: new Date().getTime(),
			idCarteraSelected: idCarteraSelected,
			nameCarterasSelected: nameCarteraSelected,
            nameGarantiaSelected: nameGarantiaSelected,
			idGarantiaSelected: idGarantiaSelected
		},
		() => {
			this.onfilterOptions();
		});
		

	};

	private onChangeGarantia = (idGarantiaSelected?: number) => {
        this.setState({
            idGarantiaSelectedSet: idGarantiaSelected
        })
    };

	private onChangeCartera = (idCarteraSelected: number[]) => {
		this.setState({
			idCarterasSelected: idCarteraSelected
		});  
    };

    private onCloseEditCarterasForm = (save: boolean) => {
		this.setState(
			{
				CarterasFormVisible: false,
				idCarteraSelected: undefined,
				nameCarterasSelected: undefined,
                nameGarantiaSelected: undefined,
				idGarantiaSelected:undefined,
				idGarantiaSelectedSet:undefined
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData(this.state.page);
				}
			}
		);
	};

	private onClickCarteraServicios = (idCarteraSelected?: number, nameCarteraSelected?: string) => {
		this.setState({
			carterasServiciosVisible: true,
			carterasServiciosKey: new Date().getTime(),
			idCarteraSelected: idCarteraSelected,
			nameCarterasSelected: nameCarteraSelected,
		});
	};

	private onCloseCarteraServicios = () => {
		this.setState({
			carterasServiciosVisible: false,
			idCarteraSelected: undefined,
			nameCarterasSelected: undefined,
		});
	};

	private onClickCarteraCompare = (idCarteraSelected?: number, nameCarteraSelected?: string, idGarantiaSelected?: number, nameGarantiasSelected?:string) => {
		this.setState({
			carterasCompareVisible: true,
			carterasCompareKey: new Date().getTime(),
			idCarteraSelected: idCarteraSelected,
			nameCarterasSelected: nameCarteraSelected,
			idGarantiaSelected: idGarantiaSelected,
			nameGarantiaSelected: nameGarantiasSelected,
			idCarterasSelected: [Number(idCarteraSelected)]
		});
	};

	private onCloseCarteraCompare = () => {
		this.setState({
			carterasCompareVisible: false,
			idCarteraSelected: undefined,
			nameCarterasSelected: undefined,
			idGarantiaSelected: undefined,
			nameGarantiaSelected: undefined
		});
	};
}

export default withTranslation("carterasList")(CarterasListContainer);