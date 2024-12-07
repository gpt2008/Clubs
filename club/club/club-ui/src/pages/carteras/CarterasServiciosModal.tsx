import { Modal, Table, TableColumnsType, Space, Button } from "antd";
import {  faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import {CarterasServicios} from "types/entities/Carteras";

interface IProps {
    visible?: boolean;
	nameCarteraSelected?:string;
    carteraServicios?: CarterasServicios[];
	onClose: () => void;
    loadCarteraServiciosData: () => void;
}

const CarterasServiciosModal = (props: IProps) => {
	const { t } = useTranslation(["carterasList"]);

    const columns: TableColumnsType<CarterasServicios> = [
        {
            title: t("nameEspecialidad"),
            dataIndex: "nameEspecialidad",
            key: "nameEspecialidad",
            width: "25%",
            render : (
                _text: string,
                record:{codeEspecialidad:string, nameEspecialidad:string}
            ) => (
                <>
                    {record.codeEspecialidad} - {record.nameEspecialidad}
                </>
            )
           
        },
        {
            title: t("nameSubespecialidad"),
            dataIndex: "nameSubespecialidad",
            key: "nameSubespecialidad",
            width: "25%",
            render : (
                _text: string,
                record:{codeSubespecialidad:string, nameSubespecialidad:string}
            ) => (
                <>
                    {record.codeSubespecialidad} - {record.nameSubespecialidad}
                </>
            )
        },
        {
            title: t("codeActo")+ "-" + t("nameActo"),
            dataIndex: "codeActo",
            key: "codeActo",
            width: "50%",
            render : (
                _text: string,
                record:{codeActo:string, nameActo:string}
            ) => (
                <>
                    {record.codeActo} - {record.nameActo}
                </>
            )
        }
      ];

    return (
        <>
            <Modal
				title= {t("nameCartera") + ": " + props.nameCarteraSelected}
				style={{ top: 40 }}
				onOk={props.onClose}
				onCancel={props.onClose}
				open={props.visible}
				destroyOnClose
				width={800}
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
                                            props.loadCarteraServiciosData();
                                    }}
                                    dataSource={props.carteraServicios}
                                />
                            </div>
                        </div>
                    </>
            </Modal>
        </>
    );
};

export default CarterasServiciosModal;
