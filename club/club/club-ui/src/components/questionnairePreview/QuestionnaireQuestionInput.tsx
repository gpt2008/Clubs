import { CSSProperties, useState } from "react";

import { Col, Flex, Form, FormInstance, Input, Radio, Rate, Row, Select } from "antd";
import { ColProps } from "antd/es/grid/col";
import { Option } from "rc-select";
import { useTranslation } from "react-i18next";
import { QuestionInputData, QuestionnaireQuestionAnswer } from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import "./Questionnaire.scss";

const QuestionnaireQuestionInput = (props: {
	inputs: QuestionInputData[];
	values: valueData[];
	answers: QuestionnaireQuestionAnswer[];
	disabled: boolean;
	form: FormInstance;
}) => {
	let listComponentsLine: JSX.Element[] = [];
	let returnList: JSX.Element[] = [];
	return (
		<>
			{props.inputs.map((input) => {
				const answers = props.answers.filter(
					(a) => a.idEntradaPregunta === input.idEntradaPregunta
				);
				console.log(answers);
				if (input.typeVisualizacion == 1) {
					listComponentsLine.push(
						<Form.Item shouldUpdate noStyle>
							{() => (
								<CreateInput
									answer={answers[0]}
									input={input}
									form={props.form}
									values={props.values}
									disabled={props.disabled}
								/>
							)}
						</Form.Item>
					);
					if (input.valueOrder == props.inputs.length) {
						returnList.push(
							<Form.Item shouldUpdate noStyle>
								{() => (
									<>
										<Row gutter={12} justify="space-between">
											{listComponentsLine.map((i) => {
												return i;
											})}
										</Row>
									</>
								)}
							</Form.Item>
						);
					}
				} else {
					if (listComponentsLine.length === 0) {
						returnList.push(
							<Form.Item shouldUpdate noStyle>
								{() => (
									<>
										<Row gutter={12} justify="space-between">
											<CreateInput
												answer={answers[0]}
												input={input}
												form={props.form}
												values={props.values}
												disabled={props.disabled}
											/>
										</Row>
									</>
								)}
							</Form.Item>
						);
					} else {
						let list = listComponentsLine;
						listComponentsLine = [];

						returnList.push(
							<Form.Item shouldUpdate noStyle>
								{() => (
									<>
										<Row gutter={12} justify="space-between">
											{list.map((i) => {
												return i;
											})}
										</Row>
										<Row gutter={12} justify="space-between">
											<CreateInput
												answer={answers[0]}
												input={input}
												form={props.form}
												values={props.values}
												disabled={props.disabled}
											/>
										</Row>
									</>
								)}
							</Form.Item>
						);
					}
				}
			})}

			{returnList}
		</>
	);
};

const CreateInput = (props: {
	form: FormInstance;
	input: QuestionInputData;
	answer: QuestionnaireQuestionAnswer;
	values?: valueData[];
	disabled: boolean;
}) => {
	switch (props.input.typeEntrada) {
		case 1:
			return (
				<InputRadio
					input={props.input}
					values={props.values!}
					mandatory={
						props.form.getFieldValue("I" + props.input.idEntradaObligatoria) ===
						props.input.idValorEntradaObligatorio
					}
					optional={
						props.form.getFieldValue("I" + props.input.idEntradaOpcional) ==
						props.input.idValorEntradaOpcional
					}
					answer={props.answer}
					disabled={props.disabled}
				/>
			);
		case 2:
			return (
				<InputText
					input={props.input}
					mandatory={
						props.form.getFieldValue("I" + props.input.idEntradaObligatoria) ==
						props.input.idValorEntradaObligatorio
					}
					optional={
						props.form.getFieldValue("I" + props.input.idEntradaOpcional) ==
						props.input.idValorEntradaOpcional
					}
					answer={props.answer}
					disabled={props.disabled}
				/>
			);
		case 3:
			return (
				<InputCombo
					input={props.input}
					values={props.values!}
					mandatory={
						props.form.getFieldValue("I" + props.input.idEntradaObligatoria) ===
						props.input.idValorEntradaObligatorio
					}
					optional={
						props.form.getFieldValue("I" + props.input.idEntradaOpcional) ==
						props.input.idValorEntradaOpcional
					}
					answer={props.answer}
					disabled={props.disabled}
				/>
			);
		case 4:
			return (
				<InputFaces
					form={props.form}
					input={props.input}
					values={props.values!}
					mandatory={
						props.form.getFieldValue("I" + props.input.idEntradaObligatoria) ===
						props.input.idValorEntradaObligatorio
					}
					optional={
						props.form.getFieldValue("I" + props.input.idEntradaOpcional) ==
						props.input.idValorEntradaOpcional
					}
					answer={props.answer}
					disabled={props.disabled}
				/>
			);
		case 5:
			return (
				<InputStars
					input={props.input}
					values={props.values!}
					mandatory={
						props.form.getFieldValue("I" + props.input.idEntradaObligatoria) ===
						props.input.idValorEntradaObligatorio
					}
					optional={
						props.form.getFieldValue("I" + props.input.idEntradaOpcional) ==
						props.input.idValorEntradaOpcional
					}
					answer={props.answer}
					disabled={props.disabled}
				/>
			);
	}
};

const InputText = (props: {
	input: QuestionInputData;
	mandatory: boolean;
	optional: boolean;
	answer: QuestionnaireQuestionAnswer;
	disabled: boolean;
}) => {
	let colProps: ColProps = {};
	let inputStyle: CSSProperties = {};

	if (props.input.typeVisualizacion === 2) {
		// block
		inputStyle = {
			width:
				props.input.valueTamanio === 1
					? "100px"
					: props.input.valueTamanio === 2
					? "200px"
					: "400px",
			border: "1px solid black",
		};
	} else {
		colProps = { sm: props.input.valueTamanio === 1 ? 6 : props.input.valueTamanio === 2 ? 8 : 12 };
	}

	return (
		<>	
		
			<Col span={24} {...colProps}>
				<Form.Item
					label={props.input.nameEtiqueta}
					name={props.input.idEntradaPregunta}
					labelCol={{ span: 24 }} 
					rules={[
						{
							required:
								props.input.flagObligatorio === 1
									? false
									: props.input.flagObligatorio === 2
									? true
									: props.input.flagObligatorio === 3
									? props.mandatory
									: !props.optional,
						},
					]}>
						
					<Input
						style={inputStyle}
						defaultValue={props.answer ? props.answer.valueTexto : ""}
						disabled={props.disabled}
					/>
				</Form.Item>
			</Col>
		</>
	);
};

const InputRadio = (props: {
	input: QuestionInputData;
	values: valueData[];
	mandatory: boolean;
	optional: boolean;
	answer: QuestionnaireQuestionAnswer;
	disabled: boolean;
}) => {
	return (
		<>
			<Col
				span={props.input.typeVisualizacion === 2 ? 24 : undefined}
				flex={props.input.typeVisualizacion === 1 ? "0 0 auto" : undefined}>
				<Form.Item
					name={props.input.idEntradaPregunta}
					label={props.input.nameEtiqueta}
					rules={[
						{
							required:
								props.input.flagObligatorio === 1
									? false
									: props.input.flagObligatorio === 2
									? true
									: props.input.flagObligatorio === 3
									? props.mandatory
									: !props.optional,
						},
					]}>
					<Radio.Group
						defaultValue={props.answer ? props.answer.idValorEntrada : null}
						disabled={props.disabled}>
						{props.values
							.filter((value) => value.idEntradaPregunta === props.input.idEntradaPregunta)
							.map((v) => {
								return <Radio value={v.idValorEntrada}>{v.nameValor}</Radio>;
							})}
					</Radio.Group>
				</Form.Item>
			</Col>
		</>
	);
};

const InputCombo = (props: {
	input: QuestionInputData;
	values: valueData[];
	mandatory: boolean;
	optional: boolean;
	answer: QuestionnaireQuestionAnswer;
	disabled: boolean;
}) => {
	return (
		<>
			<Col span={props.input.typeVisualizacion === 1 ? 12 : 24}>
				<Form.Item
					name={props.input.idEntradaPregunta}
					label={props.input.nameEtiqueta}
					rules={[
						{
							required:
								props.input.flagObligatorio === 1
									? false
									: props.input.flagObligatorio === 2
									? true
									: props.input.flagObligatorio === 3
									? props.mandatory
									: !props.optional,
						},
					]}>
					<Select
						defaultValue={props.answer ? props.answer.idValorEntrada : null}
						filterOption={(inp, option) =>
							("" + option?.label).toUpperCase().includes(inp.toUpperCase())
						}
						disabled={props.disabled}>
						{props.values
							.filter((value) => value.idEntradaPregunta === props.input.idEntradaPregunta)
							.map((v) => {
								return (
									<Option key={v.idValorEntrada} value={v.idValorEntrada!}>
										{v.nameValor}
									</Option>
								);
							})}
					</Select>
				</Form.Item>
			</Col>
		</>
	);
};

const InputFaces = (props: {
	form: FormInstance;
	input: QuestionInputData;
	values: valueData[];
	mandatory: boolean;
	optional: boolean;
	answer: QuestionnaireQuestionAnswer;
	disabled: boolean;
}) => {
	const { t } = useTranslation("questionnaireAnswers");
	const [selected, setSelected] = useState(props.answer ? props.answer.valueNumber : -1);

	const clearInputs = () => {
		setSelected(-1);
		props.form.setFieldValue(props.input.idEntradaPregunta, undefined);
	};

	return (
		<>
			<Col span={props.input.typeVisualizacion === 1 ? 12 : 24}>
				<Form.Item
					name={props.input.idEntradaPregunta}
					label={props.input.nameEtiqueta}
					rules={[
						{
							required:
								props.input.flagObligatorio === 1
									? false
									: props.input.flagObligatorio === 2
									? true
									: props.input.flagObligatorio === 3
									? props.mandatory
									: !props.optional,
						},
					]}>
					<Flex>
						<input
							name="faces"
							type="radio"
							id="0"
							value={0}
							className={props.disabled ? "smileys sad" : "smileys sad enabled"}
							disabled={props.disabled}
							checked={selected === 0}
							onChange={() => {
								setSelected(0);
							}}
						/>
						<input
							name="faces"
							type="radio"
							id="1"
							value={1}
							className={props.disabled ? "smileys neutral" : "smileys neutral enabled"}
							disabled={props.disabled}
							checked={selected === 1}
							onChange={() => {
								setSelected(1);
							}}
						/>
						<input
							name="faces"
							type="radio"
							id="2"
							value={2}
							className={props.disabled ? "smileys happy" : "smileys happy enabled"}
							disabled={props.disabled}
							checked={selected === 2}
							onChange={() => {
								setSelected(2);
							}}
						/>
						
					</Flex>
				</Form.Item>
			</Col>
		</>
	);
};

const InputStars = (props: {
	input: QuestionInputData;
	values: valueData[];
	mandatory: boolean;
	optional: boolean;
	answer: QuestionnaireQuestionAnswer;
	disabled: boolean;
}) => {
	return (
		<>
			<Col span={/*props.input.typeVisualizacion === 1 ? 12 :*/ 24}>
				<Form.Item
					name={props.input.idEntradaPregunta}
					label={props.input.nameEtiqueta}
					rules={[
						{
							required:
								props.input.flagObligatorio === 1
									? false
									: props.input.flagObligatorio === 2
									? true
									: props.input.flagObligatorio === 3
									? props.mandatory
									: !props.optional,
						},
					]}>
					<Rate disabled={props.disabled} defaultValue={props.answer ? props.answer.valueNumber : 0} />
				</Form.Item>
			</Col>
		</>
	);
};

export default QuestionnaireQuestionInput;
