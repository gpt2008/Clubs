import { useTranslation } from "react-i18next";
import { IState as IStateContainer } from "./PreciosCompareModalContainer";
import { Modal, Table, Form, Space, Button, TableColumnsType, Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ActDetails from "types/entities/Actos";
import SpecialityDetails from "types/entities/Especialidad";
import SubspecialityDetails from "types/entities/SubEspecialidad";
import ProductosFilter from "pages/productos/ProductosFilter";
import PreciosDetails, { ComparisonRecord, Precios } from "types/entities/Precios";
import PreciosDropdown from "components/filterDropdowns/preciosDrodown/PreciosDropDown";

interface IProps {
    visible?: boolean;
    loadCompasison?: boolean;
	namePrecioSelected?:string;
	idPreciosSelected?: number[];
    precios?: Precios[];
    serviceAmt?: ComparisonRecord[];

    specialities?: SpecialityDetails[];
	subspecialities?: SubspecialityDetails[];
	acts?: ActDetails[];
    onfilterOptionsPrecios: (inputValue: string) => void;
    onChangePrecios: (idPreciosSelected: number[]) => void;

    onFinish: () => void;
	onCancel: () => void;
    loadPreciosData: () => void;

    onChangeSpeciality?: (idSpecialitySelected?: number) => void;
    onChangeSubspeciality?: (idSubspecialitySelected?: number) => void;
    onChangeAct?: (idActSelected?: number) => void;
    onfilterOptionsSpeciality?: (inputValue: string) => void;
    onfilterOptionsSubspeciality?: (inputValue: string) => void;
    onfilterOptionsAct?: (inputValue: string) => void;
}


const PreciosCompareModal = (props: IProps & IStateContainer) => {
	const { t } = useTranslation(["preciosList"]);
    const [form] = Form.useForm();
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const [namePrecio, setNamePrecio] = useState<string|undefined>(undefined);

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
        if (record.precios[idProd]){
            return record.precios[idProd].included === (value == 1 && true );
        }
        return value == 2;
    };

    const dynamicColumns = props.precios ? props.precios.map((precioKey) => ({
        title: precioKey.namePrecio,
        dataIndex: 'precios',
        key: precioKey.idPrecio,
        filters: [
            { text: t("common:included"), value: 1 },
            { text: t("common:notIncluded"), value: 2 },
          ],
        render: (_: any, record: ComparisonRecord) => {
            const productData = record.precios[precioKey.idPrecio];
            return productData ? (
                <>
                    <div>{productData.included && "Incluido"}</div>
                    <div>
                        {productData.pctDescuento != null ? `${productData.pctDescuento}%` : 
                            productData.desDescuento != null ? `${productData.desDescuento}` : 
                                productData.precio != null ? `${productData.precio}€` :  "N/A"}
                    </div>
                </>
            ) : (
                 <>
                    <div>{"No incluido"}</div>
                    <div>{"-"}</div>
                </>
            );
        },
        onFilter: (value : any, record: ComparisonRecord) =>
            filter(value, record, precioKey.idPrecio),
        })
    ) : [];

    const openDrawer = () => {
        setDrawerIsOpen(true);
    };
    
    const closeDrawer = () => {
        setDrawerIsOpen(false);
    };
    
    const finish = () => {
        form.setFieldValue("namePrecio", props.idPreciosSelected);
        form.validateFields();
        setDrawerIsOpen(false);
        props.onFinish();
    };

    // Combinar columnas estáticas y dinámicas
    const finalColumns = [...columns, ...dynamicColumns];

    return props.loadCompasison ? (
            <>
                <Modal
                    title={ "Comparador: " + (props.precios && props.precios.map((precioKey) => " " + precioKey.namePrecio ))}
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
                                            setNameProduct={setNamePrecio}
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
                        <Form.Item label={t("namePrecio")} name="namePrecio" rules={[{ required: true}]}>
                            <PreciosDropdown
                                idPreciosSelected={props.idPreciosSelected}
                                precios={props.precios}
                                filterOptions={props.onfilterOptionsPrecios}
                                onChangeSearch={props.onChangePrecios}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
    );
};

export default PreciosCompareModal;
