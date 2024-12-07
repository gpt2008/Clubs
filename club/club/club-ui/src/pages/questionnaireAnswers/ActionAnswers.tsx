import { Button, Modal } from "antd";
import QuestionnaireAnswerContainer from "components/questionnairePreview/QuestionnaireAnswerContainer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QuestionGroupData, QuestionnaireQuestionAnswer } from "types/entities/Questionnaire";
import { Rest } from "utils/utils";

interface IProps {
	idQuestionnaire: number;
	idRespuestas: number;
}

const ActionAnswers = (props: IProps) => {
	const { t } = useTranslation("questionnaireAnswers");
	const [answerModal, setAnswerModal] = useState<boolean>(false);
	const [answers, setAnswers] = useState<QuestionnaireQuestionAnswer[]>(
		[] as QuestionnaireQuestionAnswer[]
	);
	const [groups, setGroups] = useState<QuestionGroupData[]>([] as QuestionGroupData[]);

	useEffect(() => {
		Rest<{ type: string; idCuestionario: number }, QuestionGroupData[]>()
			.operation({
				type: "SelectCuestionarioPreguntaGrupoByIdCuestionario",
				idCuestionario: props.idQuestionnaire,
			})
			.then((response) => {
				setGroups(response);
				//setNumGroups(response.length);
			});

		Rest<{ type: string; idRespuestas: number }, QuestionnaireQuestionAnswer[]>()
			.operation({
				type: "SelectRespuestasPaciente",
				idRespuestas: props.idRespuestas,
			})
			.then((response) => {
				setAnswers(response);
			});
	}, []);

	const closeModal = () => {
		setAnswerModal(false);
	};

	return (
		<>
			<Modal
				open={answerModal}
				onCancel={() => {
					setAnswerModal(false);
				}}
				width={800}
				footer={<></>}>
				<QuestionnaireAnswerContainer
					idQuestionnaire={props.idQuestionnaire}
					groups={groups}
					answers={answers}
					closeModal={closeModal}
					disabled></QuestionnaireAnswerContainer>
			</Modal>
			<Button
				type="primary"
				onClick={() => {
					//getAnswers();
					setAnswerModal(true);
				}}>
				{t("seemore")}
			</Button>
		</>
	);
};

export default ActionAnswers;
