import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space } from "antd";
import Highlighter from "react-highlight-words";

const tableColumns = (
	onClickEditSubspecialityForm: (idSubspecialitySelected?: number, codeSubspecialitySelected?: string, nameSubspecialitySelected?: string, idSpecialitySelected?: number, nameSpecialitySelected?: string) => void,
	onClickRemoveSubspeciality: (idSubspeciality: number, nameSubspeciality: string, idSpecialitySelected?: number) => void,
  highlightFilter?: string
) => {

    return [
      {
        title: i18n.t("specialityList:nameSpeciality"),
        dataIndex: "nameSpeciality",
        key: "0",
        width: "35%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameSpeciality: string, codeSpeciality: string}
        ) => (
          <>
							{record.codeSpeciality} - {record.nameSpeciality}
          </>
        ),
      },
      {
        title: i18n.t("subspecialityList:nameSubspeciality"),
        dataIndex: "nameSubspeciality",
        key: "1",
        width: "35%",
        align: "left" as AlignType,
        render : (
          _text: string,
          record:{ nameSubspeciality: string, codeSubspeciality: string}
        ) => (
          <>
            {highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={`${record.nameSubspeciality}`}></Highlighter>
						) : (
							`${record.codeSubspeciality} - ${record.nameSubspeciality}`
						)}
          </>
        ),
      },
      {
        title: i18n.t("subspecialityList:dateCreation"),
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
          record: { idSubspeciality: number; codeSubspeciality: string; nameSubspeciality: string, idSpeciality: number, nameSpeciality:string }
        ) => (
          <>
            <Space size="small">
              <Tooltip title={i18n.t("subspecialityList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditSubspecialityForm(record.idSubspeciality, record.codeSubspeciality, record.nameSubspeciality, record.idSpeciality, record.nameSpeciality)
                  }
                />
              </Tooltip>
              <Tooltip title={i18n.t("subspecialityList:DeletionButton")}>
                <Button
                  type="primary"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
                  danger
                  onClick={() => onClickRemoveSubspeciality(record.idSubspeciality, record.nameSubspeciality, record.idSpeciality)}
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