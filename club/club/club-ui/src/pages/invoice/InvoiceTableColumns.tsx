import dayjs from "dayjs";
import i18n from "i18n/i18n";
import { AlignType } from "rc-table/lib/interface";
import { TableIcons } from "utils/utils";
import { Button, Tooltip, Space } from "antd";
import Highlighter from "react-highlight-words";

const tableColumns = (
    onClickDownload: (idInvoice: number) => void,
    onClickRefund: (order:string) => void,
    highlightFilter?: string,
    highlightFilter2?: string,
) => {

    return [
        {
            title: i18n.t("invoiceList:codeInvoice"),
            dataIndex: "codeInvoice",
            key: "0",
            width: "15%",
            align: "left" as AlignType,
        },
        {
          title: i18n.t("invoiceList:typeinvoice"),
          dataIndex: "typeInvoice",
          key: "1",
          width: "10%",
          render: (_text: string, record: { typeInvoice: number }) => (
            <>
                {record.typeInvoice == 1 ? (
                  <span style={{color:"green"}} >{i18n.t("invoiceList:ordinaria")}</span>
                ) : (
                  <span style={{color:"red"}} >{i18n.t("invoiceList:abono")}</span>
                )}
            </>
            ),
            align: "left" as AlignType,
        },
        {
            title: i18n.t("invoiceList:dni"),
            dataIndex: "dni",
            key: "2",
            width: "15%",
            align: "left" as AlignType,
            render : (
              _text: string,
              record:{ dni: string;}
            ) => (
            <>
                {highlightFilter ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
                        searchWords={[highlightFilter]}
                        autoEscape
                        textToHighlight={`${record.dni}`}></Highlighter>
                        ) : (
                             `${record.dni}`
                        )}
            </>
            ),
            
          },
        {
            title: i18n.t("invoiceList:nameClient"),
            dataIndex: "nameClient",
            key: "3",
            width: "30%",
            align: "left" as AlignType,
            render : (
              _text: string,
              record:{ nameClient: string;}
            ) => (
            <>
                {highlightFilter2 ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: "#f8d19b", padding: 0 }}
                        searchWords={[highlightFilter2]}
                        autoEscape
                        textToHighlight={`${record.nameClient}`}></Highlighter>
                        ) : (
                             `${record.nameClient}`
                        )}
            </>
            ),
      },
      {
            title: i18n.t("invoiceList:expeditionDate"),
            dataIndex: "expeditionDate",
            key: "4",
            width: "20%",
            render: (_text: string, record: { expeditionDate: Date }) => (
            <>
                <span>{dayjs(record.expeditionDate).format("DD/MM/YY")}</span>
            </>
            ),
            align: "left" as AlignType,
      },
      {
            title: i18n.t("invoiceList:totalAmount"),
            dataIndex: "totalAmount",
            key: "5",
            width: "5%",
            align: "right" as AlignType,
       },
       
      {
        title: "",
        key: "6",
        align: "right" as AlignType,
        render: (
            _text: string,
            record: {idInvoice: number, order: string, typeInvoice: number, reembolsado: number}
          ) => (
            <>
              <Space size="small">
                {record.typeInvoice == 1 && !record.reembolsado && 
                <Tooltip title={i18n.t("invoiceList:refund")}>
                  <Button
                    type="primary"
                    size="middle"
                    icon={TableIcons.getTableIcon(TableIcons.TableIcon.arrowLeft)}
                    onClick={() =>
                        onClickRefund(record.order)
                    }
                  />
                </Tooltip>
                }
                <Tooltip title={i18n.t("buttons:download")}>
                  <Button
                    type="primary"
                    size="middle"
                    icon={TableIcons.getTableIcon(TableIcons.TableIcon.download)}
                    onClick={() =>
                        onClickDownload(record.idInvoice)
                    }
                  />
                </Tooltip>
              </Space>
            </>
          ),
    }
    ];

};

export default tableColumns;