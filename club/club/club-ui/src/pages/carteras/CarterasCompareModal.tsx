import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./CarterasCompareModalContainer";
import { Modal, Table, Form, Space, Button, TableColumnsType, Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ActDetails from "types/entities/Actos";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import CarterasDropdown from "components/filterDropdowns/carterasDropdown/CarterasDropDown";
import CarterasDetails, { ComparisonRecord } from "types/entities/Carteras";
import ProductosFilter from "pages/productos/ProductosFilter";

interface IProps {
    visible?: boolean;
    loadCompasison?: boolean;
	nameCarteraSelected?:string;
	idCarterasSelected?: number[];
    carteras?: CarterasDetails[];
    serviceAmt?: ComparisonRecord[];
    specialities?: SpecialityDetails[];
	subspecialities?: SubspecialityDetails[];
	acts?: ActDetails[];
    onfilterOptionsCarteras: (inputValue: string) => void;
    onChangeCartera: (idCarteraSelected: number[]) => void;

    onFinish: () => void;
	onCancel: () => void;
    loadCarterasData: () => void;

    onChangeSpeciality?: (idSpecialitySelected?: number) => void;
    onChangeSubspeciality?: (idSubspecialitySelected?: number) => void;
    onChangeAct?: (idActSelected?: number) => void;
    onfilterOptionsSpeciality?: (inputValue: string) => void;
    onfilterOptionsSubspeciality?: (inputValue: string) => void;
    onfilterOptionsAct?: (inputValue: string) => void;
}


const CarterasCompareModal = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["carterasList"]);
    const [form] = Form.useForm();
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [nameCartera, setNameCartera] = useState<string|undefined>(undefined);

    const columns: TableColumnsType<ComparisonRecord> = [
        {
            title: t("nameActo"),
            dataIndex: "nameActo",
            key: "1",
            width: "50%",
            render: (_: any, record: ComparisonRecord) => {
                return <>
                    <div>
                        <strong>{t("nameEspecialidad")}: </strong>
                        {record.codeEspecialidad} - {record.nameEspecialidad}
                    </div>
					<div>
                        <strong>{t("nameSubespecialidad")}: </strong>
                        {record.codeSubespecialidad} - {record.nameSubespecialidad}
                    </div>
                    <div>
                        <strong>{t("nameActo")}:  </strong>
                        {record.codeActo} - {record.nameAct}
                    </div>
                </>;
            }
        }
    ];

    const filter = (value : any, record: ComparisonRecord, idProd: number) => {
        if (record.carteras[idProd]){
            return record.carteras[idProd].included === (value == 1 && true );
        }
        return value == 2;
    };

    const dynamicColumns = props.carteras ? props.carteras.map((carteraKey) => ({
        title: carteraKey.nameCartera,
        dataIndex: 'carteras',
        key: carteraKey.idCartera,
        filters: [
            { text: t("common:included"), value: 1 },
            { text: t("common:notIncluded"), value: 2 },
          ],
        render: (_: any, record: ComparisonRecord) => {
            const productData = record.carteras[carteraKey.idCartera];
            return productData ? (
                <>
                    <div>{productData.included && "Incluido"}</div>
                </>
            ) : (
                 <>
                    <div>{"No incluido"}</div>
                </>
            );
        },
        onFilter: (value : any, record: ComparisonRecord) =>
            filter(value, record, carteraKey.idCartera),
        })
    ) : [];

    const openDrawer = () => {
        setDrawerIsOpen(true);
    };
    
    const closeDrawer = () => {
        setDrawerIsOpen(false);
    };
    
    const finish = () => {
        form.setFieldValue("nameCartera", props.idCarterasSelected);
        form.validateFields();
        setDrawerIsOpen(false);
        props.onFinish();
    };

    // Combinar columnas estáticas y dinámicas
    const finalColumns = [...columns, ...dynamicColumns];

    return props.loadCompasison ? (
            <>
                <Modal
                    title={ "Comparador: " + (props.carteras && props.carteras.map((carteraKey) => " " + carteraKey.nameCartera ))}
                    open={props.loadedComparison || false}
                    onCancel={() => props.onCancel()}
                    onOk={() => props.onCancel()}
                    style={{ top: 40, height: "600px" }}
                    destroyOnClose
                    width={800}
                >
                    <>
                    
                        <div className="page--wrapper">
                            <div className="table-container" style={{"overflow": 'hidden'}}>
                                <div className="table-container__header" >
                                    <Space size="small" className="table-button-bar" >
                                        <Button onClick={openDrawer} className="filter-btn">
                                            <FontAwesomeIcon icon={faFilter} />
                                        </Button>
                                    </Space>
                                </div> 
                                <Drawer
                                    className="filters-drawer"
                                    open={drawerIsOpen}
                                    onClose={closeDrawer}
                                    width="300px"
                                    placement="left"
                                    getContainer={false}>
                                        <ProductosFilter 
                                            filterComparison={true}
                                            applyFilters={finish}
                                            setNameProduct={setNameCartera}
                                            specialities={props.specialities}
                                            subspecialities={props.subspecialities}
                                            acts={props.acts}
                                            onChangeSpeciality={props.onChangeSpeciality}
                                            onChangeSubspeciality={props.onChangeSubspeciality}
                                            onChangeAct={props.onChangeAct}
                                            onfilterOptionsSpeciality={props.onfilterOptionsSpeciality}
                                            onfilterOptionsSubspeciality={props.onfilterOptionsSubspeciality}
                                            onfilterOptionsAct={props.onfilterOptionsAct}
                                    />
                                </Drawer>
                                <Table
                                    className="table__custom-expandable-icon"
                                    style={{minHeight: "400px"}}
                                    columns={finalColumns}
                                    dataSource={props.serviceAmt}
                                />
                            </div>
                        </div>
                    </>
                </Modal>    
            </>
        ) : (
            <>
                <Modal
                title={ "Comparador"}
                open={props.visible || false}
                onCancel={() => props.onCancel()}
                onOk={finish}
                cancelText={t("buttons:cancel")}
                style={{ top: 40 }}
                destroyOnClose
                width={600}
                >
                    <Form layout="vertical" form={form} size="large">
                        <Form.Item label={t("nameCartera")} name="nameCartera" rules={[{ required: true}]}>
                        <CarterasDropdown
                                idCarterasSelected={props.idCarterasSelected}
                                carteras={props.carteras}
                                filterOptions={props.onfilterOptionsCarteras}
                                onChangeSearch={props.onChangeCartera}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
    );
};

export default CarterasCompareModal;
