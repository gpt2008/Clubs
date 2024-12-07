import { Button, Form, FormInstance } from "antd";
import { useTranslation } from "react-i18next";
import {
	QuestionData,
	QuestionGroupData,
	QuestionInputData,
	QuestionnaireQuestionAnswer,
} from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import QuestionnaireQuestion from "./QuestionnaireQuestion";

const QuestionnaireQuestionGroup = (props: {
	groups: QuestionGroupData[];
	numGroups: number;
	step: number;
	questions: QuestionData[];
	inputs: QuestionInputData[];
	values: valueData[];
	answers: QuestionnaireQuestionAnswer[];
	disabled: boolean;
	onNextStep: (newAnswers?: any[]) => void;
	onBackStep: () => void;
	validateAndSave: (form: FormInstance) => void;
}) => {
	const [form] = Form.useForm();

	const group = props.groups.filter((g) => {
		if (g.valueOrder == props.step + 1 || g.valueOrder == 0) return g;
	})[0];

	const { t } = useTranslation(["questionnaireForm"]);

	return (
		<Form layout="horizontal" form={form} size="large">
			{props.step < props.numGroups && (
				<QuestionnaireQuestion
					questions={props.questions.filter((q) => q.idPreguntaGrupo == group.idPreguntaGrupo)}
					inputs={props.inputs}
					values={props.values}
					answers={props.answers}
					disabled={props.disabled}
					form={form}></QuestionnaireQuestion>
			)}

			{props.step < props.numGroups && (
				<div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
					{group.valueOrder != 1 && group.valueOrder != 0 && (
						<Button className="backButton" danger onClick={() => props.onBackStep()}>
							{t("backButton")}
						</Button>
					)}
					{group.valueOrder != 0 && group.valueOrder != props.numGroups && (
						<Button
							className="nextButton"
							type="primary"
							onClick={() => {
								props.validateAndSave(form);
							}}>
							{t("nextButton")}
						</Button>
					)}
					{group.valueOrder == props.numGroups && (
						<Button
							className="nextButton"
							type="primary"
							onClick={() => {
								props.validateAndSave(form);
							}}>
							{t("finishButton")}
						</Button>
					)}
				</div>
			)}
		</Form>
	);
};

export default QuestionnaireQuestionGroup;
