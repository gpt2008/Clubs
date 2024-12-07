import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Menu, Space, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Highlighter from "react-highlight-words";

const tableColumns = (
  onClickEditPreciosForm: (idPrecioselected?:  React.ReactNode, namePrecioselected?: string) => void,
  onClickDetails: (idPrecioSelected?: React.ReactNode, namePrecioSelected?: string) => void,
	onClickCompare: (idPrecioSelected?: number, namePrecioSelected?: string, idGarantia?:number) => void,
  highlightFilter?: string,
) => {

  const onClick = (value: string,idPrecio: React.ReactNode, namePrecio: string, idGarantia:number) => {
    if (value == "1")
      onClickDetails(idPrecio, namePrecio);
    else 
      onClickCompare(Number(idPrecio), namePrecio, idGarantia);
  };

  const addOptions = (idPrecio: React.ReactNode, namePrecio: string, idGarantia:number) => {
    return (
      <Menu onClick={(e: any) => onClick(e.key, idPrecio, namePrecio, idGarantia)}>
        <Menu.Item key="1">{i18n.t("preciosList:details")}</Menu.Item>
        <Menu.Item key="2">{i18n.t("preciosList:compare")}</Menu.Item>
      </Menu>
    );
  };

    return [
      {
        title: i18n.t("preciosList:nameGarantia") + "/" + i18n.t("preciosList:namePrecio"),
        dataIndex: "nameGarantia",
        key: "0",
        width: "90%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameGarantia: string, idPadre:number}
        ) => (
          <>
            {record.idPadre == null ? (
					    <b>	{record.nameGarantia} </b>
            ) : (
              <>
                {TableIcons.getTableIcon(TableIcons.TableIcon.arrowRigh)}
                {highlightFilter ? (
                  <span style={{paddingLeft:10}}>
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
                        searchWords={[highlightFilter]}
                        autoEscape
                        textToHighlight={`${record.nameGarantia}`}>
                    </Highlighter>
                  </span>
                  ) : (
                    <span style={{paddingLeft:10}}>{record.nameGarantia}</span>
                  )}
              </>
            )}
          </>
        ),
      },
      {
        title: "",
        dataIndex: "",
        key: "1",
        render: (
          _text: string,
          record: { key: React.ReactNode, nameGarantia: string, idPadre:number}
        ) => (
          <>
            { record.idPadre != null && (
              <Space size="small">
              <Tooltip title={i18n.t("preciosList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditPreciosForm(record.key, record.nameGarantia)
                  }
                />
              </Tooltip>
              <div className="three-dots">
                <Dropdown overlay={ addOptions(record.key, record.nameGarantia, record.idPadre)} trigger={["hover"]}>
                  <Button type="primary" /*size="middle" shape="circle"*/ style={{width: "32px"}}>
                    <FontAwesomeIcon className="icon" icon={faEllipsis} />
                  </Button>
                </Dropdown>
            </div>
              
              </Space>
            )}
          </>
        ),
        align: "center" as AlignType,
      },
    ];

};

export default tableColumns;