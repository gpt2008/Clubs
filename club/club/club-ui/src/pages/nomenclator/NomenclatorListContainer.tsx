import { notification } from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import NomenclatorDetails from "types/entities/Nomenclator";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./NomenclatorList";
import NomenclatorFormContainer from "./NomenclatorFormContainer";
import NomenclatorRemoveConfirmation from "./NomenclatorRemoveConfirmation"
import NomenclatorActivateConfirmation from "./NomenclatorActiveConfirmation"
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import ActDetails from "types/entities/Actos";

export interface IState {
	nomenclators?: NomenclatorDetails[];
	specialities?: SpecialityDetails[];
	subspecialities?: SubspecialityDetails[];
	acts?: ActDetails[];
	loaded?: boolean;
	nomenclatorFormVisible?: boolean;
	nomenclatorFormKey?: number;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
    idSpecialitySelected?: number;
    idSubspecialitySelected?: number;
    idActSelected?: number;
    idSpecialitySelectedSet?: number;
    idSubspecialitySelectedSet?: number;
    idActSelectedSet?: number;
    nameSpecialitySelected?: string;
    nameSubspecialitySelected?: string;
    nameActSelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	removeNomenclatorKey?: number;
	removeNomenclatorVisible?: boolean;
	activateNomenclatorKey?: number;
	activateNomenclatorVisible?: boolean;
}

class NomenclatorListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {};

    public componentDidMount() {
		this.loadData();
	}
    
    public render() {
        return (
            <>
                <View
					{...this.state}
					nomenclators={this.state.nomenclators}
					limit = {this.state.limit ? this.state.limit : 1}
					highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadNomenclatorData={this.loadData}
					onClickEditNomenclatorForm={this.onClickEditNomenclatorForm}
					onClickRemoveNomenclator= {this.onClickRemoveNomenclator}
					onClickActivateNomenclator= {this.onClickActivateNomenclator}
                    onChangeSpeciality={this.onChangeSpeciality}
                    onChangeSubspeciality={this.onChangeSubspeciality}
                    onChangeAct={this.onChangeAct}
					onClose={this.onCloseEditNomenclatorForm}
					check={this.check}
				/>

                <NomenclatorFormContainer
                    {...this.state}
					key={this.state.nomenclatorFormKey}
					visible= {this.state.nomenclatorFormVisible}
                    onChangeSpeciality={this.onChangeSpeciality}
                    onChangeSubspeciality={this.onChangeSubspeciality}
                    onChangeAct={this.onChangeAct}
					onClose={this.onCloseEditNomenclatorForm}
                    check={this.check}
					modal={true}
					idSpeciality={this.state.idSpecialitySelectedSet}
					idSubspeciality={this.state.idSubspecialitySelectedSet}
					idAct={this.state.idActSelectedSet}
				/> 

				<NomenclatorRemoveConfirmation
					key={this.state.removeNomenclatorKey}
                    nameSpeciality={this.state.nameSpecialitySelected}
                    nameSubspeciality={this.state.nameSubspecialitySelected}
                    nameAct={this.state.nameActSelected}
					visible={this.state.removeNomenclatorVisible}
					onClose={this.onCloseRemoveNomenclator}
					removeNomenclator={this.removeNomenclator}
				/>

				<NomenclatorActivateConfirmation
					key={this.state.activateNomenclatorKey}
                    nameSpeciality={this.state.nameSpecialitySelected}
                    nameSubspeciality={this.state.nameSubspecialitySelected}
                    nameAct={this.state.nameActSelected}
					visible={this.state.activateNomenclatorVisible}
					onClose={this.onCloseActivateNomenclator}
					activateNomenclator={this.activateNomenclator}
				/>

            </>
        )
    };

    private loadData = (offset?: number, idSpeciality?: number, idSubspeciality?: number, idAct?:number) => {

		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, idSpeciality?:number, idSubspeciality?:number, idAct?:number },
         {limit:number, offset:string, dataCount:string, data: NomenclatorDetails[]}>()
			.operation({
				type: "SelectNomenclators",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				idSpeciality: idSpeciality,
                idSubspeciality: idSubspeciality,
                idAct: idAct
			})
			.then((response) => {
				this.setState({ nomenclators: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private check = () => {
		let speciality= this.state.idSpecialitySelectedSet ? this.state.idSpecialitySelectedSet : this.state.idSpecialitySelected;
        let subspeciality= this.state.idSubspecialitySelectedSet ? this.state.idSubspecialitySelectedSet : this.state.idSubspecialitySelected;
        let act = this.state.idActSelectedSet ? this.state.idActSelectedSet : this.state.idActSelected;
		Rest<{ type: string, idSpeciality?:number, idSubspeciality?:number, idAct?:number },
         	{ data: NomenclatorDetails[]}>()
			.operation({
				type: "GetNomenclator",
				idSpeciality: speciality,
                idSubspeciality: subspeciality,
                idAct: act
			})
			.then((response) => {
				if (!response){
					this.save(speciality, subspeciality, act);
				}
				else{
					this.onCloseEditNomenclatorFormError();
				}
			});
	};

	private save = async ( speciality?: number, subspeciality?: number, act?:number) => {
        if (speciality && subspeciality && act){
            Rest<
                {
                    type: string;
                    idSpeciality?: number;
                    idSubspeciality?: number;
                    idAct?: number;
                    idSpecialitySet?: number;
                    idSubspecialitySet?: number;
                    idActSet?: number;
                },
                any
            >()
                .operation({
                    type: this.state.nameSpecialitySelected && this.state.nameSubspecialitySelected && this.state.nameActSelected ? 
                        "EditNomenclator" : "NewNomenclator",
                    idSpeciality: this.state.idSpecialitySelected,
                    idSubspeciality: this.state.idSubspecialitySelected,
                    idAct: this.state.idActSelected,
                    idSpecialitySet: speciality,
                    idSubspecialitySet: subspeciality,
                    idActSet: act
                })
                .then((response) => {
                    this.onCloseEditNomenclatorForm(true);
                })
        }
	};

    private onChangeSpeciality = (idSpecialitySelected?: number) => {
        this.setState({
            idSpecialitySelectedSet: idSpecialitySelected
        })
    };

    private onChangeSubspeciality = (idSubspecialitySelected?: number) => {
        this.setState({
            idSubspecialitySelectedSet: idSubspecialitySelected
        })
    };

    private onChangeAct = (idActSelected?: number) => {
        this.setState({
            idActSelectedSet: idActSelected
        })
    };

	private removeNomenclator = () => {
		Rest<{ type: string; idSpeciality: number, idSubspeciality: number, idAct: number }, any>()
			.operation({
				type: "DeleteNomenclator",
				idSpeciality: this.state.idSpecialitySelected!,
                idSubspeciality: this.state.idSubspecialitySelected!,
                idAct: this.state.idActSelected!,
			})
			.then(() => {
				this.onCloseRemoveNomenclator(true);
			});
	};

	private onClickRemoveNomenclator = (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => {
		this.setState({
            idSpecialitySelected: idSpeciality,
			nameSpecialitySelected: nameSpeciality,
            idSubspecialitySelected: idSubspeciality,
			nameSubspecialitySelected: nameSubspeciality,
            idActSelected: idAct,
			nameActSelected: nameAct,
			removeNomenclatorVisible: true,
			removeNomenclatorKey: new Date().getTime(),
		});
	};

	private activateNomenclator = () => {
		Rest<{ type: string; idSpeciality: number, idSubspeciality: number, idAct: number }, any>()
			.operation({
				type: "ActivateNomenclator",
				idSpeciality: this.state.idSpecialitySelected!,
                idSubspeciality: this.state.idSubspecialitySelected!,
                idAct: this.state.idActSelected!,
			})
			.then(() => {
				this.onCloseActivateNomenclator(true);
			});
	};

	private onClickActivateNomenclator = (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => {
		this.setState({
            idSpecialitySelected: idSpeciality,
			nameSpecialitySelected: nameSpeciality,
            idSubspecialitySelected: idSubspeciality,
			nameSubspecialitySelected: nameSubspeciality,
            idActSelected: idAct,
			nameActSelected: nameAct,
			activateNomenclatorVisible: true,
			activateNomenclatorKey: new Date().getTime(),
		});
	};

	private onCloseRemoveNomenclator = (save: boolean) => {
		this.setState(
			{
                idSpecialitySelected: undefined,
                nameSpecialitySelected: undefined,
                idSubspecialitySelected: undefined,
                nameSubspecialitySelected: undefined,
                idActSelected: undefined,
                nameActSelected: undefined,

				removeNomenclatorVisible: false,
			},
			() => save && this.loadData()
		);
	};

	private onCloseActivateNomenclator = (save: boolean) => {
		this.setState(
			{
                idSpecialitySelected: undefined,
                nameSpecialitySelected: undefined,
                idSubspecialitySelected: undefined,
                nameSubspecialitySelected: undefined,
                idActSelected: undefined,
                nameActSelected: undefined,

				activateNomenclatorVisible: false,
			},
			() => save && this.loadData()
		);
	};

    private onClickEditNomenclatorForm = (idSpecialitySelected?: number, idSubspecialitySelected?: number, idActSelected?: number, nameSpecialitySelected?: string, nameSubspecialitySelected?: string, nameActSelected?: string) => {
		this.setState({
			nomenclatorFormVisible: true,
			nomenclatorFormKey: new Date().getTime(),
            idSpecialitySelected: idSpecialitySelected,
            nameSpecialitySelected: nameSpecialitySelected,
            idSubspecialitySelected: idSubspecialitySelected,
            nameSubspecialitySelected: nameSubspecialitySelected,
            idActSelected: idActSelected,
            nameActSelected: nameActSelected,
		});
	};

    private onCloseEditNomenclatorForm = (save: boolean) => {
		this.setState(
			{
				nomenclatorFormVisible: false,
                idSpecialitySelected: undefined,
                nameSpecialitySelected: undefined,
                idSubspecialitySelected: undefined,
                nameSubspecialitySelected: undefined,
                idActSelected: undefined,
                nameActSelected: undefined,
                idSpecialitySelectedSet: undefined,
                idSubspecialitySelectedSet: undefined,
                idActSelectedSet: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData();
				}
			}
		);
	};

	private onCloseEditNomenclatorFormError = () => {
		notification["error"]({
			message: this.props.t("titles:error"),
		});
	};

}

export default withTranslation("nomenclatorList")(NomenclatorListContainer);