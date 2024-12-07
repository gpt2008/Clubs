import { Modal, Table, TableColumnsType, Space, Button } from "antd";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { AlignType } from "rc-table/lib/interface";
import {ProductoServicesAmt} from "types/entities/Producto";

interface IProps {
    visible?: boolean;
	nameProductoSelected?: string;
	nameCarteraSelected?:string;
	namePrecioSelected?: string,
	idPadreSelected?: number;
    serviceAmt?: ProductoServicesAmt[];
	onCancel: (modal:string) => void;
    loadProductsData: () => void;
}

const ProductosDetailsModal = (props: IProps) => {
	const { t } = useTranslation(["productosList"]);

    const columns: TableColumnsType<ProductoServicesAmt> = [
        {
            title: t("nameEspecialidad") + "/" + t("nameSubespecialidad"),
            dataIndex: "nameEspecialidad",
            key: "nameEspecialidad",
            width: "35%",
            render : (
                _text: string,
                record:{nameEspecialidad:string, nameSubespecialidad:string, codeEspecialidad: string, codeSubespecialidad: string}
            ) => (
                <>
                    <div>
						<strong>{t("productosList:nameEspecialidad")}: </strong>
                        {record.codeEspecialidad} - {record.nameEspecialidad}
                    </div>
                    <div>
						<strong>{t("productosList:nameSubespecialidad")}: </strong>
                        {record.codeSubespecialidad} - {record.nameSubespecialidad}
                    </div>
                </>
            )
        },
        {
            title: t("codeActo")+ "-" + t("nameActo"),
            dataIndex: "codeActo",
            key: "codeActo",
            width: "35%",
            render : (
                _text: string,
                record:{codeActo:string, nameActo:string}
            ) => (
                <>
                    {record.codeActo} - {record.nameActo}
                </>
            )
        },
        {
            title: t("amtPrecio"),
            dataIndex: "amtPrecioMaximo",
            key: "amtPrecioMaximo",
            width: "20%",
            render : (
                _text: string,
                record:{amtPrecioMaximo:number, pctDescuento?:number, desDescuento?:string, amtPrecioMaximo2:number, pctDescuento2?:number, desDescuento2?:string}
            ) => (
                <>
                    <div>
                        {t("nameZone")} A: 
                            {" "}
                            {record.pctDescuento != null && (record.pctDescuento + "%" )}
                            {record.desDescuento != null  && record.desDescuento}
                        {record.pctDescuento == null  && record.desDescuento  == null && record.amtPrecioMaximo + "€"}
                    </div>
                    <div>
                        {t("nameZone")} B: 
                        {" "}
                            {record.pctDescuento2 != null && (record.pctDescuento2 + "%" )}
                            {record.desDescuento2 != null  && record.desDescuento2}
                        {record.pctDescuento2 == null  && record.desDescuento2  == null && record.amtPrecioMaximo2 + "€"}
                    </div>
                </>
            ),
            align: "left" as AlignType,
        }
      ];

    return (
        <>
            <Modal
            title={ "Baremos " + props.nameProductoSelected}
            open={props.visible || false}
            onCancel={() => props.onCancel("1")}
            onOk={() => props.onCancel("1")}
            cancelText={t("buttons:cancel")}
            style={{ top: 40 }}
            destroyOnClose
            width={1000}
            >
                <>
                <div className="page--wrapper">
                    <div className="table-container">
                        <div className="table-container__header">
                            <Space size="small" className="table-button-bar">
                                <Button className="filter-btn">
                                    <FontAwesomeIcon icon={faFilter} />
                                </Button>
                            </Space>
                        </div> 
                        <Table
                            className="table__custom-expandable-icon"
                            columns={columns}
                            onChange={(value:any) => {
                            if(value.current)
                                props.loadProductsData();
                            }}
                            dataSource={props.serviceAmt}
                        />
                        </div>
                    </div>
                </>
            </Modal>
        </>
    );
};

export default ProductosDetailsModal;
