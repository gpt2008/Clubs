import { FormInstance } from "antd";
import { useTranslation } from "react-i18next";
import {
	QuestionData,
	QuestionInputData,
	QuestionnaireQuestionAnswer,
} from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import QuestionnaireQuestionInput from "./QuestionnaireQuestionInput";

const QuestionnaireQuestion = (props: {
	questions: QuestionData[];
	inputs: QuestionInputData[];
	answers: QuestionnaireQuestionAnswer[];
	values: valueData[];
	disabled: boolean;
	form: FormInstance;
}) => {
	const { t } = useTranslation(["questionnaireForm"]);

	return (
		<>
			{props.questions.map((question) => {
				return (
					<>
						<h2>{question.namePregunta}</h2>
						<QuestionnaireQuestionInput
							answers={props.answers}
							inputs={props.inputs.filter((i) => i.idPregunta === question.idPregunta)}
							values={props.values}
							disabled={props.disabled}
							form={props.form}></QuestionnaireQuestionInput>
					</>
				);
			})}
		</>
	);
};

export default QuestionnaireQuestion;
