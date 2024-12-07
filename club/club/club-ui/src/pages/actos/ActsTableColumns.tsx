import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space } from "antd";
import Highlighter from "react-highlight-words";

const tableColumns = (
	onClickEditActForm: (idActSelected?: number, nameActSelected?: string, codeActSelected?: string) => void,
	onClickRemoveACt: (idAct: number, nameAct: string) => void,
  highlightFilter?: string,
  highlightFilter2?: string
) => {

    return [
      {
        title: i18n.t("actsList:nameAct"),
        dataIndex: "nameAct",
        key: "0",
        width: "35%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameAct: string;}
        ) => (
          <>
            {highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={`${record.nameAct}`}></Highlighter>
						) : (
							`${record.nameAct}`
						)}
          </>
        ),
      },
      {
        title: i18n.t("actsList:codeAct"),
        dataIndex: "codeAct",
        key : "1",
        width: "35%",
        render : (
          _text: string,
          record:{ codeAct: string;}
        ) => (
          <>
            {highlightFilter2 ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter2]}
								autoEscape
								textToHighlight={`${record.codeAct}`}></Highlighter>
						) : (
							`${record.codeAct}`
						)}
          </>
        ),
      },
      {
        title: i18n.t("actsList:dateCreation"),
        dataIndex: "creationDate",
        key: "2",
        width: "35%",
        render: (_text: string, record: { creationDate: Date }) => (
          <>
            <span>{dayjs(record.creationDate).format("DD/MM/YY")}</span>
          </>
        ),
        align: "left" as AlignType,
      },
      {
        title: "",
        dataIndex: "",
        key: "3",
        render: (
          _text: string,
          record: { idAct: number; nameAct: string, codeAct: string }
        ) => (
          <>
            <Space size="small">
              <Tooltip title={i18n.t("actsList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditActForm(record.idAct, record.nameAct, record.codeAct)
                  }
                />
              </Tooltip>
              <Tooltip title={i18n.t("actsList:DeletionButton")}>
                <Button
                  type="primary"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
                  danger
                  onClick={() => onClickRemoveACt(record.idAct, record.nameAct)}
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