
import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space } from "antd";
import Highlighter from "react-highlight-words";

const tableColumns = (
	onClickEditSpecialityForm: (idSpecialitySelected?: number, codeSpecialitySelected?: string, nameSpecialitySelected?: string) => void,
	onClickRemoveSpeciality: (idSpeciality: number, nameSpeciality: string) => void,
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
            {highlightFilter ? (
							<Highlighter
								highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
								searchWords={[highlightFilter]}
								autoEscape
								textToHighlight={`${record.nameSpeciality}`}></Highlighter>
						) : (
							`${record.codeSpeciality} - ${record.nameSpeciality}`
						)}
          </>
        ),
      },
      {
        title: i18n.t("specialityList:dateCreation"),
        dataIndex: "creationDate",
        key: "1",
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
        key: "2",
        render: (
          _text: string,
          record: { idSpeciality: number; nameSpeciality: string, codeSpeciality: string }
        ) => (
          <>
            <Space size="small">
              <Tooltip title={i18n.t("specialityList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditSpecialityForm(record.idSpeciality, record.codeSpeciality.toString(), record.nameSpeciality)
                  }
                />
              </Tooltip>
              <Tooltip title={i18n.t("specialityList:DeletionButton")}>
                <Button
                  type="primary"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
                  danger
                  onClick={() => onClickRemoveSpeciality(record.idSpeciality, record.nameSpeciality)}
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