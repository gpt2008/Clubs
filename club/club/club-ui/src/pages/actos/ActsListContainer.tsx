import { notification } from "antd";
import _ from "lodash";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import ActDetails from "types/entities/Actos";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./ActsList";
import ActFormContainer from "./ActsFormContainer";
import ActRemoveConfirmation from "./ActsRemoveConfirmation"

export interface IState {
	acts?: ActDetails[];
	loaded?: boolean;
	actFormVisible?: boolean;
	actFormKey?: number;
	formConfigClosingPeriodVisible?: boolean;
	formConfigClosingPeriodKey?: number;
	idActSelected?: number;
	codeActSelected?: string;
	nameActSelected?: string;
	forceReloadTimestamp?: number;
	highlightfilter?: string;
    countData?: number;
	page?: number;
    limit?: number;
	removeActKey?: number;
	removeActVisible?: boolean;
}

class ActsListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					acts={this.state.acts}
					limit = {this.state.limit ? this.state.limit : 1}
					highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadActsData={this.loadData}
					onClickEditActForm={this.onClickEditActForm}
					onClickRemoveAct= {this.onClickRemoveAct}
				/>
				<ActFormContainer
					key={this.state.actFormKey}
					visible= {this.state.actFormVisible}
					idAct={this.state.idActSelected}
					codeAct={this.state.codeActSelected}
					nameAct={this.state.nameActSelected}
					onClose={this.onCloseEditActForm}
				/>

				<ActRemoveConfirmation
					key={this.state.removeActKey}
					nameAct={this.state.nameActSelected}
					visible={this.state.removeActVisible}
					onClose={this.onCloseRemoveAct}
					removeAct={this.removeAct}
				/>

            </>
        )
    };

    private loadData = (offset?: number, nameAct?: string, codeAct?: string) => {
		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, filter?:string, codeAct?: string },
         {limit:number, offset:string, dataCount:string, data: ActDetails[]}>()
			.operation({
				type: "SelectActos",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				filter: nameAct,
				codeAct: codeAct
			})
			.then((response) => {
				this.setState({ acts: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private removeAct = () => {
		Rest<{ type: string; idAct: number }, any>()
			.operation({
				type: "DeleteAct",
				idAct: this.state.idActSelected!,
			})
			.then(() => {
				this.onCloseRemoveAct(true);
			});
	};

	private onClickRemoveAct = (idActSelected: number, nameActSelected: string) => {
		this.setState({
			idActSelected: idActSelected,
			nameActSelected: nameActSelected,
			removeActVisible: true,
			removeActKey: new Date().getTime(),
		});
	};

	private onCloseRemoveAct = (save: boolean) => {
		this.setState(
			{
				idActSelected: undefined,
				nameActSelected: undefined,
				removeActVisible: false,
			},
			() => save && this.loadData()
		);
	};

    private onClickEditActForm = (idActSelected?: number, nameActSelected?: string, codeActSelected?: string) => {
		this.setState({
			actFormVisible: true,
			actFormKey: new Date().getTime(),
			idActSelected: idActSelected,
			codeActSelected: codeActSelected,
			nameActSelected: nameActSelected,
		});
	};

    private onCloseEditActForm = (save: boolean) => {
		this.setState(
			{
				actFormVisible: false,
				idActSelected: undefined,
				codeActSelected: undefined,
				nameActSelected: undefined,
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

}

export default withTranslation("actsList")(ActsListContainer);