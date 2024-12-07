import { notification } from "antd";
import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import SpecialityDetails from "types/entities/Especialidad";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./SpecialityList";
import SpecialityFormContainer from "./SpecialityFormContainer";
import SpecialityRemoveConfirmation from "./SpecialityRemoveConfirmation"

export interface IState {
	specialities?: SpecialityDetails[];
	loaded?: boolean;
	specialityFormVisible?: boolean;
	specialityFormKey?: number;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
	idSpecialitySelected?: number;
	codeSpecialitySelected?: string;
	nameSpecialitySelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	removeSpecialityKey?: number;
	removeSpecialityVisible?: boolean;
}

class SpecialityListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					specialities={this.state.specialities}
					limit = {this.state.limit ? this.state.limit : 1}
					highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadSpecialityData={this.loadData}
					onClickEditSpecialityForm={this.onClickEditSpecialityForm}
					onClickRemoveSpeciality= {this.onClickRemoveSpeciality}
				/>
				<SpecialityFormContainer
					key={this.state.specialityFormKey}
					visible= {this.state.specialityFormVisible}
					idSpeciality={this.state.idSpecialitySelected}
					codeSpeciality={this.state.codeSpecialitySelected}
					nameSpeciality={this.state.nameSpecialitySelected}
					onClose={this.onCloseEditSpecialityForm}
				/>

				<SpecialityRemoveConfirmation
					key={this.state.removeSpecialityKey}
					nameSpeciality={this.state.nameSpecialitySelected}
					visible={this.state.removeSpecialityVisible}
					onClose={this.onCloseRemoveSpeciality}
					removeSpeciality={this.removeSpeciality}
				/>

            </>
        )
    };

    private loadData = (offset?: number, nameSpeciality?: string) => {
		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, filter?:string },
         {limit:number, offset:string, dataCount:string, data: SpecialityDetails[]}>()
			.operation({
				type: "SelectEspecialidades",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				filter: nameSpeciality,
			})
			.then((response) => {
				this.setState({ specialities: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private removeSpeciality = () => {
		Rest<{ type: string; idSpeciality: number }, any>()
			.operation({
				type: "DeleteEspecialidad",
				idSpeciality: this.state.idSpecialitySelected!,
			})
			.then(() => {
				this.onCloseRemoveSpeciality(true);
			});
	};

	private onClickRemoveSpeciality = (idEspeciality: number, nameEspeciality: string) => {
		this.setState({
			idSpecialitySelected: idEspeciality,
			nameSpecialitySelected: nameEspeciality,
			removeSpecialityVisible: true,
			removeSpecialityKey: new Date().getTime(),
		});
	};

	private onCloseRemoveSpeciality = (save: boolean) => {
		this.setState(
			{
				idSpecialitySelected: undefined,
				nameSpecialitySelected: undefined,
				removeSpecialityVisible: false,
			},
			() => save && this.loadData(this.state.page)
		);
	};

    private onClickEditSpecialityForm = (idEspecialitySelected?: number, codeSpecialitySelected?: string, nameEspecialitySelected?: string) => {
		this.setState({
			specialityFormVisible: true,
			specialityFormKey: new Date().getTime(),
			idSpecialitySelected: idEspecialitySelected,
			codeSpecialitySelected: codeSpecialitySelected,
			nameSpecialitySelected: nameEspecialitySelected,
		});
	};

    private onCloseEditSpecialityForm = (save: boolean) => {
		this.setState(
			{
				specialityFormVisible: false,
				idSpecialitySelected: undefined,
				codeSpecialitySelected: undefined,
				nameSpecialitySelected: undefined,
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
}

export default withTranslation("specialityList")(SpecialityListContainer);