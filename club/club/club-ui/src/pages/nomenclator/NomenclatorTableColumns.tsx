import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space } from "antd";

const tableColumns = (
	onClickEditNomenclatorForm: (idSpecialitySelected?: number, idSubspecialitySelected?: number, idActSelected?: number, nameSpecialitySelected?: string, nameSubspecialitySelected?: string, nameActSelected?: string)=> void,
	onClickRemoveNomenclator: (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => void,
	onClickActivateNomenclator: (idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string) => void
) => {

    return [
      {
        title: i18n.t("specialityList:nameSpeciality"),
        dataIndex: "nameSpeciality",
        key: "0",
        width: "20%",
        align: "left" as AlignType,
        render: (_text: string, record: { codeSpeciality: number, nameSpeciality: string }) => (
          <>
            {record.codeSpeciality}-  {record.nameSpeciality}
          </>
        ),
      },
      {
        title: i18n.t("subspecialityList:nameSubspeciality"),
        dataIndex: "nameSubspeciality",
        key: "1",
        width: "20%",
        align: "left" as AlignType,
        render: (_text: string, record: { codeSubspeciality: number, nameSubspeciality: string }) => (
          <>
            {record.codeSubspeciality}-  {record.nameSubspeciality}
          </>
        ),
      },
      {
        title: i18n.t("actsList:nameAct"),
        dataIndex: "nameAct",
        key: "2",
        width: "25%",
        align: "left" as AlignType,
        render: (_text: string, record: { codeAct: string, nameAct: string }) => (
          <>
            {record.codeAct}-  {record.nameAct}
          </>
        ),
      },
      {
        title: i18n.t("nomenclatorList:dateCreation"),
        dataIndex: "creationDate",
        key: "3",
        width: "18%",
        render: (_text: string, record: { creationDate: Date }) => (
          <>
            <span>{dayjs(record.creationDate).format("DD/MM/YY")}</span>
          </>
        ),
        align: "left" as AlignType,
      },
      {
        title: i18n.t("nomenclatorList:dateDeletion"),
        dataIndex: "deletionDate",
        key: "4",
        width: "18%",
        render: (_text: string, record: { deletionDate: Date }) => (
          <>
            {record.deletionDate && <span>{dayjs(record.deletionDate).format("DD/MM/YY")}</span>}
          </>
        ),
        align: "left" as AlignType,
      },
      {
        title: "",
        dataIndex: "",
        key: "5",
        render: (
          _text: string,
          record: { idSpeciality: number, idSubspeciality: number, idAct: number, nameSpeciality: string, nameSubspeciality: string, nameAct: string, deletionDate: Date }
        ) => (
          <>
            <Space size="small">
              <Tooltip title={i18n.t("nomenclatorList:EditionButton")}>
                <Button
                  type="primary"
                  size="middle"
                  icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
                  onClick={() =>
                    onClickEditNomenclatorForm(record.idSpeciality, record.idSubspeciality, record.idAct, record.nameSpeciality, record.nameSubspeciality, record.nameAct)
                  }
                />
              </Tooltip>
              {!record.deletionDate ? (
                <Tooltip title={i18n.t("nomenclatorList:DeletionButton")}>
                  <Button
                    type="primary"
                    icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
                    danger
                    onClick={() => onClickRemoveNomenclator(record.idSpeciality, record.idSubspeciality, record.idAct, record.nameSpeciality, record.nameSubspeciality, record.nameAct)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={i18n.t("nomenclatorList:ActivateButton")}>
                  <Button
                    type="primary"
                    icon={TableIcons.getTableIcon(TableIcons.TableIcon.trashUndo)}
                    onClick={() => onClickActivateNomenclator(record.idSpeciality, record.idSubspeciality, record.idAct, record.nameSpeciality, record.nameSubspeciality, record.nameAct)}
                  />
                </Tooltip>
              )}
            </Space>
          </>
        ),
        align: "center" as AlignType,
      },
    ];

};

export default tableColumns;