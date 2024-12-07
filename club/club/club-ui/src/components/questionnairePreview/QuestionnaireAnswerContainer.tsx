import { FormInstance } from "antd";
import { Store } from "antd/es/form/interface";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QuestionnaireQuestionGroup from "./QuestionnaireQuestionGroup";
import QuestionnaireStepper from "./QuestionnaireStepper";
//import SurveyContainer from "./SurveyContainer";
import { FormErrorField } from "types/entities/FormErrorField";
import {
	QuestionData,
	QuestionGroupData,
	QuestionInputData,
	QuestionnaireQuestionAnswer,
} from "types/entities/Questionnaire";
import valueData from "types/entities/valueData";
import enumTypeOfInputs from "types/enums/enumTypeOfInputs";
import { Rest } from "utils/utils";
import "./Questionnaire.scss";

interface IProps {
	idQuestionnaire: number;
	groups: QuestionGroupData[];
	answers?: QuestionnaireQuestionAnswer[];
	disabled?: boolean;
	closeModal?: () => void;
	//questions: QuestionData[];
	//inputs: QuestionInputData[];
	//values: valueData[];
	//numGroups: number;
}

const QuestionnaireAnswerContainer = (props: IProps) => {
	const { t } = useTranslation("questionnaireUser");

	const [loaded, setLoaded] = useState(false);
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<QuestionnaireQuestionAnswer[]>(
		[] as QuestionnaireQuestionAnswer[]
	);
	const [disabled, setDisabled] = useState<boolean>(false);

	const [numGroups, setNumGroups] = useState<number>();
	const [questions, setQuestions] = useState<QuestionData[]>();
	const [inputs, setInputs] = useState<QuestionInputData[]>();
	const [values, setValues] = useState<valueData[]>();

	useEffect(() => {
		setNumGroups(props.groups.length!);
		setLoaded(false);

		Rest<{ type: string; idCuestionario: number }, QuestionData[]>()
			.operation({
				type: "SelectListOfPreguntas",
				idCuestionario: props.idQuestionnaire!,
			})
			.then((response1) => {
				Rest<{ type: string; idCuestionario: number }, QuestionInputData[]>()
					.operation({
						type: "SelectCuestionarioEntradaPreguntaByCuestionario",
						idCuestionario: props.idQuestionnaire!,
					})
					.then((response2) => {
						Rest<{ type: string; idCuestionario: number }, valueData[]>()
							.operation({
								type: "SelectValorEntradaPreguntaByCuestionario",
								idCuestionario: props.idQuestionnaire!,
							})
							.then((response3) => {
								setQuestions(response1);
								setInputs(response2);
								setValues(response3);
								setLoaded(true);
							});
					});
			});

		if (props.answers !== undefined) {
			setAnswers(props.answers);
		}

		if (props.disabled === true) {
			setDisabled(true);
		}
	}, []);

	useEffect(() => {
		if (numGroups && step >= numGroups && props.closeModal) {
			setStep(0);
			props.closeModal();
		}
	}, [step]);

	const onNextStep = (newAnswers?: QuestionnaireQuestionAnswer[]) => {
		setStep(step + 1);
		const currentAnswers = answers;

		if (newAnswers && !props.disabled) {
			newAnswers.forEach((e) => {
				const index = currentAnswers.findIndex((f) => f.idEntradaPregunta === e.idEntradaPregunta);

				if (index >= 0) {
					currentAnswers[index] = e;
				} else {
					currentAnswers.push(e);
				}
			});
		}

		setAnswers(currentAnswers);
	};

	const onBackStep = () => {
		setStep(step - 1);
	};

	const validateAndSave = (form: FormInstance) => {
		const groupAnswers = [] as QuestionnaireQuestionAnswer[];
		const formValues = form.getFieldsValue();
		Object.entries(formValues).map(([key, value]) => {
			const idEntradaPregunta = parseInt(key, 10);

			const entradaPregunta = inputs?.find(
				(input) => input.idEntradaPregunta === idEntradaPregunta
			);

			if (value === undefined) {
				groupAnswers.push({
					idEntradaPregunta: idEntradaPregunta,
				});
			} else {
				if (entradaPregunta?.typeEntrada === enumTypeOfInputs.TEXT && typeof value === "string") {
					groupAnswers.push({
						idEntradaPregunta: idEntradaPregunta,
						valueTexto: value,
					});
				} else {
					if (typeof value === "string") {
						var idValorEntrada = parseInt(value);
						groupAnswers.push({
							idEntradaPregunta: idEntradaPregunta,
							idValorEntrada,
						});
					} else if (typeof value === "number") {
						groupAnswers.push({
							idEntradaPregunta: idEntradaPregunta,
							idValorEntrada: value,
						});
					}
				}
			}
		});
		onNextStep(groupAnswers);
	};

	const validate = (values: Store) => {
		return new Promise((resolve: (f: FormErrorField[]) => void) => {
			let errors: FormErrorField[] = [];
			resolve(errors);
		});
	};

	return loaded ? (
		numGroups! > 0 ? (
			<div className="card-secondary">
				<QuestionnaireStepper
					groups={props.groups!}
					step={step!}
					numGroups={numGroups!}></QuestionnaireStepper>
			<div className="card-entry">
				<QuestionnaireQuestionGroup
					groups={props.groups!}
					questions={questions!}
					inputs={inputs!}
					validateAndSave={validateAndSave}
					values={values!}
					step={step!}
					answers={answers}
					numGroups={numGroups!}
					onNextStep={onNextStep}
					onBackStep={onBackStep}
					disabled={disabled}
					
				/></div>
			</div>
		) : (
			<div className="card-secondary">
				<div className="questionnaire-tree--vacio">{"NO PREVIEW"}</div>
			</div>
		)
	) : (
		<></>
	);
};

export default QuestionnaireAnswerContainer;
