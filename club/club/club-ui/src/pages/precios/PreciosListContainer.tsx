import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { Rest } from "utils/utils";
import UTILS from "../../utils/tableUtils"
import View from "./PreciosList";
import { notification } from "antd";
import PreciosFormContainer from "./PreciosFormContainer";
import ProductosDetailsModal from "pages/productos/ProductosDetailsModal";
import {ProductoServicesAmt} from "types/entities/Producto";
import PreciosDetails from "types/entities/Precios";
import PreciosCompareModalContainer from "./PreciosCompareModalContainer";



export interface IState {
	precios?: PreciosDetails[];
	loaded?: boolean;
    countData?: number;
	page?: number;
    limit?: number;
    highlightfilter?: string;
	modalCompareVisible?:boolean;
	modalCompareKey?: number;
	PreciosFormVisible?: boolean;
	PreciosFormKey?: number;
	PreciosDetailsVisible?:boolean;
	PreciosDetailsKey?: number;
	idPrecioSelected?:  React.ReactNode;
	namePrecioSelected?: string;
	namePrecioNameSet?:string;
	serviceAmt?: ProductoServicesAmt[],
	idPreciosSelected :number[],
	idGarantiaSelected?:  number;
}

class PreciosListContainer extends React.Component<WithTranslation, IState> {
    public state: IState = {
		idPreciosSelected: []
	};

    public componentDidMount() {
		this.loadData();
	}

    public render() {
        return (
            <>
                <View
					{...this.state}
					precios={this.state.precios}
					limit = {this.state.limit ? this.state.limit : 1}
                    highlightfilter={this.state.highlightfilter}
					countData={this.state.countData ? this.state.countData : 0}
					page={this.state.page ? this.state.page : 1}
					loadPreciosData={this.loadData}
					onClickEditPreciosForm={this.onClickEditProductosForm}
					onClickDetails={this.onClickDetails}
					onClickCompare={this.openCompareModal}
					setPrecioNameSet={this.setPrecioNameSet}
				/>

				<PreciosFormContainer
					key={this.state.PreciosFormKey}
					visible= {this.state.PreciosFormVisible}
					idPrecio={this.state.idPrecioSelected}
					namePrecio={this.state.namePrecioSelected}
					onClose={this.onCloseEditProductosForm}
				/>

				<ProductosDetailsModal 
					key={this.state.PreciosDetailsKey}
					visible={this.state.PreciosDetailsVisible}
					serviceAmt={this.state.serviceAmt}
					nameProductoSelected={this.state.namePrecioSelected}
					onCancel={this.closeDetailsModal}
					loadProductsData= {this.loadPrecios}
				/>

				<PreciosCompareModalContainer
					{...this.state}
					key={this.state.modalCompareKey}
					visible= {this.state.modalCompareVisible}
					onCancel={this.closeCompareModal}
					onChangePrecios={this.onChangePrecios}
				/>
            </>
        )
    };

    private loadData = (offset?: number, namePrecio?: string) => {
		if (offset) this.setState({page: offset});
		let limit = UTILS.calculatePageSizeForMainTableOther().limit;
		Rest<{ type: string, offset?:number, limit: number, filter?:string },
         {limit:number, offset:string, dataCount:string, data: PreciosDetails[]}>()
			.operation({
				type: "GetPreciosPaginated",
				limit: limit,
				offset: offset ? (offset - 1) * limit : 0,
				filter: namePrecio
			})
			.then((response) => {
				this.setState({ precios: response.data, countData: Number(response.dataCount), limit: response.limit});
			});
	};

	private loadPrecios = () => {
		Rest<{ type: string, idPrecio: number[]},
         ProductoServicesAmt[]>()
			.operation({
				type: "GetServiciosByIdPrecio",
				idPrecio: [Number(this.state.idPrecioSelected)]
			})
			.then((response) => {
				this.setState({ serviceAmt: response, PreciosDetailsVisible: true});
			});
	};

	private onClickEditProductosForm = (idPrecioSelected?: React.ReactNode, namePrecioSelected?: string) => {
		this.setState({
			PreciosFormVisible: true,
			PreciosFormKey: new Date().getTime(),
			idPrecioSelected: idPrecioSelected,
			namePrecioSelected: namePrecioSelected,
		});
	};

	private onCloseEditProductosForm = (save: boolean) => {
		this.setState(
			{
				PreciosFormVisible: false,
				idPrecioSelected: undefined,
				namePrecioSelected: undefined,
			},
			() => {
				if (save) {
					notification["success"]({
						message: this.props.t("titles:actionPerformed"),
					});
					this.loadData(this.state.page, this.state.namePrecioNameSet);
				}
			}
		);
	};

	private onClickDetails  = (idPrecioSelected?: React.ReactNode, namePrecioSelected?: string) => {
		this.setState({
			idPrecioSelected: idPrecioSelected,
			namePrecioSelected: namePrecioSelected,
		},
		() => this.loadPrecios()
		);
	};

	private closeDetailsModal = () => {
		this.setState({
			PreciosDetailsVisible: undefined,
			idPrecioSelected: undefined,
			namePrecioSelected: undefined,
		},
			() => this.loadData(this.state.page, this.state.namePrecioNameSet)
		);
	};

	private openCompareModal = (idPrecioSelected?: number, namePrecioSelected?: string, idGarantia?:number) => {
		this.setState({
			modalCompareVisible: true,
			modalCompareKey: new Date().getTime(),
			idPrecioSelected: idPrecioSelected,
			namePrecioSelected: namePrecioSelected,
			idPreciosSelected: [Number(idPrecioSelected)],
			idGarantiaSelected:idGarantia
		});
	};

	private closeCompareModal = () => {
		this.setState({
			modalCompareVisible: undefined,
			idPrecioSelected: undefined,
			namePrecioSelected: undefined,
			idPreciosSelected: [],
			idGarantiaSelected: undefined
		},
			() => this.loadData(this.state.page, this.state.namePrecioNameSet)
		);
	};

	private onChangePrecios = (idPreciosSelected: number[]) => {
		this.setState({
			idPreciosSelected: idPreciosSelected
		});  
    };

	private setPrecioNameSet = (precioName?: string) => {
		this.setState({
			namePrecioNameSet: precioName
		});
	};

}

export default withTranslation("preciosList")(PreciosListContainer);