import { faMapPin, faNeuter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Steps } from "antd";
import { useTranslation } from "react-i18next";
import { QuestionGroupData } from "types/entities/Questionnaire";
import "./Questionnaire.scss";

const QuestionnaireStepper = (props: {
	groups: QuestionGroupData[];
	numGroups: number;
	step: number;
}) => {
	const { t } = useTranslation(["questionnaireForm"]);
	const { Step } = Steps;

	const QSteps = () => {
		const stepList = props.groups.map((e, index) => (
			<Step
				className="step"
				key={e.idPreguntaGrupo}
				icon={
					<FontAwesomeIcon className="icon" icon={index === props.step ? faNeuter : faMapPin} />
				}
				title={e.valueOrder == 0 ? "Final" : e.nameGrupo}
				description={
					e.valueOrder == 0
						? ""
						: e.valueTiempoEstimado + " " + t("estimatedTimeUnits:" + e.valueUnidadTiempoEstimado)
				}
			/>
		));

		return (
			<>
			{props.numGroups > 1 ?
				<Steps className="steps" current={props.step} labelPlacement={"vertical"}>
					{stepList}
				</Steps> : <></> }
			</>
		);
	};

	return (
		<>
			<div>
				<QSteps />
			</div>
		</>
	);
};

export default QuestionnaireStepper;
