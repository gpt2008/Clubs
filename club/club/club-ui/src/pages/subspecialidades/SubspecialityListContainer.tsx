import { notification } from "antd";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./SubspecialityList";
import SubspecialityFormContainer from "./SubspecialityFormContainer";
import SubspecialityRemoveConfirmation from "./SubspecialityRemoveConfirmation"
import SpecialityDetails from "types/entities/Especialidad";

export interface IState {
	subspecialities?: SubspecialityDetails[];
	loaded?: boolean;
	subspecialityFormVisible?: boolean;
	subspecialityFormKey?: number;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
	idSubspecialitySelected?: number;
	codeSubspeciality?: string;
	nameSubspecialitySelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	removeSubspecialityKey?: number;
	removeSubspecialityVisible?: boolean;
	specialities?: SpecialityDetails[];
	idSpecialitySelected?: number;
	idSpecialitySelectedSet?: number;
	nameSpecialitySelected?: string;
}

class SubspecialityListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					{...this.state}
					limit = {this.state.limit ? this.state.limit : 1}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadSubspecialityData={this.loadData}
					onClickEditSubspecialityForm={this.onClickEditSubspecialityForm}
					onClickRemoveSubspeciality= {this.onClickRemoveSubspeciality}
					filterOptions={this.onfilterOptions}
					onChangeSearch={this.onChangeSubspeciality}

				/>
				<SubspecialityFormContainer
					{...this.state}
					key={this.state.subspecialityFormKey}
					onClose={this.onCloseEditSubspecialityForm}
					filterOptions={this.onfilterOptions}
					onChangeSearch={this.onChangeSubspeciality}
				/>

				<SubspecialityRemoveConfirmation
					key={this.state.removeSubspecialityKey}
					nameSubspeciality={this.state.nameSubspecialitySelected}
					visible={this.state.removeSubspecialityVisible}
					onClose={this.onCloseRemoveSubspeciality}
					removeSubspeciality={this.removeSubspeciality}
				/>

            </>
        )
    };

    private loadData = (offset?: number, nameSubspeciality?: string, idSpeciality?: number) => {
		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, filter?:string, idSpeciality?: number },
         {limit:number, offset:string, dataCount:string, data: SubspecialityDetails[]}>()
			.operation({
				type: "SelectSubespecialidades",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				filter: nameSubspeciality,
				idSpeciality: idSpeciality
			})
			.then((response) => {
				this.setState({ subspecialities: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private removeSubspeciality = () => {
		Rest<{ type: string; idSubspeciality: number, idSpeciality: number }, any>()
			.operation({
				type: "DeleteSubespecialidad",
				idSubspeciality: this.state.idSubspecialitySelected!,
				idSpeciality: this.state.idSpecialitySelected!
			})
			.then(() => {
				this.onCloseRemoveSubspeciality(true);
			});
	};

	private onClickRemoveSubspeciality = (idSubspeciality: number, nameSubspeciality: string, idSpecialitySelected?: number ) => {
		this.setState({
			idSubspecialitySelected: idSubspeciality,
			nameSubspecialitySelected: nameSubspeciality,
			removeSubspecialityVisible: true,
			removeSubspecialityKey: new Date().getTime(),
			idSpecialitySelected: idSpecialitySelected
		});
	};

	private onCloseRemoveSubspeciality = (save: boolean) => {
		this.setState(
			{
				idSubspecialitySelected: undefined,
				nameSubspecialitySelected: undefined,
				removeSubspecialityVisible: false,
				idSpecialitySelected: undefined
			},
			() => save && this.loadData(this.state.page)
		);
	};

    private onClickEditSubspecialityForm = (idSubspecialitySelected?: number,  codeSubspecialitySelected?: string, nameSubspecialitySelected?: string, idSpecialitySelected?: number, nameSpecialitySelected?: string) => {
		this.onfilterOptions(nameSpecialitySelected);
		this.setState({
			subspecialityFormVisible: true,
			subspecialityFormKey: new Date().getTime(),
			idSubspecialitySelected: idSubspecialitySelected,
			codeSubspeciality: codeSubspecialitySelected,
			nameSubspecialitySelected: nameSubspecialitySelected,
			idSpecialitySelected: idSpecialitySelected,
			nameSpecialitySelected: nameSpecialitySelected
		});
	};

    private onCloseEditSubspecialityForm = (save: boolean) => {
		this.setState(
			{
				subspecialityFormVisible: false,
				idSubspecialitySelected: undefined,
				codeSubspeciality: undefined,
				nameSubspecialitySelected: undefined,
				idSpecialitySelected: undefined,
				nameSpecialitySelected: undefined,
				idSpecialitySelectedSet: undefined
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

    private onfilterOptions = (inputValue?:string) => {
		Rest<{ type: string; filter?: string }, any>()
			.operation({
				type: "GetEspecialidades",
                filter: inputValue
			})
			.then((response) => {
				this.setState({
					specialities: response,
				});
			});
	};

	private onChangeSubspeciality = (idSpecialitySelected?: number) => {
        this.setState({
            idSpecialitySelectedSet: idSpecialitySelected
        })
    };

}

export default withTranslation("subspecialityList")(SubspecialityListContainer);