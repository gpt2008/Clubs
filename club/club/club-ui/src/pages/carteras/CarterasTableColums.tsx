import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space, Menu, Dropdown } from "antd";
import Highlighter from "react-highlight-words";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const tableColumns = (
	currentPage: number,
  onClickEditCarteraForm: (idCarteraSelected?: number, nameCarteraSelected?: string, nameGarantiasSelected?:string,idGarantiaSelected?: number) => void,
  onClickDetails: (idCarteraSelected?: number, nameCarteraSelected?: string) => void,
  onClickCompare: (idCarteraSelected?: number, nameCarteraSelected?: string, idGarantiaSelected?: number, nameGarantiasSelected?:string) => void,
  highlightFilter?: string,
  highlightFilter2?: string,
) => {

  const onClick = (value: string,idCartera: number, nameCartera: string, idGarantia: number, nameGarantia:string) => {
    value == '1' ? onClickDetails(idCartera, nameCartera) :
      onClickCompare(idCartera, nameCartera, idGarantia, nameGarantia );
};

  const addOptions = (idCartera: number, nameCartera: string, idGarantia: number, nameGarantia:string) => {
    return (
      <Menu onClick={(e: any) => onClick(e.key, idCartera, nameCartera,idGarantia, nameGarantia)}>
        <Menu.Item key="1">{i18n.t("carterasList:details")}</Menu.Item>
        <Menu.Item key="2">{i18n.t("carterasList:compare")}</Menu.Item>
      </Menu>
    );
  };

    return [
      {
        title: i18n.t("carterasList:nameCartera"),
        dataIndex: "nameCartera",
        key: "0",
        width: "45%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameCartera: string;}
        ) => (
          <>
            {highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={`${record.nameCartera}`}></Highlighter>
						) : (
							`${record.nameCartera}`
						)}
          </>
        ),
      },
      {
        title: i18n.t("garantiasList:nameGarantia"),
        dataIndex: "nameEspecialidad",
        key: "0",
        width: "45%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameEspecialidad: string;}
        ) => (
          <>
            {highlightFilter2 ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter2]}
								autoEscape
								textToHighlight={`${record.nameEspecialidad}`}></Highlighter>
						) : (
							`${record.nameEspecialidad}`
						)}
          </>
        ),
      },
      {
        title: "",
        dataIndex: "",
        key: "3",
        render: (
          _text: string,
          record: { idCartera: number; nameCartera: string, idEspecialidad: number, nameEspecialidad: string}
        ) => (
          <>
            <Space size="small">
              <Tooltip title={i18n.t("carterasList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditCarteraForm(record.idCartera, record.nameCartera, record.nameEspecialidad, record.idEspecialidad)
                  }
                />
              </Tooltip>
              <div className="three-dots">
              <Tooltip title={i18n.t("carterasList:MoreButton")}>
                <Dropdown overlay={ addOptions(record.idCartera, record.nameCartera, record.idEspecialidad, record.nameEspecialidad)} trigger={["hover"]}>
                  <Button type="primary" /*size="middle" shape="circle"*/ style={{width: "32px"}}>  
                    <FontAwesomeIcon className="icon" icon={faEllipsis} />
                  </Button>
                </Dropdown>
              </Tooltip>
            </div>
              <Tooltip title={i18n.t("carterasList:DeletionButton")}>
                <Button
                  type="primary"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
                  danger
                />
              </Tooltip>
            </Space>
          </>
        ),
        align: "center" as AlignType,
      },
    ];

};

export default tableColumns;