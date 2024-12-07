import useMessage from "antd/es/message/useMessage";
import { useEffect, useState } from "react";
import Provider from "types/entities/Provider";
import { QuestionnaireListInformation } from "types/entities/Questionnaire";
import { GetQuestionnairePaged } from "types/operations/Questionnaire";
import { Rest } from "utils/utils";
import QuestionnaireAnswersList from "./QuestionnaireAnswersList";

const QuestionnaireAnswersContainer = () => {
	const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireListInformation[]>(
		[] as QuestionnaireListInformation[]
	);
	const [countData, setCountData] = useState(0);
	const [message, messageContext] = useMessage();
	const [providers, setProviders] = useState<Provider[]>([] as Provider[]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		loadData();
	}, []);

	const filterData = (
		offset?: number,
		providerId?: number,
		dateCompletado?: Date,
		dateAppointment?: Date
	) => {
		if (offset) {
			setPage(offset);
		} else {
			setPage(1);
		}

		Rest<
			GetQuestionnairePaged,
			{ limit: string; offset: string; dataCount: string; data: QuestionnaireListInformation[] }
		>()
			.operation({
				type: "SelectCuestionariosRespuestas",
				limit: 10,
				offset: offset ? (offset - 1) * 10 : 0,
				providerId: providerId,
				dateCompletado: dateCompletado,
				dateAppointmemt: dateAppointment,
			})
			.then((response) => {
				setQuestionnaireAnswers(response.data);
				setCountData(Number(response.dataCount));
			})
			.catch(() => {
				message.error("Error al cargar las citas.");
			});
	};

	const loadData = () => {
		filterData();
		Rest<{ type: string }, Provider[]>()
			.operation({ type: "SelectProviderByName" })
			.then((response) => {
				setProviders(response);
			});
	};

	const filterProviders = (inputValue: string, idOrganization?: number) => {
		if (inputValue != "") {
			Rest<{ type: string; inputValue: string; idOrganization?: number }, any>()
				.operation({
					type: "SelectProviderByName",
					inputValue: inputValue,
					idOrganization: idOrganization,
				})
				.then((response) => {
					setProviders(response);
				});
		}
	};

	return (
		<>
			{messageContext}
			<QuestionnaireAnswersList
				page={page}
				questionnaireAnswers={questionnaireAnswers}
				loadAnswersData={filterData}
				dataCount={countData}
				filterProviders={filterProviders}
				providers={providers}
			/>
		</>
	);
};

export default QuestionnaireAnswersContainer;
