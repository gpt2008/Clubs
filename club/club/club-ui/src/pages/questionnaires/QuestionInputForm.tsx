import React, { useState } from "react";

import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tooltip,
	Typography,
} from "antd";
import { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal/Modal";
import { Option } from "rc-select";
import { AlignType } from "rc-table/lib/interface";
import { useTranslation } from "react-i18next";
import valueData from "types/entities/valueData";
import enumMandatory from "types/enums/enumMandatory";
import enumTypeOfDisplay from "types/enums/enumTypeOfDisplay";
import enumTypeOfInputs from "types/enums/enumTypeOfInputs";
import enumValueSize from "types/enums/enumValueSize";
import { TableIcons } from "utils/utils";
import { IState } from "./QuestionInputFormContainer";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: any;
	inputType: "number" | "text";
	record: valueData;
	index: number;
	children: React.ReactNode;
}

const EditableCell = (props: EditableCellProps) => {
	const inputNode = props.inputType === "number" ? <InputNumber /> : <Input />;
	return (
		<td>
			{props.editing ? (
				<Form.Item
					name={props.dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${props.title}!`,
						},
					]}>
					{inputNode}
				</Form.Item>
			) : (
				props.children
			)}
		</td>
	);
};

const QuestionInputForm = (
	props: {
		idQuestion?: number;
		idQuestionInput?: number;
		visible?: boolean;
		onCancel: () => void;
		validateAndSave: (form: FormInstance, data: valueData[]) => void;
	} & IState
) => {
	const [form] = Form.useForm();
	const [data, setData] = useState(props.data!);
	const [previous, setPrevious] = useState(<></>);

	const { t } = useTranslation(["questionnaireForm"]);

	const [editingKey, setEditingKey] = useState(0);

	const [count, setCount] = useState(props.idQuestionInput ? data.length + 1 : 1);

	const isEditing = (record: any) => record.key === editingKey;

	const edit = (record: any) => {
		form.setFieldsValue({
			nameValue: "",
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey(0);
	};

	const save = async (key: any) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key!);

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				setData(newData);
				setEditingKey(0);
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey(0);
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const typeOptionsInput = (type: number) => {
		return (
			<Option key={type} value={type} label={t("typeOfInputs:" + type)}>
				{t("typeOfInputs:" + type)}
			</Option>
		);
	};

	const typeOptionsDisplay = (type: number) => {
		return (
			<Option key={type} value={type} label={t("typeOfDisplay:" + type)}>
				{t("typeOfDisplay:" + type)}
			</Option>
		);
	};

	const typeOptionsMandatory = (type: number) => {
		return (
			<Option key={type} value={type} label={t("mandatory:" + type)}>
				{t("mandatory:" + type)}
			</Option>
		);
	};

	const typeOptionsValueSize = (type: number) => {
		return (
			<Option key={type} value={type} label={t("valueSize:" + type)}>
				{t("valueSize:" + type)}
			</Option>
		);
	};

	const columns = [
		{
			title: t("labelTableText"),
			dataIndex: "nameValue",
			width: "2rem",
			ellipsis: true,
			editable: true,
		},
		{
			title: "",
			dataIndex: "idQuestionnaire",
			width: "1rem",
			align: "right" as AlignType,
			render: (value: any, record: any) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.key)}
							style={{
								marginRight: 8,
							}}>
							Save
						</Typography.Link>
						<Popconfirm title={t("cancelText")} onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<Space size="small">
						<Tooltip title={t("valuesEditionButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.edit)}
								size="small"
								onClick={() => edit(record)}
							/>
						</Tooltip>

						<Tooltip title={t("valuesDeleteButton")}>
							<Popconfirm title={t("deleteText")} onConfirm={() => handleDelete(record.key)}>
								<Button
									type="primary"
									icon={TableIcons.getTableIcon(TableIcons.TableIcon.trash)}
									danger
									size="small"
								/>
							</Popconfirm>
						</Tooltip>
						<Tooltip title={t("valuesUpButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.chevronUp)}
								size="small"
								disabled={record.valueOrder == 1}
								onClick={() => handleMove(record, +1)}
							/>
						</Tooltip>
						<Tooltip title={t("valuesDownButton")}>
							<Button
								type="primary"
								icon={TableIcons.getTableIcon(TableIcons.TableIcon.chevronDown)}
								size="small"
								disabled={record.valueOrder == data.length}
								onClick={() => handleMove(record, -1)}
							/>
						</Tooltip>
					</Space>
				);
			},
		},
	];

	const handleMove = (Record: valueData, Direction: number) => {
		if (Direction == 1) {
			const DataAbove = data.filter((item) => item.valueOrder == Record.valueOrder! - 1);
			if (DataAbove[0] != undefined) {
				const beforeOrder = Record.valueOrder;
				const beforeKey = Record.key;
				Record.valueOrder = DataAbove[0].valueOrder;
				Record.key = DataAbove[0].key;
				DataAbove[0].valueOrder = beforeOrder;
				DataAbove[0].key = beforeKey;
				setData([...data.sort((a, b) => a.valueOrder! - b.valueOrder!)]);
			}
		} else {
			const DataBelow = data.filter((item) => item.valueOrder == Record.valueOrder! + 1);
			if (DataBelow[0] != undefined) {
				const beforeOrder = Record.valueOrder;
				const beforeKey = Record.key;
				Record.valueOrder = DataBelow[0].valueOrder;
				Record.key = DataBelow[0].key;
				DataBelow[0].valueOrder = beforeOrder;
				DataBelow[0].key = beforeKey;
				setData([...data.sort((a, b) => a.valueOrder! - b.valueOrder!)]);
			}
		}
	};

	const handleAdd = () => {
		const newData: valueData = {
			key: "n" + (data ? data.length + 1 : 1),
			nameValor: "",
			valueOrder: data ? data.length + 1 : 1,
		};
		if (data != undefined) {
			if (data.length != 0) {
				if (data[data.length - 1].nameValor != "") {
					setData([...data, newData]);
					edit(newData);
				}
			} else {
				setData([newData]);
				edit(newData);
			}
		} else {
			setData([newData]);
			edit(newData);
		}
	};

	const handleDelete = (key: any) => {
		const newData = data.filter((item) => item.key! !== key);
		const deletePosition = data.filter((item) => item.key! == key)[0].valueOrder!;
		const notChangeValueOrder = newData.filter((i) => i.valueOrder! < deletePosition);
		const toChangeValueOrder = newData.filter((i) => i.valueOrder! > deletePosition);

		for (var i = 0; i < toChangeValueOrder.length; i++) {
			toChangeValueOrder[i].valueOrder = toChangeValueOrder[i].valueOrder! - 1;
			toChangeValueOrder[i].key = "n" + (toChangeValueOrder[i].valueOrder! - 1);
		}
		setData(notChangeValueOrder.concat(toChangeValueOrder));
	};

	const renderTitle = () => {
		return (
			<>
				<h2 className="titleValueTable">
					<b>{t("valuesTableTitle")}</b>&nbsp;&nbsp;
					<Tooltip title={t("valuesAddButton")}>
						<Button
							type="primary"
							icon={TableIcons.getTableIcon(TableIcons.TableIcon.plus)}
							size="small"
							onClick={() => handleAdd()}>
							&nbsp;&nbsp;{t("addValuesText")}
						</Button>
					</Tooltip>
				</h2>
			</>
		);
	};

	const initialValues = props.questionInputData && {
		inputTitle: props.questionInputData.nameEtiqueta,
		typeInput: props.questionInputData.typeEntrada,
		typeDisplay: props.questionInputData.typeVisualizacion,
		flagMandatory: props.questionInputData.flagObligatorio,
		idInputValueMandatory: props.questionInputData.idValorEntradaObligatorio,
		valueSize: props.questionInputData.valueTamanio,
		idInputValueOptional: props.questionInputData.idValorEntradaOpcional,
	};

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record: any) => ({
				record,
				inputType: "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Modal
			title={
				<span>
					{props.idQuestionInput ? t("editQuestionInputTitle") : t("newQuestionInputTitle")}
				</span>
			}
			style={{ top: 40 }}
			onOk={() => props.validateAndSave(form, data)}
			onCancel={props.onCancel}
			visible={props.visible}
			destroyOnClose
			width="30rem"
			okText={t("buttons:save")}
			cancelText={t("buttons:cancel")}>
			<Form layout="vertical" form={form} size="large" initialValues={initialValues}>
				<Row gutter={12}>
					<Col span={24}>
						<Form.Item label={t("inputTitleField")} name="inputTitle">
							<Input maxLength={256} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={12}>
					<Col span={12}>
						<Form.Item name="typeInput" label={t("typeInputField")} rules={[{ required: true }]}>
							<Select
								disabled={props.idQuestionInput ? true : false}
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}>
								{typeOptionsInput(enumTypeOfInputs.RADIO)}
								{typeOptionsInput(enumTypeOfInputs.TEXT)}
								{typeOptionsInput(enumTypeOfInputs.COMBO)}
								{typeOptionsInput(enumTypeOfInputs.FACES)}
								{typeOptionsInput(enumTypeOfInputs.STARS)}
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name="typeDisplay"
							label={t("typeDisplayField")}
							rules={[{ required: true }]}>
							<Select
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}>
								{typeOptionsDisplay(enumTypeOfDisplay.INLINE)}
								{typeOptionsDisplay(enumTypeOfDisplay.BLOCK)}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={12}>
					<Col span={12}>
						<Form.Item
							name="flagMandatory"
							label={t("mandatoryField")}
							rules={[{ required: true }]}>
							<Select
								filterOption={(input, option) =>
									("" + option?.label).toUpperCase().includes(input.toUpperCase())
								}>
								{typeOptionsMandatory(enumMandatory.NOMANDATORY)}
								{typeOptionsMandatory(enumMandatory.MANDATORY)}
								{typeOptionsMandatory(enumMandatory.MANDATORYIFPREVIOUS)}
								{typeOptionsMandatory(enumMandatory.OPTIONALIFPREVIOUS)}
							</Select>
						</Form.Item>
					</Col>
					<Form.Item shouldUpdate noStyle>
						{() =>
							form.getFieldValue("flagMandatory") === 3 && (
								<Col span={12}>
									<Form.Item
										name="idInputValueMandatory"
										label={t("previousValueField")}
										rules={[{ required: true }]}>
										<Select
											filterOption={(input, option) =>
												("" + option?.label).toUpperCase().includes(input.toUpperCase())
											}>
											<>
												{props.previousInputs?.map((v) => {
													return props.previousInputsValues
														?.filter((valor) => valor.idEntradaPregunta == v.idEntradaPregunta)
														.map((value) => {
															return (
																<Option
																	key={value.idValorEntrada}
																	value={value.idValorEntrada!}
																	label={"v"}>
																	{t("typeOfInputs:" + v.typeEntrada) +
																		" " +
																		(v.nameEtiqueta ? v.nameEtiqueta : "") +
																		" " +
																		props
																			.previousInputsValues!.filter(
																				(i) => i.idEntradaPregunta == v.idEntradaPregunta
																			)
																			.map((val) => {
																				return "'" + val.nameValor + "' ";
																			}) +
																		": " +
																		value.nameValor}
																</Option>
															);
														});
												})}
											</>
										</Select>
									</Form.Item>
								</Col>
							)
						}
					</Form.Item>
					<Form.Item shouldUpdate noStyle>
						{() =>
							form.getFieldValue("flagMandatory") === 4 && (
								<Col span={12}>
									<Form.Item
										name="idInputValueOptional"
										label={t("previousValueField")}
										rules={[{ required: true }]}>
										<Select
											filterOption={(input, option) =>
												("" + option?.label).toUpperCase().includes(input.toUpperCase())
											}>
											<>
												{props.previousInputs?.map((v) => {
													return props.previousInputsValues
														?.filter((valor) => valor.idEntradaPregunta == v.idEntradaPregunta)
														.map((value) => {
															return (
																<Option
																	key={value.idValorEntrada}
																	value={value.idValorEntrada!}
																	label={"v"}>
																	{t("typeOfInputs:" + v.typeEntrada) +
																		" " +
																		(v.nameEtiqueta ? v.nameEtiqueta : "") +
																		" " +
																		props
																			.previousInputsValues!.filter(
																				(i) => i.idEntradaPregunta == v.idEntradaPregunta
																			)
																			.map((val) => {
																				return "'" + val.nameValor + "' ";
																			}) +
																		": " +
																		value.nameValor}
																</Option>
															);
														});
												})}
											</>
										</Select>
									</Form.Item>
								</Col>
							)
						}
					</Form.Item>
				</Row>
				<Form.Item shouldUpdate noStyle>
					{() =>
						form.getFieldValue("typeInput") === 2 && (
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item
										name="valueSize"
										label={t("valueTextSizeField")}
										rules={[{ required: true }]}>
										<Select
											filterOption={(input, option) =>
												("" + option?.label).toUpperCase().includes(input.toUpperCase())
											}>
											{typeOptionsValueSize(enumValueSize.SMALL)}
											{typeOptionsValueSize(enumValueSize.MEDIUM)}
											{typeOptionsValueSize(enumValueSize.BIG)}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						)
					}
				</Form.Item>
				<Form.Item shouldUpdate noStyle>
					{() =>
						(form.getFieldValue("typeInput") === 1 || form.getFieldValue("typeInput") === 3) && (
							<>
								{renderTitle()}
								<Table
									components={{
										body: {
											cell: EditableCell,
										},
									}}
									pagination={false}
									rowClassName="editable-row"
									dataSource={data}
									columns={mergedColumns}></Table>
							</>
						)
					}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default QuestionInputForm;
